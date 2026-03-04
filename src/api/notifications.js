import api from "./api";
import {
  buildFetchNotificationsRequest,
  buildReadAllNotificationsRequest,
} from "@/observer/notifications/controller/notificationRequestController";

export async function fetchNotifications(type = null, limit = 50) {
  const params = buildFetchNotificationsRequest(type, limit);
  return api.get("/notifications", { params });
}

export async function markNotificationAsRead(notificationId) {
  return api.post(`/notifications/${notificationId}/read`);
}

export async function markAllNotificationsAsRead(type = null) {
  const payload = buildReadAllNotificationsRequest(type);
  return api.post("/notifications/read-all", payload);
}

export async function deleteNotification(notificationId) {
  return api.delete(`/notifications/${notificationId}`);
}

export async function deleteNotifications(ids = []) {
  return api.delete("/notifications", {
    data: { ids },
  });
}

export async function deleteNotificationsByTab(type) {
  return api.delete("/notifications/tab", {
    data: { type },
  });
}
