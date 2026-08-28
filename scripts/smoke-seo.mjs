import { spawn } from "node:child_process";
import http from "node:http";
import { fileURLToPath } from "node:url";

const port = 4318;
const baseUrl = `http://127.0.0.1:${port}`;
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const nextCli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const expectedLang = { en: "en", es: "es", fr: "fr", de: "de-DE", ja: "ja", zh: "zh-CN" };

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${baseUrl}${path}`, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          buffer,
          body: buffer.toString("utf8"),
          contentType: String(res.headers["content-type"] || ""),
          location: String(res.headers.location || ""),
          status: res.statusCode ?? 0,
        });
      });
    });
    req.on("error", reject);
    req.setTimeout(10_000, () => req.destroy(new Error(`Timed out requesting ${path}`)));
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await request("/");
      if (response.status < 500) return;
    } catch {}
    await wait(500);
  }
  throw new Error("Next server did not become ready");
}

function decodeHtml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return decodeHtml((match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim());
}

function metaValue(html, key, keyAttribute = "name") {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    if (attribute(tag, keyAttribute).toLowerCase() === key.toLowerCase()) return attribute(tag, "content");
  }
  return "";
}

function linkTags(html, relation) {
  return (html.match(/<link\b[^>]*>/gi) || []).filter((tag) =>
    attribute(tag, "rel").toLowerCase().split(/\s+/).includes(relation),
  );
}

function linkValue(html, relation) {
  return attribute(linkTags(html, relation)[0] || "", "href");
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "")}${url.search}`;
  } catch {
    return value;
  }
}

function localeForPath(path) {
  return path.match(/^\/(es|fr|de|ja|zh)(?:\/|$)/)?.[1] ?? "en";
}

