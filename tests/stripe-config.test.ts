import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const upgradeSource = readFileSync(resolve(process.cwd(), "app/upgrade.tsx"), "utf8");
const monetizationSource = readFileSync(resolve(process.cwd(), "shared/monetization.ts"), "utf8");
const routerSource = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
const revenueSource = readFileSync(resolve(process.cwd(), "app/revenue.tsx"), "utf8");

describe("Stripe monetization configuration", () => {
  it("keeps checkout clearly unavailable until Stripe is intentionally configured", () => {
    expect(monetizationSource).toContain('"not_configured"');
    expect(upgradeSource).toContain("Checkout is not connected yet; no payment has been started.");
    expect(upgradeSource).not.toContain("sk_live_");
    expect(upgradeSource).not.toContain("sk_test_");
    expect(routerSource).toContain("billing: router({");
    expect(routerSource).toContain("checkoutAvailable: state === \"ready\"");
    expect(upgradeSource).toContain("trpc.billing.status.useQuery");
    expect(upgradeSource).toContain("billingStatusQuery.refetch()");
    expect(upgradeSource).toContain('billingStatusText(language, "checking")');
    expect(upgradeSource).toContain("no payment or entitlement was changed.");
    expect(routerSource).toContain("secretKeyConfigured");
    expect(routerSource).toContain("priceIdConfigured");
    expect(routerSource).toContain("webhookSecretConfigured");
    expect(revenueSource).toContain("billingComponents.secretKeyConfigured");
    expect(revenueSource).toContain("billingComponents.priceIdConfigured");
    expect(revenueSource).toContain("billingComponents.webhookSecretConfigured");
    expect(upgradeSource).toContain("billingComponents.secretKeyConfigured");
    expect(upgradeSource).toContain('t("secureSetup")');
    expect(upgradeSource).toContain("do not confirm a payment or entitlement");
  });
});
