import {
  resolveNotificationIcon,
  resolveNotificationTab,
  resolveNotificationTitle,
  resolveNotificationType,
  toRelativeTime,
} from "../logic/notificationLogic";

export function mapNotificationResponse(raw) {
  const flattenedRaw = {
    ...(raw?.metadata || {}),
    ...(raw || {}),
  };
  const type = resolveNotificationType(flattenedRaw);
  const message =
    flattenedRaw?.message ||
    flattenedRaw?.metadata?.message ||
    null;

  return {
    id: flattenedRaw?.id || `${type}-${flattenedRaw?.created_at || Date.now()}`,
    title: resolveNotificationTitle(flattenedRaw, type),
    message,
    time: toRelativeTime(flattenedRaw?.created_at),
    type: resolveNotificationTab(type),
    icon: resolveNotificationIcon(type),
    read: Boolean(flattenedRaw?.read_at || flattenedRaw?.is_read),
    created_at: flattenedRaw?.created_at || new Date().toISOString(),
    event_type: type,
    metadata: flattenedRaw?.metadata || raw?.metadata || {},
  };
}

export function mapNotificationListResponse(responseData) {
  const rows = responseData?.notifications || responseData?.data || [];
  return rows.map(mapNotificationResponse);
}

export function mergeNotificationOnTop(current, incoming) {
  const filtered = current.filter((item) => item.id !== incoming.id);
  return [incoming, ...filtered];
}
