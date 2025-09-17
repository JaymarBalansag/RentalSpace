<template>
  <div class="container py-4" style="max-width: 700px;">
    <!-- Back Button -->
    <RouterLink to="/" class="btn btn-outline-secondary mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <h3 class="fw-bold mb-4">Settings</h3>

    <ul class="list-group shadow-sm">
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span><i class="bi bi-person me-2"></i> Profile</span>
        <button class="btn btn-sm btn-outline-primary">Edit</button>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span><i class="bi bi-bell me-2"></i> Notifications</span>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" v-model="enableNotifications">
        </div>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span><i class="bi bi-lock me-2"></i> Change Password</span>
        <button class="btn btn-sm btn-outline-primary">Update</button>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center text-danger" style="cursor: pointer;" @click="logout">
        <i class="bi bi-box-arrow-right me-2"></i> Logout
      </li>
    </ul>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "SettingsPage",
  components: { RouterLink },
  data() {
    return {
      enableNotifications: true,
    };
  },
  methods: {
    logout() {
      alert("Logging out...");
    },
  },
};
</script>
