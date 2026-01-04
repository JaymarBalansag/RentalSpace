<template>
  <Header></Header>

  <div class="container py-4" style="max-width: 600px;">
    <!-- Back Button -->
    <RouterLink to="/settings" class="btn btn-outline-secondary mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <h3 class="fw-bold mb-4">Change Password</h3>

    <!-- Step 1: Verify Current Password -->
    <div v-if="step === 1" class="card shadow-sm p-4">
      <h5 class="fw-bold mb-3">Verify Your Current Password</h5>
      <form @submit.prevent="verifyPassword">
        <div class="mb-3 position-relative">
          <label class="form-label">Current Password</label>
          <input
            :type="showCurrent ? 'text' : 'password'"
            v-model="currentPassword"
            class="form-control"
            required
          >
          <i
            class="bi"
            :class="showCurrent ? 'bi-eye-slash' : 'bi-eye'"
            @click="showCurrent = !showCurrent"
            style="position:absolute; right:10px; top:38px; cursor:pointer;"
          ></i>
        </div>
        <button
          type="submit"
          :class="loading ? 'btn btn-primary w-100 disabled' : 'btn btn-primary w-100'"
        >
          Continue
        </button>
      </form>
    </div>

    <!-- Step 2: Set New Password -->
    <div v-else class="card shadow-sm p-4">
      <h5 class="fw-bold mb-3">Set a New Password</h5>
      <form @submit.prevent="changePassword">
        <div class="mb-3 position-relative">
          <label class="form-label">New Password</label>
          <input
            :type="showNew ? 'text' : 'password'"
            v-model="newPassword"
            class="form-control"
            required
          >
          <i
            class="bi"
            :class="showNew ? 'bi-eye-slash' : 'bi-eye'"
            @click="showNew = !showNew"
            style="position:absolute; right:10px; top:38px; cursor:pointer;"
          ></i>
        </div>
        <div class="mb-3 position-relative">
          <label class="form-label">Confirm New Password</label>
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="confirmPassword"
            class="form-control"
            required
          >
          <i
            class="bi"
            :class="showConfirm ? 'bi-eye-slash' : 'bi-eye'"
            @click="showConfirm = !showConfirm"
            style="position:absolute; right:10px; top:38px; cursor:pointer;"
          ></i>
        </div>
        <button
          type="submit"
          :class="loading ? 'btn btn-success w-100 disabled' : 'btn btn-success w-100'"
        >
          Update Password
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Header from "@/components/Header.vue";
import { verifyCurrentPassword, changeUserPassword } from "@/api/user";

export default {
  name: "ChangePasswordPage",
  components: { RouterLink, Header },
  data() {
    return {
      step: 1,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      loading: false,
      // show/hide toggles
      showCurrent: false,
      showNew: false,
      showConfirm: false,
    };
  },
  methods: {
    async verifyPassword() {
      this.loading = true;
      try {
        if (this.currentPassword.trim() !== "") {
          const response = await verifyCurrentPassword(this.currentPassword);
          if (response.status === 200 && response.data.verified) {
            alert(response.data.message || "Password verified.");
            this.step = 2;
          } else {
            alert("Incorrect current password.");
          }
        } else {
          alert("Please enter your current password.");
        }
      } catch (error) {
        alert(error.response?.data?.message || "An error occurred while verifying your password.");
      } finally {
        this.loading = false;
      }
    },
    async changePassword() {
      this.loading = true;
      try {
        if (this.newPassword.trim() !== this.confirmPassword.trim()) {
          alert("New passwords do not match!");
          return;
        }
        if (this.newPassword.trim().length < 8) {
          alert("Password must be at least 8 characters long.");
          return;
        }
        const response = await changeUserPassword(this.newPassword.trim(), this.confirmPassword.trim());
        if (response.status !== 200) {
          alert(response.data.message || "Failed to update password.");
          return;
        }
        alert(response.data.message || "Password updated successfully!");
        this.currentPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.step = 1;
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
