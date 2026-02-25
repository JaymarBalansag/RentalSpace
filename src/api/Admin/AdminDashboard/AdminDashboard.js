import api from "@/api/api";

export async function getAdminOverview() {
  try {
    const res = await api.get("/admin/overview");
    return res;
  } catch (error) {
    return error.response;
  }
}