function internalPaths(html) {
  const paths = [];
  for (const tag of html.match(/<a\b[^>]*>/gi) || []) {
    const href = attribute(tag, "href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("javascript:")) continue;
    try {
      const parsed = new URL(href, baseUrl);
      if (parsed.origin === baseUrl && !parsed.pathname.startsWith("/_next/")) paths.push(`${parsed.pathname}${parsed.search}`);
    } catch {}
  }
  return paths;
}

function validateJsonLd(html, path) {
  for (const [, json] of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let parsed;
    try {
      parsed = JSON.parse(decodeHtml(json));
    } catch {
      throw new Error(`${path}: invalid JSON-LD`);
    }
    const serialized = JSON.stringify(parsed);
    if (/"price":"0"/.test(serialized) && /"SoftwareApplication"/.test(serialized)) {
      throw new Error(`${path}: paid-capable SoftwareApplication claims price 0`);
    }
  }
}

function validateHtml(path, productionUrl, html) {
  const locale = localeForPath(path);
  const isCjk = locale === "zh" || locale === "ja";
  const title = decodeHtml((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim());
  const description = metaValue(html, "description");
  const canonical = linkValue(html, "canonical");
  const ogImage = metaValue(html, "og:image", "property");
  const twitterImage = metaValue(html, "twitter:image");
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const lang = attribute(html.match(/<html\b[^>]*>/i)?.[0] || "", "lang");
  const issues = [];

  if (isCjk ? title.length < 8 || title.length > 45 : title.length < 15 || title.length > 65) issues.push(`title length ${title.length}`);
  if (isCjk ? description.length < 25 || description.length > 120 : description.length < 60 || description.length > 170) issues.push(`description length ${description.length}`);
  if (normalizeUrl(canonical) !== normalizeUrl(productionUrl)) issues.push(`canonical ${canonical || "missing"}`);
  if (!metaValue(html, "og:title", "property")) issues.push("missing og:title");
  if (!metaValue(html, "og:description", "property")) issues.push("missing og:description");
  if (!ogImage.startsWith("https://")) issues.push("missing absolute og:image");
  if (!metaValue(html, "twitter:card")) issues.push("missing twitter:card");
  if (!twitterImage.startsWith("https://")) issues.push("missing absolute twitter:image");
  if (h1Count !== 1) issues.push(`H1 count ${h1Count}`);
  if (lang !== expectedLang[locale]) issues.push(`lang ${lang || "missing"}`);
  if (/\bnoindex\b/i.test(metaValue(html, "robots"))) issues.push("noindex");
  if ((title.match(/LabelHelper/gi) || []).length > 1) issues.push("brand repeated");

  const alternates = new Map(
    linkTags(html, "alternate")
      .filter((tag) => attribute(tag, "hreflang"))
      .map((tag) => [attribute(tag, "hreflang"), attribute(tag, "href")]),
  );
  if (!alternates.has("x-default")) issues.push("missing x-default hreflang");
  if (normalizeUrl(alternates.get(locale) || "") !== normalizeUrl(productionUrl)) issues.push("missing self hreflang");

  validateJsonLd(html, path);
  if (issues.length) throw new Error(`${path}: ${issues.join(", ")}`);
  return { description, internalPaths: internalPaths(html), images: [ogImage, twitterImage], title };
}

async function validateRedirect(path, expectedPath) {
  const response = await request(path);
  const actual = response.location ? new URL(response.location, baseUrl).pathname : "";
  if (response.status !== 308 || actual !== expectedPath) {
    throw new Error(`${path}: expected 308 to ${expectedPath}, got ${response.status} to ${actual || "missing"}`);
  }
}

const server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: projectRoot,
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", (chunk) => process.stdout.write(chunk));
server.stderr.on("data", (chunk) => process.stderr.write(chunk));

try {
  await waitForServer();
  const sitemap = await request("/sitemap.xml");
  if (sitemap.status !== 200 || !/application\/xml|text\/xml/i.test(sitemap.contentType)) throw new Error("sitemap is not valid XML");

  const productionUrls = [...sitemap.body.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => decodeHtml(match[1]));
  if (productionUrls.length < 100) throw new Error(`sitemap coverage unexpectedly low: ${productionUrls.length}`);
  if (new Set(productionUrls).size !== productionUrls.length) throw new Error("sitemap contains duplicate URLs");

  const titles = new Map();
  const descriptions = new Map();
  const linkedPaths = new Set();
  const imagePaths = new Set();
  for (const productionUrl of productionUrls) {
    const parsed = new URL(productionUrl);
    const route = `${parsed.pathname}${parsed.search}`;
    const response = await request(route);
    if (response.status !== 200 || !/text\/html/i.test(response.contentType)) throw new Error(`${route}: HTTP ${response.status} ${response.contentType}`);
    const result = validateHtml(route, productionUrl, response.body);
    if (titles.has(result.title)) throw new Error(`duplicate title: ${result.title} (${titles.get(result.title)}, ${route})`);
    if (descriptions.has(result.description)) throw new Error(`duplicate description: ${descriptions.get(result.description)}, ${route}`);
    titles.set(result.title, route);
    descriptions.set(result.description, route);
    result.internalPaths.forEach((path) => linkedPaths.add(path));
    result.images.forEach((url) => imagePaths.add(`${new URL(url).pathname}${new URL(url).search}`));
  }

  for (const path of linkedPaths) {
    const response = await request(path);
    if (response.status !== 200) {
      throw new Error(`internal link ${path}: expected direct HTTP 200, received ${response.status}${response.location ? ` -> ${response.location}` : ""}`);
    }
  }

  for (const path of imagePaths) {
    const response = await request(path);
    if (response.status !== 200 || response.contentType !== "image/png") throw new Error(`social image ${path}: HTTP ${response.status} ${response.contentType}`);
    if (response.buffer.length < 24 || response.buffer.readUInt32BE(16) !== 1200 || response.buffer.readUInt32BE(20) !== 630) {
      throw new Error(`social image ${path}: expected 1200×630 PNG`);
    }
  }

  await validateRedirect("/en/guides", "/guides");
  await validateRedirect("/fr/guides", "/guides");
  await validateRedirect("/de/tools", "/tools");
  await validateRedirect("/ja/templates", "/templates");
  await validateRedirect("/es/tools/pdf-analyzer", "/tools/pdf-analyzer");
  await validateRedirect("/zh/about", "/about");

  const robots = await request("/robots.txt");
  if (robots.status !== 200 || !robots.body.includes("/sitemap.xml")) throw new Error("robots.txt is missing its sitemap directive");
  console.log(`SEO smoke passed: ${productionUrls.length} sitemap URLs, ${linkedPaths.size} internal paths, ${imagePaths.size} social image route(s), 6 redirect contracts.`);
} finally {
  server.kill("SIGTERM");
}
