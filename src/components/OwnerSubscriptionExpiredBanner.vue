<template>
  <div v-if="showExpired" class="container pt-3">
    <div class="alert alert-warning bg-warning-subtle border-0 rounded-3 mb-3 small" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>Your subscription has expired. Properties are hidden until you renew.</span>
    </div>
  </div>
</template>

<script>
import { useUserInfo } from "@/store/userInfo";
import { getOwnerSubscriptionStatus } from "@/api/subscription";

export default {
  name: "OwnerSubscriptionExpiredBanner",
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    info() {
      return useUserInfo();
    },
    isOwner() {
      return this.info.isLoggedIn && this.info.role === "owner";
    },
    subscription() {
      return this.info.subscription || null;
    },
    showExpired() {
      if (!this.isOwner || !this.subscription) return false;
      const canManage = this.subscription?.can_manage_properties;
      const hasStatus = typeof this.subscription?.status !== "undefined" && this.subscription?.status !== null;
      const status = hasStatus ? String(this.subscription.status).toLowerCase() : "";
      const statusInactive = hasStatus && !["active", "trialing", "trial", "ongoing"].includes(status);
      return canManage === false || statusInactive;
    },
  },
  async mounted() {
    if (!this.isOwner || this.subscription || this.isLoading) return;
    this.isLoading = true;
    try {
      const subscription = await getOwnerSubscriptionStatus();
      if (subscription) {
        this.info.setSubscriptionStatus(subscription);
      }
    } catch (error) {
      console.warn("Subscription expired check failed:", error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
