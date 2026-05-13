import { describe, expect, it } from "vitest";
import { getSizeCheckerNextStepAction, type SizeCheckerUseCase } from "./size-checker-next-step";
import type { Rule } from "@/data/rules";

const cases: Array<{
  verdict: Rule["verdict"];
  useCase: SizeCheckerUseCase;
  action: ReturnType<typeof getSizeCheckerNextStepAction>;
}> = [
  { verdict: "compatible", useCase: "starting", action: "template" },
  { verdict: "compatible", useCase: "troubleshooting", action: "scale" },
  { verdict: "compatible", useCase: "picking_printer", action: "templates" },
  { verdict: "not_ideal", useCase: "starting", action: "calibration" },
  { verdict: "not_ideal", useCase: "troubleshooting", action: "scale" },
  { verdict: "not_ideal", useCase: "picking_printer", action: "templates" },
  { verdict: "not_recommended", useCase: "starting", action: "template" },
  { verdict: "not_recommended", useCase: "troubleshooting", action: "pdf" },
  { verdict: "not_recommended", useCase: "picking_printer", action: "templates" },
];

describe("getSizeCheckerNextStepAction", () => {
  it.each(cases)("maps $verdict + $useCase to $action", ({ verdict, useCase, action }) => {
    expect(getSizeCheckerNextStepAction({ verdict, useCase })).toBe(action);
  });
});
