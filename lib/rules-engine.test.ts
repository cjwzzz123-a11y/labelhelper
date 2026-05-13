import { describe, expect, it } from "vitest";
import { canonicalRulePapers, carrierOptions, platformOptions, printerOptions, rulesDb } from "@/data/rules";
import { getAllRules, getCombinationCount, lookup } from "./rules-engine";

describe("rules engine", () => {
  it("generates one rule for every input combination", () => {
    expect(getAllRules()).toHaveLength(getCombinationCount());
    expect(getCombinationCount()).toBe(756);
  });

  it("returns a useful rule for every combination", () => {
    for (const platform of platformOptions) {
      for (const carrier of carrierOptions) {
        for (const paper of canonicalRulePapers) {
          for (const printer of printerOptions) {
            const rule = lookup(platform.value, carrier.value, paper, printer.value);
            expect(rule.verdict).toMatch(/compatible|not_ideal|not_recommended/);
            expect(rule.recommended_size.width_in).toBeGreaterThan(0);
            expect(rule.common_mistakes).toHaveLength(3);
            expect(rule.notes.length).toBeGreaterThan(20);
            expect(rule.official_doc_url).toMatch(/^https:\/\//);
            expect(rule.official_doc_label?.length).toBeGreaterThan(5);
            expect(rule.official_doc_last_checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(rule.official_doc_note).toContain("may change");
          }
        }
      }
    }
  });

  it("marks the default Etsy USPS thermal 4x6 setup as compatible", () => {
    const rule = lookup("etsy", "usps", "4x6", "thermal");
    expect(rule.verdict).toBe("compatible");
    expect(rule.print_scale).toContain("100%");
    expect(rule.official_doc_url).toBeTruthy();
  });

  it("keeps 6x4 as a landscape setup", () => {
    const rule = lookup("shopify", "ups", "6x4", "thermal");
    expect(rule.orientation).toBe("landscape");
    expect(rule.recommended_size.width_in).toBe(4);
    expect(rule.recommended_size.height_in).toBe(6);
    expect(rule.official_doc_url).toMatch(/^https:\/\//);
    expect(rule.official_doc_label).toBeTruthy();
    expect(rule.official_doc_last_checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("includes official citations for tier 1 rules", () => {
    const tier1Platforms = ["etsy", "shopify", "ebay", "amazon_fba"] as const;
    const tier1Carriers = ["usps", "ups", "fedex", "dhl"] as const;
    const tier1Papers = ["4x6", "letter"] as const;
    const tier1Printers = ["thermal", "laser"] as const;

    for (const platform of tier1Platforms) {
      for (const carrier of tier1Carriers) {
        for (const paper of tier1Papers) {
          for (const printer of tier1Printers) {
            const rule = lookup(platform, carrier, paper, printer);
            expect(rule.official_doc_url).toMatch(/^https:\/\//);
            expect(rule.official_doc_label?.length).toBeGreaterThan(5);
            expect(rule.official_doc_last_checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          }
        }
      }
    }
  });

  it("includes official source metadata on the default rule", () => {
    expect(rulesDb.defaults.official_doc_url).toMatch(/^https:\/\//);
    expect(rulesDb.defaults.official_doc_label?.length).toBeGreaterThan(5);
    expect(rulesDb.defaults.official_doc_last_checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(rulesDb.defaults.official_doc_note).toContain("may change");
  });
});
