import api from "./api";

export async function getUserProfile() {
  const res = await api.get("/user");
  return res.data;
}