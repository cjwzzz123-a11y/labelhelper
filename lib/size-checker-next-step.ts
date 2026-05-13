import type { Rule } from "@/data/rules";

export type SizeCheckerUseCase = "starting" | "troubleshooting" | "picking_printer";
export type SizeCheckerNextStepAction = "template" | "calibration" | "scale" | "pdf" | "templates";

export function getSizeCheckerNextStepAction({
  verdict,
  useCase,
}: {
  verdict: Rule["verdict"];
  useCase: SizeCheckerUseCase;
}): SizeCheckerNextStepAction {
  if (verdict === "not_recommended") {
    if (useCase === "troubleshooting") return "pdf";
    if (useCase === "picking_printer") return "templates";
    return "template";
  }

  if (verdict === "not_ideal") {
    if (useCase === "troubleshooting") return "scale";
    if (useCase === "picking_printer") return "templates";
    return "calibration";
  }

  if (useCase === "troubleshooting") return "scale";
  if (useCase === "picking_printer") return "templates";
  return "template";
}
