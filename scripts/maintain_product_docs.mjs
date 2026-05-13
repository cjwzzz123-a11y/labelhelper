#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const docsDir = path.join(root, "docs");
const planningDir = path.join(root, ".planning/product-docs");
const logsDir = path.join(planningDir, "logs");
const inventoryFile = path.join(docsDir, "ui-copy-inventory.generated.md");
const latestFile = path.join(planningDir, "latest.md");

mkdirSync(docsDir, { recursive: true });
mkdirSync(planningDir, { recursive: true });
mkdirSync(logsDir, { recursive: true });

const now = new Date();
const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const logFile = path.join(logsDir, `${stamp}.log`);

function read(file) {
  return readFileSync(file, "utf8");
}

function rel(file) {
  return path.relative(root, file);
}

function listFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", "coverage"].includes(name)) continue;
    const file = path.join(dir, name);
    const st = statSync(file);
    if (st.isDirectory()) listFiles(file, acc);
    else if (/\.(tsx?|jsx?)$/.test(name)) acc.push(file);
  }
  return acc;
}

function lineFor(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function clean(value) {
  return value
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyRole(source, text) {
  const lower = text.toLowerCase();
  if (/<button[\s>]/i.test(source)) return "button";
  if (/<link[\s>]/i.test(source) || /href=/.test(source)) return "link";
  if (/(download|下载|zip|pdf|report|报告)/i.test(text)) return "download/action copy";
  if (/(vip|member|paid|unlock|license|会员|付费|解锁|许可证)/i.test(text)) return "membership copy";
  if (/^(title|description|h1|intro|badge|cta|text|note|placeholder|label)\s*:/.test(source.trim())) return "copy constant";
  if (lower.length < 28) return "short UI label";
  return "body copy";
}

function classifyAccess(file, text) {
  const joined = `${file} ${text}`.toLowerCase();
  if (/(vip|member|paid|unlock|license|watermark-free|unwatermarked|full report|zip|会员|付费|解锁|无水印|完整报告)/i.test(joined)) return "VIP or membership-related";
  if (/(free|blank template|scale calculator|size checker|guide|免费|空白|比例计算|指南)/i.test(joined)) return "Free";
  return "Mixed/unspecified";
}

function maintainerNote(role, access) {
  if (access.startsWith("VIP")) return "VIP copy must match PRODUCT_SPEC membership boundaries and use shared VIP visuals where rendered.";
  if (role === "button" || role === "link" || role === "download/action copy") return "Confirm destination/action still matches the label.";
  return "Keep wording factual; avoid claiming unimplemented features.";
}

function extractObjectStrings(file, text) {
  const rows = [];
  const pattern = /([A-Za-z][A-Za-z0-9_]*)\s*:\s*"([^"\n]{2,240})"/g;
  for (const match of text.matchAll(pattern)) {
    const value = clean(match[2]);
    if (!value || /^[a-z0-9_-]+$/i.test(value)) continue;
    const source = `${match[1]}: "${value}"`;
    rows.push({ file: rel(file), line: lineFor(text, match.index ?? 0), source, text: value });
  }
  return rows;
}

function extractJsxText(file, text) {
  const rows = [];
  const pattern = /<(button|Link|a|p|h1|h2|h3|span|label)[^>]*>([^<>{}][^<>{}]{1,240})<\/\1>/g;
  for (const match of text.matchAll(pattern)) {
    const value = clean(match[2]);
    if (!value || /^[•·\d\s.:-]+$/.test(value)) continue;
    rows.push({ file: rel(file), line: lineFor(text, match.index ?? 0), source: `<${match[1]}>${value}</${match[1]}>`, text: value });
  }
  return rows;
}

function extractArrays(file, text) {
  const rows = [];
  const pattern = /"([^"\n]{2,180})"/g;
  for (const match of text.matchAll(pattern)) {
    const value = clean(match[1]);
    if (!/[A-Za-z\u4e00-\u9fff]/.test(value)) continue;
    if (/^(use client|@\/|\.\/|https?:|[a-z0-9_-]+)$/i.test(value)) continue;
    rows.push({ file: rel(file), line: lineFor(text, match.index ?? 0), source: `"${value}"`, text: value });
  }
  return rows;
}

const files = [
  ...listFiles(path.join(root, "app")),
  ...listFiles(path.join(root, "components")),
  ...listFiles(path.join(root, "lib")),
].filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"));

const seen = new Set();
const rows = [];

for (const file of files) {
  const text = read(file);
  for (const row of [...extractObjectStrings(file, text), ...extractJsxText(file, text), ...extractArrays(file, text)]) {
    const key = `${row.file}:${row.line}:${row.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const role = classifyRole(row.source, row.text);
    const access = classifyAccess(row.file, row.text);
    rows.push({ ...row, role, access, note: maintainerNote(role, access) });
  }
}

rows.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.text.localeCompare(b.text));

const byFile = rows.reduce((groups, row) => {
  groups[row.file] ??= [];
  groups[row.file].push(row);
  return groups;
}, {});

const lines = [];
lines.push("# UI Copy Inventory");
lines.push("");
lines.push(`Generated: ${now.toISOString()}`);
lines.push("");
lines.push("This file is generated by `scripts/maintain_product_docs.mjs`. It is a maintenance inventory for user-facing text, buttons, links, labels, membership copy, and download/action copy. Use `docs/PRODUCT_SPEC.md` for the normative product rules.");
lines.push("");
lines.push(`Total entries: ${rows.length}`);
lines.push("");

for (const [file, fileRows] of Object.entries(byFile)) {
  lines.push(`## ${file}`);
  lines.push("");
  lines.push("| Line | Role | Access | Text / Expression | Maintainer note |");
  lines.push("|---:|---|---|---|---|");
  for (const row of fileRows) {
    const textCell = row.text.replace(/\|/g, "\\|");
    lines.push(`| ${row.line} | ${row.role} | ${row.access} | ${textCell} | ${row.note} |`);
  }
  lines.push("");
}

writeFileSync(inventoryFile, `${lines.join("\n")}\n`);

const summary = `# Product Docs Maintenance

Generated: ${now.toISOString()}

Status: OK

- Scanned files: ${files.length}
- UI copy entries: ${rows.length}
- Inventory: docs/ui-copy-inventory.generated.md
- Product spec: docs/PRODUCT_SPEC.md

Good work maintaining the product system. Next run can be even clearer: check whether new VIP actions have both code gating and visible VIP treatment.
`;

writeFileSync(latestFile, summary);
writeFileSync(logFile, summary);
console.log(summary);
