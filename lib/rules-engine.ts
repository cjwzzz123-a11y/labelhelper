import { canonicalRulePapers, carriers, papers, platforms, printers, type Carrier, type Paper, type Platform, type Printer, type Rule, rulesDb } from "@/data/rules";

export function normalizePaper(paper: Paper): Paper {
  return paper === "6x4" ? "4x6" : paper;
}

export function getAllRules(): Rule[] {
  return rulesDb.rules;
}

export function lookup(platform: Platform, carrier: Carrier, paper: Paper, printer: Printer): Rule {
  const exact = rulesDb.rules.find(
    (rule) => rule.platform === platform && rule.carrier === carrier && rule.paper === paper && rule.printer === printer,
  );

  if (exact) return exact;

  const normalizedPaper = normalizePaper(paper);
  const normalized = rulesDb.rules.find(
    (rule) =>
      rule.platform === platform && rule.carrier === carrier && rule.paper === normalizedPaper && rule.printer === printer,
  );

  if (normalized) {
    return {
      ...normalized,
      paper,
      orientation: paper === "6x4" ? "landscape" : normalized.orientation,
      notes:
        paper === "6x4"
          ? `${normalized.notes} You selected 6 × 4; rotate the artwork only if your printer driver expects landscape labels.`
          : normalized.notes,
    };
  }

  return rulesDb.defaults;
}

export function getCombinationCount(): number {
  return platforms.length * carriers.length * canonicalRulePapers.length * printers.length;
}

export function isKnownPlatform(value: string): value is Platform {
  return platforms.includes(value as Platform);
}

export function isKnownCarrier(value: string): value is Carrier {
  return carriers.includes(value as Carrier);
}

export function isKnownPaper(value: string): value is Paper {
  return papers.includes(value as Paper);
}

export function isKnownPrinter(value: string): value is Printer {
  return printers.includes(value as Printer);
}
