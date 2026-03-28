import api from "./api";

export async function getOwnerSubscriptionStatus() {
  const response = await api.get("/owner/subscription-status");
  return response.data?.data || null;
}

export async function getSubscriptionStatus(subscriptionId) {
  const response = await api.get(`/subscription-status/${subscriptionId}`);
  return response.data || null;
}

export async function getOwnerSubscriptionHistory() {
  const response = await api.get("/owner/subscription-history");
  return response.data || null;
}

export async function createListingAddonIntent(qty) {
  const response = await api.post("/owner/listing-addon/intent", { qty });
  return response.data || null;
}

export async function getListingAddonStatus(addonId) {
  const response = await api.get(`/owner/listing-addon/status/${addonId}`);
  return response.data || null;
}

export async function createPlanChangeIntent(payload) {
  const response = await api.post("/paymongo/plan-change-payment", payload);
  return response.data || null;
}
