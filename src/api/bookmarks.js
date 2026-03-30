import api from "./api";

export async function getBookmarkedProperties() {
  return await api.get("/bookmarks");
}

export async function getBookmarkedPropertyIds() {
  return await api.get("/bookmarks/property-ids");
}

export async function bookmarkProperty(propertyId) {
  return await api.post(`/properties/${propertyId}/bookmark`);
}

export async function removeBookmarkedProperty(propertyId) {
  return await api.delete(`/properties/${propertyId}/bookmark`);
}
