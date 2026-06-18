import { describe, expect, it } from "vitest";
import { pageMetadata } from "./seo";

describe("pageMetadata", () => {
  it("preserves explicit robots directives for localized transactional pages", () => {
    const metadata = pageMetadata({
      title: "Unlock Pro Tools",
      description: "Enter a Shipping Label Helper license key to unlock paid tools on this browser.",
      path: "/unlock",
      locale: "zh",
      robots: { index: false, follow: false },
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("/zh/unlock");
  });
});
