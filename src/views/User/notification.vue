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
        <div class="d-flex align-items-center gap-2">
          <span class="count-pill">{{ unreadCount }} unread</span>
          <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="markAllAsRead" :disabled="!hasUnreadInActiveTab">
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
      <button
        v-for="notification in filteredNotifications"
        :key="notification.id"
        class="notification-card text-start"
        :class="{ unread: !notification.read }"
        @click="markAsRead(notification)"
      >
        <div class="notif-icon-wrap">
          <i :class="notification.icon"></i>
        </div>

        <div class="flex-grow-1 min-w-0">
          <p class="notif-title mb-1">{{ notification.title }}</p>
          <p v-if="notification.message" class="notif-message mb-1">{{ notification.message }}</p>
          <small class="notif-time">{{ notification.time }}</small>
        </div>

        <span v-if="!notification.read" class="unread-dot" aria-label="Unread notification"></span>
      </button>
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
import Header from "@/components/Header.vue";
import {
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
    };
  },
  computed: {
    filteredNotifications() {
      return this.notifications.filter((n) => n.type === this.activeTab);
    },
    unreadCount() {
      return this.notifications.filter((n) => !n.read).length;
    },
    unreadByType() {
      return {
        system: this.notifications.filter((n) => n.type === "system" && !n.read).length,
        bookings: this.notifications.filter((n) => n.type === "bookings" && !n.read).length,
      };
    },
    hasUnreadInActiveTab() {
      return this.filteredNotifications.some((n) => !n.read);
    },
  },
  methods: {
    async loadNotifications() {
      this.loading = true;
      this.error = "";
      try {
        const res = await fetchNotifications();
        this.notifications = mapNotificationListResponse(res?.data);
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
    },
    async markAllAsRead() {
      if (!this.hasUnreadInActiveTab) return;
      this.notifications.forEach((n) => {
        if (n.type === this.activeTab) n.read = true;
      });
      try {
        await markAllNotificationsAsRead(this.activeTab);
      } catch (_) {}
    },
    handleRealtimeNotification(eventPayload) {
      const mapped = mapNotificationResponse(eventPayload?.notification || eventPayload || {});
      this.notifications = mergeNotificationOnTop(this.notifications, mapped);
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

@media (prefers-reduced-motion: reduce) {
  .notification-card {
    transition: none !important;
  }
}
</style>
