import {
  resolveNotificationIcon,
  resolveNotificationTab,
  resolveNotificationTitle,
  resolveNotificationType,
  toRelativeTime,
} from "../logic/notificationLogic";

export function mapNotificationResponse(raw) {
  const type = resolveNotificationType(raw);

  return {
    id: raw?.id || `${type}-${raw?.created_at || Date.now()}`,
    title: resolveNotificationTitle(raw, type),
    time: toRelativeTime(raw?.created_at),
    type: resolveNotificationTab(type),
    icon: resolveNotificationIcon(type),
    read: Boolean(raw?.read_at || raw?.is_read),
    created_at: raw?.created_at || new Date().toISOString(),
    event_type: type,
    metadata: raw?.metadata || {},
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
