<template>
  <div v-if="showWarning" class="container pt-3">
    <div class="alert alert-warning bg-warning-subtle border-0 rounded-3 mb-3 small" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <span>{{ warningMessage }} </span>
      <RouterLink to="/subscription/renew" class="alert-link fw-semibold">Renew now</RouterLink>
    </div>
  </div>
</template>

<script>
import { useUserInfo } from "@/store/userInfo";
import { getOwnerSubscriptionStatus } from "@/api/subscription";

export default {
  name: "SubscriptionWarningBanner",
  data() {
    return {
      isLoading: false
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
    showWarning() {
      return this.isOwner && !!this.subscription?.is_expiring_soon;
    },
    warningMessage() {
      if (this.subscription?.message) return this.subscription.message;
      const days = this.subscription?.days_left;
      if (typeof days === "number") {
        if (days === 0) {
          return "Your subscription expires today.";
        }
        return `Your subscription will expire in ${days} day(s).`;
      }
      return "Your subscription is about to end.";
    }
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
      console.warn("Subscription warning check failed:", error);
    } finally {
      this.isLoading = false;
    }
  }
};
</script>
