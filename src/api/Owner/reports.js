import api from "../api";

export async function getTenantSummary(params = {}) {
  return api.get("/owner/reports/tenant-summary", { params });
}

export async function getBookingLogs(params = {}) {
  return api.get("/owner/reports/booking-logs", { params });
}

export async function getPaymentAnalytics(params = {}) {
  return api.get("/owner/reports/payment-analytics", { params });
}
