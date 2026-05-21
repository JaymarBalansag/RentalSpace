const OWNER_PLAN_CATALOG = {
  monthly_standard: {
    code: "monthly_standard",
    tier: "standard",
    cycle: "monthly",
    name: "Monthly Standard",
    shortName: "Standard",
    displayPrice: 200,
    checkoutCharge: 1,
    listingLimit: 2,
    description: "Core tools for new owners and smaller portfolios.",
    features: [
      "Up to 2 property listings",
      "Property management",
      "Reviews management",
    ],
  },
  annual_standard: {
    code: "annual_standard",
    tier: "standard",
    cycle: "annual",
    name: "Annual Standard",
    shortName: "Standard",
    displayPrice: 1800,
    checkoutCharge: 1,
    listingLimit: 2,
    description: "Standard tools with discounted annual billing.",
    features: [
      "Up to 2 property listings",
      "Property management",
      "Reviews management",
    ],
  },
  monthly_pro: {
    code: "monthly_pro",
    tier: "pro",
    cycle: "monthly",
    name: "Monthly Pro",
    shortName: "Pro",
    displayPrice: 500,
    checkoutCharge: 1,
    listingLimit: 5,
    description: "Advanced owner tools with flexible monthly billing.",
    features: [
      "Up to 5 property listings",
      "Property management",
      "Reviews management",
      "Booking management",
      "Tenant management",
      "Billings management",
      "Payment ledger management",
      "Reports & Analytics",
    ],
  },
  annual_pro: {
    code: "annual_pro",
    tier: "pro",
    cycle: "annual",
    name: "Annual Pro",
    shortName: "Pro",
    displayPrice: 4800,
    checkoutCharge: 1,
    listingLimit: 5,
    description: "Full management suite with the best long-term value.",
    features: [
      "Up to 5 property listings",
      "Property management",
      "Reviews management",
      "Booking management",
      "Tenant management",
      "Billings management",
      "Payment ledger management",
      "Reports & Analytics",
    ],
  },
};

const OWNER_PLAN_ORDER = [
  "monthly_standard",
  "annual_standard",
  "monthly_pro",
  "annual_pro",
];

function normalizeString(value) {
  return String(value || "").trim().toLowerCase();
}

export function normalizeOwnerPlanCode(planName, billingCycle = "") {
  const rawPlan = normalizeString(planName);
  const rawCycle = normalizeString(billingCycle);

  if (OWNER_PLAN_CATALOG[rawPlan]) {
    return rawPlan;
  }

  if (rawPlan === "monthly") return "monthly_standard";
  if (rawPlan === "annual") return "annual_pro";

  const isPro = rawPlan.includes("pro");
  const isStandard = rawPlan.includes("standard") || rawPlan.includes("starter");
  const inferredCycle = rawCycle || (rawPlan.includes("annual") ? "annual" : rawPlan.includes("monthly") ? "monthly" : "");

  if (inferredCycle === "annual") {
    if (isPro) return "annual_pro";
    if (isStandard) return "annual_standard";
  }

  if (inferredCycle === "monthly") {
    if (isPro) return "monthly_pro";
    return "monthly_standard";
  }

  if (isPro) return "annual_pro";
  return "monthly_standard";
}

export function getOwnerPlan(codeOrPlanName, billingCycle = "") {
  const code = normalizeOwnerPlanCode(codeOrPlanName, billingCycle);
  return OWNER_PLAN_CATALOG[code] || OWNER_PLAN_CATALOG.monthly_standard;
}

export function getOwnerPlanList() {
  return OWNER_PLAN_ORDER.map((code) => OWNER_PLAN_CATALOG[code]);
}

export function getOwnerPlanCodeFromSubscription(subscription) {
  return normalizeOwnerPlanCode(subscription?.plan_code || subscription?.plan_name, subscription?.billing_cycle);
}

const OWNER_PLAN_FEATURE_DEFS = [
  {
    id: "listing_limit",
    tableLabel: "Property listings",
    label: (plan) => `Up to ${Number(plan?.listingLimit || 0)} property listings`,
    includedTiers: ["standard", "pro"],
  },
  { id: "property_management", label: "Property management", includedTiers: ["standard", "pro"] },
  { id: "reviews_management", label: "Reviews management", includedTiers: ["standard", "pro"] },
  { id: "booking_management", label: "Booking management", includedTiers: ["pro"] },
  { id: "tenant_management", label: "Tenant management", includedTiers: ["pro"] },
  { id: "billings_management", label: "Billings management", includedTiers: ["pro"] },
  { id: "ledger_management", label: "Payment ledger management", includedTiers: ["pro"] },
  { id: "reports_analytics", label: "Reports & Analytics", includedTiers: ["pro"] },
];

export function getOwnerPlanFeatureRows(plan) {
  const tier = normalizeString(plan?.tier);
  return OWNER_PLAN_FEATURE_DEFS.map((feature) => {
    const label = typeof feature.label === "function" ? feature.label(plan) : feature.label;
    return {
      id: feature.id,
      label,
      included: feature.includedTiers.includes(tier),
    };
  });
}

export function getOwnerPlanFeatureComparisonRows(standardPlan, proPlan) {
  const standardTier = "standard";
  const proTier = "pro";

  return OWNER_PLAN_FEATURE_DEFS.map((feature) => {
    const label =
      feature.tableLabel ||
      (typeof feature.label === "string" ? feature.label : "Feature");

    const standardIncluded = feature.includedTiers.includes(standardTier);
    const proIncluded = feature.includedTiers.includes(proTier);

    if (feature.id === "listing_limit") {
      return {
        id: feature.id,
        label,
        standard: { included: true, value: Number(standardPlan?.listingLimit || 0) },
        pro: { included: true, value: Number(proPlan?.listingLimit || 0) },
      };
    }

    return {
      id: feature.id,
      label,
      standard: { included: standardIncluded, value: null },
      pro: { included: proIncluded, value: null },
    };
  });
}

export function getOwnerPlanDisplayName(codeOrPlanName, billingCycle = "") {
  return getOwnerPlan(codeOrPlanName, billingCycle).name;
}

export function getOwnerPlanBillingSummary(codeOrPlanName, billingCycle = "") {
  return getOwnerPlan(codeOrPlanName, billingCycle).cycle === "annual" ? "per year" : "per month";
}

export function getOwnerPlanCycleLabel(codeOrPlanName, billingCycle = "") {
  return getOwnerPlan(codeOrPlanName, billingCycle).cycle === "annual" ? "Annual" : "Monthly";
}

export function getOwnerPlanPrice(codeOrPlanName, billingCycle = "") {
  return getOwnerPlan(codeOrPlanName, billingCycle).displayPrice;
}

export function getOwnerPlanCheckoutCharge(codeOrPlanName, billingCycle = "") {
  return getOwnerPlan(codeOrPlanName, billingCycle).checkoutCharge;
}

export function ownerPlanHasProFeatures(codeOrPlanName, billingCycle = "") {
  return getOwnerPlan(codeOrPlanName, billingCycle).tier === "pro";
}

export function ownerPlanDowngradesFromPro(currentCode, targetCode) {
  return ownerPlanHasProFeatures(currentCode) && !ownerPlanHasProFeatures(targetCode);
}

export function ownerPlanUpgradesToPro(currentCode, targetCode) {
  return !ownerPlanHasProFeatures(currentCode) && ownerPlanHasProFeatures(targetCode);
}
