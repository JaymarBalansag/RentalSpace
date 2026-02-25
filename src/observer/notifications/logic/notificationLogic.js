const ICON_MAP = {
  message_received: "bi bi-chat-dots text-primary",
  tenant_reviewed_property: "bi bi-star-fill text-warning",
  booking_pending: "bi bi-calendar-check text-success",
  default: "bi bi-bell text-primary",
};

const TAB_MAP = {
  message_received: "system",
  tenant_reviewed_property: "system",
  booking_pending: "bookings",
};

function safeDateToMs(value) {
  const date = new Date(value || Date.now());
  const time = date.getTime();
  return Number.isNaN(time) ? Date.now() : time;
}

export function resolveNotificationType(raw) {
  const type = raw?.type || raw?.event_type || "generic";
  if (type === "message") return "message_received";
  if (type === "review") return "tenant_reviewed_property";
  if (type === "booking") return "booking_pending";
  return type;
}

export function resolveNotificationTitle(raw, type) {
  if (raw?.title) return raw.title;

  if (type === "message_received") {
    return `${raw?.sender_name || "A user"} sent you a message.`;
  }

  if (type === "tenant_reviewed_property") {
    const tenantName = raw?.tenant_name || "A tenant";
    const propertyName = raw?.property_name || "your property";
    return `${tenantName} left a review on ${propertyName}.`;
  }

  if (type === "booking_pending") {
    const propertyName = raw?.property_name || "your property";
    return `You have a pending booking request for ${propertyName}.`;
  }

  return "You have a new notification.";
}

export function resolveNotificationTab(type) {
  return TAB_MAP[type] || "system";
}

export function resolveNotificationIcon(type) {
  return ICON_MAP[type] || ICON_MAP.default;
}

export function toRelativeTime(value) {
  const diffSeconds = Math.floor((Date.now() - safeDateToMs(value)) / 1000);
  if (diffSeconds < 60) return "Just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
  return `${Math.floor(diffSeconds / 86400)} days ago`;
}
