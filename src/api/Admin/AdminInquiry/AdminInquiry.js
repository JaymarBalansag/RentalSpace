import api from "@/api/api";

export async function getAdminInquiries(params = {}) {
  try {
    const res = await api.get("/admin/inquiries", { params });
    return res;
  } catch (error) {
    return error.response;
  }
}

export async function getAdminInquiryDetails(inquiryId) {
  try {
    const res = await api.get(`/admin/inquiries/${inquiryId}`);
    return res;
  } catch (error) {
    return error.response;
  }
}

export async function resolveAdminInquiry(inquiryId) {
  try {
    const res = await api.patch(`/admin/inquiries/${inquiryId}/resolve`);
    return res;
  } catch (error) {
    return error.response;
  }
}

export async function deleteAdminInquiries(ids = []) {
  try {
    const res = await api.delete("/admin/inquiries", {
      data: { ids },
    });
    return res;
  } catch (error) {
    return error.response;
  }
}
