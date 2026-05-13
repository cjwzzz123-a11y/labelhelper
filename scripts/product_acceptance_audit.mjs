#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const auditDir = path.join(root, ".planning/product-audits");
const logsDir = path.join(auditDir, "logs");
const stateFile = path.join(auditDir, ".state.json");
const latestFile = path.join(auditDir, "latest.md");
const notesFile = path.join(root, ".claude/PM_ACCEPTANCE_NOTES.md");
const strategyFile = path.join(auditDir, "inspection-strategy.md");
const baselineFile = path.join(auditDir, "label-parameter-baseline.md");
const lockDir = path.join(auditDir, ".run.lock");

mkdirSync(auditDir, { recursive: true });
mkdirSync(logsDir, { recursive: true });

const now = new Date();
const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const reportFile = path.join(auditDir, `${stamp}.md`);

function acquireLock() {
  try {
    mkdirSync(lockDir);
    writeFileSync(path.join(lockDir, "started_at"), now.toISOString());
    return true;
  } catch {
    try {
      const ageMinutes = (Date.now() - statSync(lockDir).mtimeMs) / 60000;
      if (ageMinutes > 45) {
        rmSync(lockDir, { recursive: true, force: true });
        mkdirSync(lockDir);
        writeFileSync(path.join(lockDir, "started_at"), now.toISOString());
        return true;
      }
    } catch {
      // If lock inspection fails, skip this run rather than risking overlapping audits.
    }
    const skip = `# Product Acceptance Audit

Generated: ${now.toISOString()}

Status: **SKIPPED**

Another audit run is still active. This run exited without touching build output or product files.
`;
    writeFileSync(latestFile, skip);
    console.log("Product audit skipped: another run is active");
    return false;
  }
}

function releaseLock() {
  rmSync(lockDir, { recursive: true, force: true });
}

if (!acquireLock()) process.exit(0);

process.on("exit", releaseLock);

function rel(file) {
  return path.relative(root, file) || ".";
}

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

function listFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", "coverage"].includes(name)) continue;
    const file = path.join(dir, name);
    const st = statSync(file);
    if (st.isDirectory()) listFiles(file, acc);
    else acc.push(file);
  }
  return acc;
}

function run(name, command, options = {}) {
  const started = Date.now();
  try {
    const output = execSync(command, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 16,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    });
    return { name, command, ok: true, seconds: ((Date.now() - started) / 1000).toFixed(1), output: trimOutput(output, options.lines ?? 80) };
  } catch (error) {
    const output = `${error.stdout ?? ""}\n${error.stderr ?? ""}`.trim();
    return { name, command, ok: false, seconds: ((Date.now() - started) / 1000).toFixed(1), output: trimOutput(output, options.lines ?? 120) };
  }
}

function trimOutput(output, lines) {
  const all = output.trim().split(/\r?\n/).filter(Boolean);
  return all.slice(Math.max(0, all.length - lines)).join("\n");
}

function loadState() {
  try {
    return JSON.parse(read(stateFile) || "{}");
  } catch {
    return {};
  }
}

function saveState(state) {
  writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);
}

function minutesSince(value) {
  if (!value) return Number.POSITIVE_INFINITY;
  return (Date.now() - new Date(value).getTime()) / 60000;
}

const sourceFiles = [
  ...listFiles(path.join(root, "app")),
  ...listFiles(path.join(root, "components")),
  ...listFiles(path.join(root, "data")),
  ...listFiles(path.join(root, "messages")),
  ...listFiles(path.join(root, "lib")),
].filter((file) => /\.(tsx?|jsx?|json|md)$/.test(file));

const visibleTextCorpus = sourceFiles
  .filter((file) => !rel(file).includes(".test."))
  .map((file) => ({ file, text: read(file) }));

