<template>
  <div class="container text-center py-5">
    <h2 class="text-success fw-bold">Payment Success</h2>
    <p class="text-muted">
      Payment has been successfully processed.
    </p>

    <div class="spinner-border text-primary mt-3"></div>

    <p class="small mt-3">
      {{ statusMessage }}
    </p>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import { getOwnerSubscriptionStatus } from "@/api/subscription";
import { useUserInfo } from "@/store/userInfo";

export default {
  data() {
    return {
      statusMessage: "Do not close this page.",
    };
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async waitForOwnerActivation() {
      const info = useUserInfo();
      const maxAttempts = 8;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        this.statusMessage = `Finalizing your account (${attempt + 1}/${maxAttempts})...`;

        try {
          const profileRes = await getUserProfile();
          const user = profileRes?.data?.user?.[0] || profileRes?.data?.user || null;

          if (user?.role === "owner") {
            info.setOwnerVerificationStatus(
              user?.owner_verification_status || info.owner_verification_status || "unverified",
              user?.owner_verified_at || null
            );
            const subscription = await getOwnerSubscriptionStatus();
            info.setSubscriptionStatus(subscription);

            if (subscription?.can_manage_properties) {
              if (subscription?.is_expiring_soon) {
                alert(subscription.message || `Your subscription will expire in ${subscription.days_left} day(s).`);
              }

              window.location.href = "/overview";
              return;
            }
          }
        } catch (error) {
          console.warn("Waiting for webhook completion failed on this attempt:", error);
        }

        await this.sleep(5000);
      }

      this.statusMessage = "Payment is recorded. Subscription update may still be processing. Redirecting...";
      window.location.href = "/home";
    },
  },
  mounted() {
    this.waitForOwnerActivation();
  },
};
</script>
