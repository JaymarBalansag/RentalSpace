import api from "./api";

export async function submitContactInquiry(payload) {
  const response = await api.post("/contact-us", payload);
  return response;
}