function routeExists(route) {
  const normalized = route === "/" ? "page.tsx" : `${route.replace(/^\//, "")}/page.tsx`;
  const direct = path.join(root, "app", normalized);
  if (existsSync(direct)) return { ok: true, via: rel(direct) };

  const localePath = route === "/" ? "[locale]/page.tsx" : `[locale]/${route.replace(/^\//, "")}/page.tsx`;
  const localized = path.join(root, "app", localePath);
  if (existsSync(localized)) return { ok: true, via: rel(localized) };

  const seoDynamic = path.join(root, "app/[locale]/[slug]/page.tsx");
  const seoSlugs = ["etsy-shipping-label-size", "shopify-shipping-label-size", "ebay-shipping-label-size", "amazon-fba-label-size", "usps-shipping-label-size", "ups-label-size", "fedex-label-size", "dhl-shipping-label-size", "4x6-shipping-label-template", "a4-shipping-label-template", "letter-shipping-label-template", "shipping-label-printing-too-small", "shipping-label-cut-off-when-printing", "shipping-label-barcode-not-scanning", "shipping-label-not-centered", "fit-to-page-vs-actual-size-shipping-label"];
  if (seoSlugs.includes(route.replace(/^\//, "")) && existsSync(seoDynamic)) return { ok: true, via: rel(seoDynamic) };

  return { ok: false, via: "missing" };
}

function checkRoutes() {
  const routes = ["/", "/tools", "/guides", "/templates", "/pricing", "/tools/size-checker", "/tools/calibration-sheet", "/tools/pdf-analyzer", "/tools/test-print-pack", "/tools/barcode-quiet-zone-checker", "/tools/scale-calculator", "/etsy-shipping-label-size", "/shopify-shipping-label-size", "/ebay-shipping-label-size", "/amazon-fba-label-size", "/usps-shipping-label-size", "/ups-label-size", "/fedex-label-size", "/dhl-shipping-label-size", "/4x6-shipping-label-template", "/a4-shipping-label-template", "/letter-shipping-label-template", "/shipping-label-printing-too-small", "/shipping-label-cut-off-when-printing", "/shipping-label-barcode-not-scanning", "/shipping-label-not-centered", "/fit-to-page-vs-actual-size-shipping-label", "/about", "/privacy", "/terms"];
  return routes.map((route) => ({ route, ...routeExists(route) }));
}

function scanRiskClaims() {
  const rules = [
    { label: "Unimplemented or planning marker", pattern: /\b(TODO|FIXME|placeholder|lorem ipsum|coming soon)\b/i, severity: "medium" },
    { label: "Over-strong certification claim", pattern: /\b(guaranteed|certified|carrier-approved|officially accepted|full compliance)\b/i, severity: "high" },
    { label: "Workspace feature claim", pattern: /\b(batch|team members|API access|50 files|1000 calls)\b/i, severity: "medium" },
    { label: "Report export claim", pattern: /\b(download full report|export report|printable diagnostic)\b/i, severity: "medium" },
    { label: "Possibly absolute privacy wording", pattern: /\b(never leaves your browser|no upload to server)\b/i, severity: "low" },
  ];

  const findings = [];
  for (const { file, text } of visibleTextCorpus) {
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const rule of rules) {
        if (rule.pattern.test(line)) {
          findings.push({ ...rule, file: rel(file), line: index + 1, text: line.trim().slice(0, 220) });
        }
      }
    });
  }
  return findings;
}

function flattenKeys(obj, prefix = "") {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
  return Object.entries(obj).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === "object" && !Array.isArray(value) ? flattenKeys(value, next) : [next];
  });
}

function checkI18n() {
  const messagesDir = path.join(root, "messages");
  const en = JSON.parse(read(path.join(messagesDir, "en.json")) || "{}");
  const enKeys = new Set(flattenKeys(en));
  return readdirSync(messagesDir)
    .filter((name) => name.endsWith(".json") && name !== "en.json")
    .map((name) => {
      const json = JSON.parse(read(path.join(messagesDir, name)) || "{}");
      const keys = new Set(flattenKeys(json));
      const missing = [...enKeys].filter((key) => !keys.has(key));
      const extra = [...keys].filter((key) => !enKeys.has(key));
      return { locale: name.replace(".json", ""), missing, extra };
    });
}

