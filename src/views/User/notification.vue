<template>
  <Header></Header>

  <div class="container py-4" style="max-width: 700px;">
    <!-- Back Button -->
    <RouterLink to="/home" class="btn btn-outline-secondary mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <!-- Header -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h4 class="fw-bold mb-0">Notifications</h4>
      <button class="btn btn-sm btn-outline-primary" @click="markAllAsRead">
        Mark all as read
      </button>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'system' }"
          @click="activeTab = 'system'"
        >
          System
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'bookings' }"
          @click="activeTab = 'bookings'"
        >
          Bookings
        </button>
      </li>
    </ul>

    <!-- Notification List -->
    <ul class="list-group">
      <li
        v-for="notification in filteredNotifications"
        :key="notification.id"
        class="list-group-item d-flex align-items-start"
        :class="{ 'bg-light': !notification.read }"
        style="cursor: pointer;"
        @click="markAsRead(notification)"
      >
        <!-- Avatar / Icon -->
        <div class="profile-circle me-3">
          <i :class="notification.icon"></i>
        </div>

        <!-- Notification Content -->
        <div class="flex-grow-1">
          <p class="mb-1">
            <strong>{{ notification.title }}</strong>
          </p>
          <small class="text-muted">{{ notification.time }}</small>
        </div>

        <!-- Status Dot -->
        <span v-if="!notification.read" class="badge bg-primary rounded-pill ms-2">
          New
        </span>
      </li>
    </ul>

    <div v-if="loading" class="text-center text-muted mt-3">Loading notifications...</div>
    <div v-if="error" class="text-danger small mt-3">{{ error }}</div>

    <!-- Empty State -->
    <div v-if="filteredNotifications.length === 0" class="text-center text-muted mt-5">
      <i class="bi bi-bell-slash fs-1"></i>
      <p>No {{ activeTab }} notifications</p>
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
.profile-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
