<template>
  <Header />

  <div class="notification-page container py-4" style="max-width: 860px;">
    <RouterLink to="/home" class="btn btn-outline-secondary rounded-pill px-3 mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <section class="notification-hero rounded-4 shadow-sm p-4 p-md-5 mb-4">
      <div class="d-flex flex-wrap gap-3 align-items-center justify-content-between">
        <div>
          <p class="small text-uppercase mb-1 hero-kicker">Activity Center</p>
          <h4 class="fw-bold mb-1">Notifications</h4>
          <p class="text-muted mb-0 small">Stay updated with system alerts, booking activity, and account events.</p>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-2 justify-content-end">
          <span class="count-pill">{{ unreadCount }} unread</span>
          <button
            class="btn btn-sm btn-outline-secondary rounded-pill px-3"
            @click="toggleSelectionMode"
            :disabled="loading || isDeleting"
          >
            {{ selectionMode ? "Cancel" : "Select" }}
          </button>
          <button
            v-if="selectionMode"
            class="btn btn-sm btn-outline-secondary rounded-pill px-3"
            @click="toggleSelectAllInTab"
            :disabled="filteredNotifications.length === 0 || isDeleting"
          >
            {{ allFilteredSelected ? "Unselect all" : "Select all" }}
          </button>
          <button
            v-if="selectionMode"
            class="btn btn-sm btn-danger rounded-pill px-3"
            @click="confirmDeleteSelected"
            :disabled="!hasSelectionInActiveTab || isDeleting"
          >
            Delete selected
          </button>
          <button
            class="btn btn-sm btn-outline-danger rounded-pill px-3"
            @click="confirmDeleteAllInTab"
            :disabled="filteredNotifications.length === 0 || isDeleting"
          >
            Delete all ({{ activeTab }})
          </button>
          <button
            class="btn btn-sm btn-outline-secondary rounded-pill px-3"
            @click="markAllAsRead"
            :disabled="!hasUnreadInActiveTab || isDeleting"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </section>

    <div class="tabs-shell mb-3">
      <ul class="nav nav-pills gap-2">
        <li class="nav-item">
          <button
            class="nav-link tab-pill"
            :class="{ active: activeTab === 'system' }"
            @click="activeTab = 'system'"
          >
            System
            <span class="tab-count">{{ unreadByType.system }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link tab-pill"
            :class="{ active: activeTab === 'bookings' }"
            @click="activeTab = 'bookings'"
          >
            Bookings
            <span class="tab-count">{{ unreadByType.bookings }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div v-if="loading" class="list-stack">
      <div v-for="n in 3" :key="`sk-${n}`" class="notification-card placeholder-glow">
        <div class="placeholder col-1 rounded-circle avatar-skeleton"></div>
        <div class="flex-grow-1">
          <span class="placeholder col-7 mb-2 d-block"></span>
          <span class="placeholder col-4 d-block"></span>
        </div>
      </div>
    </div>

    <div v-else class="list-stack">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        class="notification-card text-start"
        :class="{ unread: !notification.read, selected: selectedIds.includes(notification.id) }"
        role="button"
        tabindex="0"
        @click="handleNotificationCardClick(notification)"
        @keydown.enter.prevent="handleNotificationCardClick(notification)"
        @keydown.space.prevent="handleNotificationCardClick(notification)"
      >
        <div class="notif-icon-wrap">
          <i :class="notification.icon"></i>
        </div>

        <div class="flex-grow-1 min-w-0">
          <p class="notif-title mb-1">{{ notification.title }}</p>
          <p v-if="notification.message" class="notif-message notif-message-preview mb-1">
            {{ getMessagePreview(notification.message) }}
          </p>
          <button
            v-if="canExpandMessage(notification.message)"
            class="notif-read-more"
            type="button"
            @click.stop="openMessageModal(notification)"
          >
            Read more
          </button>
          <small class="notif-time">{{ notification.time }}</small>
        </div>

        <span
          v-if="selectionMode"
          class="select-indicator"
          :class="{ active: selectedIds.includes(notification.id) }"
          aria-hidden="true"
        >
          <i v-if="selectedIds.includes(notification.id)" class="bi bi-check"></i>
        </span>
        <span v-else-if="!notification.read" class="unread-dot" aria-label="Unread notification"></span>
      </div>
    </div>

    <div
      v-if="showMessageModal && selectedNotification"
      class="modal-overlay-custom"
      @click.self="closeMessageModal"
    >
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">{{ selectedNotification.title }}</h5>
          <button class="btn-close" @click="closeMessageModal"></button>
        </div>
        <p class="notif-modal-time mb-3">{{ selectedNotification.time }}</p>
        <p class="notif-modal-message mb-0">{{ selectedNotification.message }}</p>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger border-0 rounded-4 mt-3 mb-0 small">
      {{ error }}
    </div>

    <div v-if="!loading && filteredNotifications.length === 0" class="empty-state text-center mt-4">
      <i class="bi bi-bell-slash"></i>
      <h6 class="fw-semibold mb-1">No {{ activeTab }} notifications</h6>
      <p class="text-muted small mb-0">You're all caught up for this tab.</p>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";
import Header from "@/components/Header.vue";
import {
  deleteNotifications,
  deleteNotificationsByTab,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notifications";
import { getAuthUserId } from "@/api/user";
import {
  mapNotificationListResponse,
  mapNotificationResponse,
  mergeNotificationOnTop,
} from "@/observer/notifications/controller/notificationController";

export default {
  name: "NotificationPage",
  components: { RouterLink, Header },
  data() {
    return {
      activeTab: "system",
      notifications: [],
      loading: false,
      error: "",
      authUserId: null,
      notificationChannelName: null,
      showMessageModal: false,
      selectedNotification: null,
      selectionMode: false,
      selectedIds: [],
      isDeleting: false,
    };
  },
  computed: {
    visibleNotifications() {
      return this.notifications.filter((n) => n.event_type !== "message_received");
    },
    filteredNotifications() {
      return this.visibleNotifications.filter((n) => n.type === this.activeTab);
    },
    unreadCount() {
      return this.visibleNotifications.filter((n) => !n.read).length;
    },
    unreadByType() {
      return {
        system: this.visibleNotifications.filter((n) => n.type === "system" && !n.read).length,
        bookings: this.visibleNotifications.filter((n) => n.type === "bookings" && !n.read).length,
      };
    },
    filteredNotificationIds() {
      return this.filteredNotifications.map((n) => n.id);
    },
    allFilteredSelected() {
      if (this.filteredNotificationIds.length === 0) return false;
      return this.filteredNotificationIds.every((id) => this.selectedIds.includes(id));
    },
    hasSelectionInActiveTab() {
      return this.filteredNotificationIds.some((id) => this.selectedIds.includes(id));
    },
    hasUnreadInActiveTab() {
      return this.filteredNotifications.some((n) => !n.read);
    },
  },
  watch: {
    activeTab() {
      this.clearSelection();
    },
  },
  methods: {
    toggleSelectionMode() {
      this.selectionMode = !this.selectionMode;
      if (!this.selectionMode) {
        this.clearSelection();
      }
    },
    clearSelection() {
      this.selectedIds = [];
    },
    toggleSelected(id) {
      if (!id) return;
      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter((item) => item !== id);
        return;
      }
      this.selectedIds = [...this.selectedIds, id];
    },
    toggleSelectAllInTab() {
      if (this.allFilteredSelected) {
        const set = new Set(this.filteredNotificationIds);
        this.selectedIds = this.selectedIds.filter((id) => !set.has(id));
        return;
      }
      const merged = new Set([...this.selectedIds, ...this.filteredNotificationIds]);
      this.selectedIds = Array.from(merged);
    },
    handleNotificationCardClick(notification) {
      if (!notification) return;
      if (this.selectionMode) {
        this.toggleSelected(notification.id);
        return;
      }
      this.markAsRead(notification);
    },
    removeNotificationsByIds(ids) {
      const set = new Set((ids || []).filter(Boolean));
      if (set.size === 0) return;
      this.notifications = this.notifications.filter((item) => !set.has(item.id));
      this.selectedIds = this.selectedIds.filter((id) => !set.has(id));
      if (this.selectedNotification?.id && set.has(this.selectedNotification.id)) {
        this.closeMessageModal();
      }
    },
    removeNotificationsByTab(tab) {
      this.notifications = this.notifications.filter((item) => item.type !== tab);
      this.selectedIds = this.selectedIds.filter((id) =>
        this.notifications.some((n) => n.id === id)
      );
      if (this.selectedNotification?.type === tab) {
        this.closeMessageModal();
      }
    },
    async confirmDeleteSelected() {
      const idsToDelete = this.selectedIds.filter((id) =>
        this.filteredNotificationIds.includes(id)
      );
      if (idsToDelete.length === 0 || this.isDeleting) return;

      const result = await Swal.fire({
        title: "Delete selected notifications?",
        text: `This will delete ${idsToDelete.length} notification(s) from ${this.activeTab}.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc3545",
      });
      if (!result.isConfirmed) return;

      this.isDeleting = true;
      try {
        const res = await deleteNotifications(idsToDelete);
        const deletedIds = res?.data?.deleted_ids || idsToDelete;
        this.removeNotificationsByIds(deletedIds);
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Selected notifications were deleted.",
          timer: 1300,
          showConfirmButton: false,
        });
        window.dispatchEvent(new CustomEvent("notifications:updated"));
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: error?.response?.data?.message || "Failed to delete selected notifications.",
        });
      } finally {
        this.isDeleting = false;
      }
    },
    async confirmDeleteAllInTab() {
      if (this.filteredNotifications.length === 0 || this.isDeleting) return;

      const result = await Swal.fire({
        title: `Delete all ${this.activeTab} notifications?`,
        text: "This cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete all",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc3545",
      });
      if (!result.isConfirmed) return;

      this.isDeleting = true;
      try {
        const res = await deleteNotificationsByTab(this.activeTab);
        this.removeNotificationsByTab(this.activeTab);
        const deletedCount = res?.data?.deleted_count ?? 0;
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: `${deletedCount} ${this.activeTab} notification(s) deleted.`,
          timer: 1300,
          showConfirmButton: false,
        });
        window.dispatchEvent(new CustomEvent("notifications:updated"));
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: error?.response?.data?.message || "Failed to delete notifications for this tab.",
        });
      } finally {
        this.isDeleting = false;
      }
    },
    getMessagePreview(message) {
      const text = String(message || "").trim();
      if (text.length <= 170) return text;
      return `${text.slice(0, 170).trim()}...`;
    },
    canExpandMessage(message) {
      return String(message || "").trim().length > 170;
    },
    openMessageModal(notification) {
      this.selectedNotification = notification;
      this.showMessageModal = true;
    },
    closeMessageModal() {
      this.showMessageModal = false;
      this.selectedNotification = null;
    },
    async loadNotifications() {
      this.loading = true;
      this.error = "";
      try {
        const res = await fetchNotifications();
        this.notifications = mapNotificationListResponse(res?.data).filter(
          (notification) => notification.event_type !== "message_received"
        );
        window.dispatchEvent(new CustomEvent("notifications:updated"));
      } catch (error) {
        this.error = error?.response?.data?.message || "Failed to load notifications.";
      } finally {
        this.loading = false;
      }
    },
    async loadAuthUserId() {
      try {
        const res = await getAuthUserId();
        this.authUserId = res?.data?.userid || null;
      } catch (_) {
        this.authUserId = null;
      }
    },
    async markAsRead(notification) {
      if (notification.read) return;
      notification.read = true;
      try {
        await markNotificationAsRead(notification.id);
      } catch (_) {}
      window.dispatchEvent(new CustomEvent("notifications:updated"));
    },
    async markAllAsRead() {
      if (!this.hasUnreadInActiveTab) return;
      this.notifications.forEach((n) => {
        if (n.type === this.activeTab) n.read = true;
      });
      try {
        await markAllNotificationsAsRead(this.activeTab);
      } catch (_) {}
      window.dispatchEvent(new CustomEvent("notifications:updated"));
    },
    handleRealtimeNotification(eventPayload) {
      const mapped = mapNotificationResponse(eventPayload?.notification || eventPayload || {});
      if (mapped.event_type === "message_received") return;
      this.notifications = mergeNotificationOnTop(this.notifications, mapped);
      window.dispatchEvent(new CustomEvent("notifications:updated"));
    },
    bindRealtimeNotifications() {
      if (!window.Echo || !this.authUserId) return;
      this.notificationChannelName = `notifications.${this.authUserId}`;
      window.Echo.private(this.notificationChannelName).listen("NotificationCreated", (event) => {
        this.handleRealtimeNotification(event);
      });
    },
    unbindRealtimeNotifications() {
      if (!this.notificationChannelName || !window.Echo) return;
      window.Echo.leave(`private-${this.notificationChannelName}`);
      this.notificationChannelName = null;
    },
  },
  async mounted() {
    await this.loadAuthUserId();
    await this.loadNotifications();
    this.bindRealtimeNotifications();
  },
  beforeUnmount() {
    this.unbindRealtimeNotifications();
  },
};
</script>

<style scoped>
.notification-page {
  background: linear-gradient(180deg, #fcfdff 0%, #f8fafc 100%);
}

.notification-hero {
  border: 1px solid #e5eaf2;
  background: #ffffff;
}

.hero-kicker {
  color: #65748a;
  letter-spacing: 0.06em;
  font-weight: 700;
}

.count-pill {
  font-size: 0.76rem;
  font-weight: 600;
  color: #445065;
  background: #f4f6f9;
  border: 1px solid #dce2ea;
  border-radius: 999px;
  padding: 0.28rem 0.7rem;
}

.tabs-shell {
  border-bottom: 1px solid #e8edf4;
  padding-bottom: 0.5rem;
}

.tab-pill {
  border-radius: 10px !important;
  border: 1px solid #e2e8f0;
  color: #56657e;
  background: #f8fafc;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.44rem 0.85rem;
}

.tab-pill.active {
  background: #eef2f7 !important;
  border-color: #d5dce6 !important;
  color: #2f3a4d !important;
}

.tab-count {
  background: #dfe6ef;
  color: #4d5c73;
  border-radius: 999px;
  padding: 0.07rem 0.4rem;
  font-size: 0.7rem;
}

.list-stack {
  display: grid;
  gap: 0.55rem;
}

.notification-card {
  border: 1px solid #e6ebf2;
  border-radius: 12px;
  background: #ffffff;
  padding: 0.85rem 0.95rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  width: 100%;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.notification-card:hover {
  border-color: #d6dde7;
  background: #fcfdff;
}

.notification-card.unread {
  background: #f9fbfd;
  border-color: #d8e0ea;
}

.notification-card.selected {
  border-color: #3f68a5;
  background: #f2f7ff;
}

.notif-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f0f3f7;
  color: #54647d;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.notif-title {
  font-weight: 600;
  color: #273447;
  font-size: 0.95rem;
}

.notif-message {
  color: #5f6d82;
  font-size: 0.83rem;
}

.notif-message-preview {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}

.notif-read-more {
  appearance: none;
  border: none;
  background: transparent;
  color: #2e5ea8;
  font-size: 0.79rem;
  font-weight: 600;
  padding: 0;
  margin: -0.15rem 0 0.25rem;
  cursor: pointer;
}

.notif-read-more:hover {
  color: #1f4a8b;
  text-decoration: underline;
}

.notif-time {
  color: #7b889b;
  font-size: 0.74rem;
}

.unread-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #4c6d9d;
  margin-top: 0.4rem;
  flex-shrink: 0;
}

.select-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25rem;
  flex-shrink: 0;
  font-size: 0.72rem;
}

.select-indicator.active {
  border-color: #345f9e;
  background: #345f9e;
  color: #ffffff;
}

.avatar-skeleton {
  width: 42px;
  height: 42px;
}

.empty-state {
  border: 1px dashed #d9e0ea;
  border-radius: 12px;
  background: #fbfcfe;
  padding: 1.2rem;
}

.empty-state i {
  font-size: 1.25rem;
  color: #708095;
  margin-bottom: 0.25rem;
}

.min-w-0 {
  min-width: 0;
}

.modal-overlay-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-body-custom {
  background: #fff;
  width: 100%;
  max-width: 620px;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid #e6ebf2;
}

.notif-modal-time {
  font-size: 0.78rem;
  color: #7b889b;
}

.notif-modal-message {
  color: #344154;
  font-size: 0.92rem;
  line-height: 1.55;
  white-space: pre-wrap;
}

@media (prefers-reduced-motion: reduce) {
  .notification-card {
    transition: none !important;
  }
}
</style>
