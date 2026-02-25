export function buildFetchNotificationsRequest(type = null, limit = 50) {
  const params = { limit };
  if (type) params.type = type;
  return params;
}

export function buildReadAllNotificationsRequest(type = null) {
  const payload = {};
  if (type) payload.type = type;
  return payload;
}
