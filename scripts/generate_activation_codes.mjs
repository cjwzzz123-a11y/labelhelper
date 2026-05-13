import { createHmac, randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const count = Number.parseInt(process.argv[2] ?? "100", 10);
const output = resolve(process.argv[3] ?? ".planning/activation-codes/shipping-label-helper-codes.csv");
const suppliedSecret = process.env.SLH_ACTIVATION_CODE_SECRET || process.env.LICENSE_SIGNING_SECRET;
const secret = suppliedSecret || randomBytes(32).toString("hex");

if (!Number.isInteger(count) || count < 1 || count > 10000) {
  throw new Error("Usage: node scripts/generate_activation_codes.mjs <count 1-10000> [output.csv]");
}

function signature(prefix) {
  return createHmac("sha256", secret).update(prefix.toUpperCase()).digest("hex").slice(0, 32).toUpperCase();
}

function code() {
  const id = randomBytes(16).toString("hex").toUpperCase();
  const prefix = `SLH-${id.slice(0, 16)}-${id.slice(16, 32)}`;
  return `${prefix}-${signature(prefix)}`;
}

const codes = new Set();
while (codes.size < count) codes.add(code());

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `code\n${Array.from(codes).join("\n")}\n`);
if (!suppliedSecret) {
  writeFileSync(`${output}.secret.txt`, `SLH_ACTIVATION_CODE_SECRET=${secret}\n`);
}
console.log(`Generated ${codes.size} activation codes: ${output}`);
if (!suppliedSecret) console.log(`Generated signing secret: ${output}.secret.txt`);
