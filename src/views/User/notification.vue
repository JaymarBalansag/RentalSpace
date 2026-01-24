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
        v-for="(notification, index) in filteredNotifications"
        :key="index"
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

export default {
  name: "NotificationPage",
  components: { RouterLink, Header },
  data() {
    return {
      activeTab: "system",
      notifications: [
        {
          title: "Maria Santos sent you a message.",
          time: "5 minutes ago",
          type: "system",
          icon: "bi bi-bell text-primary",
          read: false,
        },
        {
          title: "Your reservation for Apartment A has been confirmed.",
          time: "1 hour ago",
          type: "bookings",
          icon: "bi bi-calendar-check text-success",
          read: false,
        },
        {
          title: "Juan Dela Cruz left a review on your listing.",
          time: "Yesterday",
          type: "system",
          icon: "bi bi-star text-warning",
          read: true,
        },
      ],
    };
  },
  computed: {
    filteredNotifications() {
      return this.notifications.filter((n) => n.type === this.activeTab);
    },
  },
  methods: {
    markAsRead(notification) {
      notification.read = true;
    },
    markAllAsRead() {
      this.notifications.forEach((n) => {
        if (n.type === this.activeTab) n.read = true;
      });
    },
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
