import { getCheckoutUrl, type LicenseTier } from "@/lib/license";

type PaidLicenseTier = Exclude<LicenseTier, "free">;

export interface CheckoutPlan {
  sku: PaidLicenseTier;
  name: string;
  price: string;
  checkoutUrl: string;
  configured: boolean;
}

export function getCheckoutPlan(sku: PaidLicenseTier, name: string, price: string): CheckoutPlan {
  const checkoutUrl = getCheckoutUrl(sku);
  return {
    sku,
    name,
    price,
    checkoutUrl,
    configured: !checkoutUrl.startsWith("/pricing#"),
  };
}

export function getCheckoutStatusMessage(configured: boolean) {
  return configured
    ? "Secure checkout is ready. After payment, enter the license key sent to your email."
    : "Checkout is not connected yet. You can still use the free tools and preview advanced workflows.";
}
