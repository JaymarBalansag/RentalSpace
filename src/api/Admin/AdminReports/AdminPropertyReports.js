import api from "@/api/api";

export async function getAdminPropertyReports(params = {}) {
  try {
    const res = await api.get("/admin/property-reports", { params });
    return res;
  } catch (error) {
    return error.response;
  }
}

export async function getAdminPropertyReportDetails(reportId) {
  try {
    const res = await api.get(`/admin/property-reports/${reportId}`);
    return res;
  } catch (error) {
    return error.response;
  }
}

export async function updateAdminPropertyReport(reportId, payload) {
  try {
    const res = await api.patch(`/admin/property-reports/${reportId}`, payload);
    return res;
  } catch (error) {
    return error.response;
  }
}
