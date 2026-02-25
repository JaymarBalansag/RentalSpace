import api from "./api";

export async function getOwnerSubscriptionStatus() {
  const response = await api.get("/owner/subscription-status");
  return response.data?.data || null;
}

export async function getSubscriptionStatus(subscriptionId) {
  const response = await api.get(`/subscription-status/${subscriptionId}`);
  return response.data || null;
}