function checkParameters() {
  const rules = read(path.join(root, "data/rules.ts"));
  const templates = read(path.join(root, "lib/template-pdfs.ts"));
  const barcode = read(path.join(root, "components/tools/BarcodeQuietZoneChecker.tsx"));
  const checks = [
    { label: "4x6 is 101.6 x 152.4 mm in rules", ok: /width_mm:\s*101\.6,\s*height_mm:\s*152\.4/.test(rules) },
    { label: "A4 is 210 x 297 mm in rules", ok: /width_mm:\s*210,\s*height_mm:\s*297/.test(rules) },
    { label: "Letter is 215.9 x 279.4 mm in rules", ok: /width_mm:\s*215\.9,\s*height_mm:\s*279\.4/.test(rules) },
    { label: "Templates include 4x6 physical dimensions", ok: /widthIn:\s*4,\s*heightIn:\s*6,\s*widthMm:\s*101\.6,\s*heightMm:\s*152\.4/.test(templates) },
    { label: "Barcode checker uses 2.5 mm minimum", ok: /MIN_LINEAR_QUIET_ZONE_MM\s*=\s*2\.5/.test(barcode) },
    { label: "Baseline document exists", ok: existsSync(baselineFile) },
  ];
  return checks;
}

function checkImplementationBoundaries() {
  const pdf = read(path.join(root, "components/tools/PdfAnalyzer.tsx"));
  const barcode = read(path.join(root, "components/tools/BarcodeQuietZoneChecker.tsx"));
  const pricing = read(path.join(root, "app/pricing/page.tsx")) + "\n" + read(path.join(root, "app/[locale]/pricing/page.tsx"));
  const legacyTemplateRoute = read(path.join(root, "app/template-downloads/[slug]/route.ts"));
  return [
    { label: "PDF Analyzer explains local browser processing", ok: /local|browser|never leaves|no upload/i.test(pdf) },
    { label: "PDF Analyzer avoids claiming full barcode detection as implemented", ok: !/full.*barcode.*detect|detects every barcode|certified/i.test(pdf) },
    { label: "Barcode checker uses estimate/risk language", ok: /estimate|risk|may scan|review/i.test(barcode) },
    { label: "Pricing marks Workspace future/batch features as planned or preview", ok: !/\bAPI access\b|\bteam members\b|\b50 files\b/.test(pricing) || /planned|preview|not connected|remain planned/i.test(pricing) },
    { label: "Old template download route redirects to canonical template API", ok: /NextResponse\.redirect/.test(legacyTemplateRoute) && /\/api\/templates\//.test(legacyTemplateRoute) && /getTemplateSpec/.test(legacyTemplateRoute) },
  ];
}

function updateStrategy({ riskFindings, routeResults, boundaryResults, parameterResults }) {
  let strategy = read(strategyFile);
  const additions = [];
  const missingRoutes = routeResults.filter((item) => !item.ok);
  const failedBoundaries = boundaryResults.filter((item) => !item.ok);
  const failedParameters = parameterResults.filter((item) => !item.ok);
  const highRisk = riskFindings.filter((item) => item.severity === "high");

  if (missingRoutes.length && !strategy.includes("Auto-watch missing PRD routes")) {
    additions.push("Auto-watch missing PRD routes because at least one MVP route was not resolved by static or dynamic page files.");
  }
  if (failedBoundaries.length && !strategy.includes("Auto-watch capability boundary failures")) {
    additions.push("Auto-watch capability boundary failures for PDF, barcode and pricing claims.");
  }
  if (failedParameters.length && !strategy.includes("Auto-watch parameter drift")) {
    additions.push("Auto-watch parameter drift against the label-parameter baseline.");
  }
  if (highRisk.length && !strategy.includes("Auto-watch over-strong compliance language")) {
    additions.push("Auto-watch over-strong compliance language when visible copy contains certification or guarantee terms.");
  }

  if (!additions.length) return additions;

  const block = additions.map((line) => `- ${line}`).join("\n");
  if (strategy.includes("## Strategy Changelog")) {
    strategy = strategy.replace("## Strategy Changelog", `## Strategy Changelog\n\n${block}`);
  } else {
    strategy += `\n\n## Strategy Changelog\n\n${block}\n`;
  }
  writeFileSync(strategyFile, strategy.trimEnd() + "\n");
  return additions;
}

function formatCommand(result) {
  const status = result.ok ? "PASS" : "FAIL";
  const output = result.output ? `\n\n\`\`\`text\n${result.output}\n\`\`\`` : "";
  return `- ${status} \`${result.command}\` (${result.seconds}s)${output}`;
}

function table(rows, columns) {
  const header = `| ${columns.join(" | ")} |`;
  const sep = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${columns.map((col) => String(row[col] ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|")).join(" | ")} |`);
  return [header, sep, ...body].join("\n");
}

const state = loadState();
const buildEvery = Number(process.env.AUDIT_BUILD_EVERY_MINUTES || 1440);
const buildEnabled = process.env.AUDIT_FORCE_BUILD === "1" || process.env.AUDIT_RUN_BUILD === "1";
const shouldBuild = process.env.AUDIT_FORCE_BUILD === "1" || (buildEnabled && minutesSince(state.lastBuildAt) >= buildEvery);

const commandResults = [
  run("lint", "npm run lint", { lines: 60 }),
  run("test", "npm run test", { lines: 80 }),
  run("typecheck", "./node_modules/.bin/tsc --noEmit --pretty false", { lines: 80 }),
];

if (shouldBuild) {
  const build = run("build", "npm run build", { lines: 120 });
  commandResults.push(build);
  if (build.ok) state.lastBuildAt = now.toISOString();
}

state.lastRunAt = now.toISOString();
saveState(state);

const routeResults = checkRoutes();
const riskFindings = scanRiskClaims();
const i18nResults = checkI18n();
const parameterResults = checkParameters();
const boundaryResults = checkImplementationBoundaries();
const strategyAdditions = updateStrategy({ riskFindings, routeResults, boundaryResults, parameterResults });

const failedCommands = commandResults.filter((item) => !item.ok);
const missingRoutes = routeResults.filter((item) => !item.ok);
const riskyHigh = riskFindings.filter((item) => item.severity === "high");
const boundaryFailures = boundaryResults.filter((item) => !item.ok);
const parameterFailures = parameterResults.filter((item) => !item.ok);
const i18nMissing = i18nResults.filter((item) => item.missing.length);

const summaryStatus = failedCommands.length || missingRoutes.length || riskyHigh.length || boundaryFailures.length || parameterFailures.length ? "NEEDS ACTION" : "PASS WITH WATCH ITEMS";

const report = `# Product Acceptance Audit

Generated: ${now.toISOString()}

Status: **${summaryStatus}**

## Executive Summary

- Commands: ${commandResults.length - failedCommands.length}/${commandResults.length} passed.
- PRD route coverage: ${routeResults.length - missingRoutes.length}/${routeResults.length} resolved.
- Copy watch hits: ${riskFindings.length} total, ${riskyHigh.length} high severity.
- Capability boundary checks: ${boundaryResults.length - boundaryFailures.length}/${boundaryResults.length} passed.
- Parameter baseline checks: ${parameterResults.length - parameterFailures.length}/${parameterResults.length} passed.
- i18n files with missing English keys: ${i18nMissing.length}.
- Production build cadence: ${shouldBuild ? "ran this cycle" : buildEnabled ? `skipped this cycle; enabled every ${buildEvery} minutes` : "skipped by default to avoid interfering with local agent/dev-server work; run manually with AUDIT_FORCE_BUILD=1"}.

## Product Flow Verdict

The product should continue to be accepted against this flow: setup check first, template/calibration second, PDF/barcode diagnostics only after the user has a concrete print failure, and Pro claims only where the implementation exists or is clearly previewed.

Current standing:

- Core function: a seller can use Size Checker, templates, scale calculator, PDF page-size preview and barcode quiet-zone risk check.
- Main business risk: visible copy must not make planned Workspace features sound live.
- Main UX risk: the Tools hub and localized routes must keep guiding by seller failure signal, not by internal tool names.
- Main data risk: barcode quiet-zone numbers are symbol-specific, so the UI must keep "risk estimate" language.

## Command Checks

${commandResults.map(formatCommand).join("\n\n")}

## PRD Route Coverage

${table(routeResults.map((item) => ({ route: item.route, status: item.ok ? "ok" : "missing", via: item.via })), ["route", "status", "via"])}

## Capability Boundary Checks

${table(boundaryResults.map((item) => ({ check: item.label, status: item.ok ? "ok" : "fail" })), ["check", "status"])}

## Parameter Baseline Checks

${table(parameterResults.map((item) => ({ check: item.label, status: item.ok ? "ok" : "fail" })), ["check", "status"])}

## Copy Watch Hits

${riskFindings.length ? table(riskFindings.slice(0, 80).map((item) => ({ severity: item.severity, rule: item.label, file: `${item.file}:${item.line}`, text: item.text })), ["severity", "rule", "file", "text"]) : "No copy watch hits."}

## i18n Key Comparison

${table(i18nResults.map((item) => ({ locale: item.locale, missing: item.missing.length, extra: item.extra.length, missingKeys: item.missing.slice(0, 12).join(", ") })), ["locale", "missing", "extra", "missingKeys"])}

## Strategy Self-Review

${strategyAdditions.map((item) => `- ${item}`).join("\n")}

## Next Actions For Claude

1. Read \`.claude/PM_ACCEPTANCE_NOTES.md\` and \`.planning/product-audits/inspection-strategy.md\` before editing.
2. If this report says NEEDS ACTION, fix high-severity copy claims, failed tests/build, route gaps and failed parameter checks first.
3. If only watch items remain, prioritize product clarity: every page should explain the user's printing problem, the next action and the limitation of the tool.
`;

writeFileSync(reportFile, report);
writeFileSync(latestFile, report);

const notes = read(notesFile);
const latestSummary = `## Latest Scheduled Audit Result

- Last run: ${now.toISOString()}
- Status: ${summaryStatus}
- Latest report: ${rel(latestFile)}
- Commands passed: ${commandResults.length - failedCommands.length}/${commandResults.length}
- Route coverage: ${routeResults.length - missingRoutes.length}/${routeResults.length}
- Copy watch hits: ${riskFindings.length} total, ${riskyHigh.length} high severity
- Capability boundaries passed: ${boundaryResults.length - boundaryFailures.length}/${boundaryResults.length}
- Parameter checks passed: ${parameterResults.length - parameterFailures.length}/${parameterResults.length}

`;

const updatedNotes = notes.includes("## Latest Scheduled Audit Result")
  ? notes.replace(/## Latest Scheduled Audit Result[\s\S]*?(?=\n## |\n# |$)/, latestSummary.trimEnd())
  : `${notes.trimEnd()}\n\n${latestSummary.trimEnd()}\n`;

writeFileSync(notesFile, `${updatedNotes.trimEnd()}\n`);

console.log(`Product audit complete: ${summaryStatus}`);
console.log(`Latest report: ${rel(latestFile)}`);
console.log(`Timestamped report: ${rel(reportFile)}`);
