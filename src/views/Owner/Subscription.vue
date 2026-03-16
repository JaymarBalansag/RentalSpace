<template>
  <div class="subscription-page p-3 p-md-4">
    <div class="subscription-header mb-4">
      <h4 class="fw-bold text-dark mb-1">Subscription</h4>
      <p class="text-muted small mb-0">Manage your plan, limits, and renewal timeline.</p>
    </div>

    <div class="row g-3 g-lg-4 align-items-stretch">
      <div class="col-12 col-lg-7">
        <div class="card border-0 glass-card h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
              <div>
                <p class="text-muted text-uppercase fw-semibold small mb-1">Current Plan</p>
                <h5 class="fw-bold mb-1">{{ planName }}</h5>
                <p class="text-muted small mb-0">{{ subscriptionMessage }}</p>
              </div>
              <span class="badge rounded-pill status-pill" :class="statusTone">
                {{ statusLabel }}
              </span>
            </div>

            <div v-if="hasSubscription" class="row g-3">
              <div class="col-12 col-md-6">
                <div class="info-tile">
                  <p class="label">Billing Cycle</p>
                  <p class="value">{{ subscription.billing_cycle || "—" }}</p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="info-tile">
                  <p class="label">Amount</p>
                  <p class="value">{{ formatAmount(subscription.amount) }}</p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="info-tile">
                  <p class="label">Start Date</p>
                  <p class="value">{{ formatDate(subscription.start_date) }}</p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="info-tile">
                  <p class="label">End Date</p>
                  <p class="value">{{ formatDate(subscription.end_date) }}</p>
                </div>
              </div>
              <div class="col-12">
                <div class="notice-pill">
                  <i class="bi bi-clock-history me-2"></i>
                  <span>
                    {{ daysLeftText }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">
                <i class="bi bi-gem"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-1">No subscription record yet</h6>
                <p class="text-muted small mb-0">
                  Subscribe to unlock property management and billing features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="card border-0 glass-card h-100">
          <div class="card-body p-4">
            <h6 class="fw-bold mb-2">Usage & Limits</h6>
            <p class="text-muted small mb-3">Keep track of your current plan allowances.</p>
            <div class="limit-list">
              <div class="limit-row">
                <span class="label">Listing Limit</span>
                <span class="value">{{ formatLimit(subscription?.listing_limit) }}</span>
              </div>
              <div class="limit-row">
                <span class="label">Manage Properties</span>
                <span class="value">
                  <span class="badge rounded-pill" :class="manageTone">
                    {{ manageLabel }}
                  </span>
                </span>
              </div>
              <div class="limit-row">
                <span class="label">Auto Renewal</span>
                <span class="value">Manual</span>
              </div>
            </div>
            <div class="upgrade-cta mt-4">
              <div class="usage-bar">
                <div class="usage-meta">
                  <span class="fw-semibold">Listings Used</span>
                  <span class="text-muted small">{{ listingUsageText }}</span>
                </div>
                <div class="progress usage-progress" role="progressbar" :aria-valuenow="listingUsagePercent" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar" :style="{ width: listingUsagePercent + '%' }"></div>
                </div>
              </div>
              <div class="upgrade-banner">
                <div>
                  <h6 class="fw-bold mb-1">Need more listings?</h6>
                  <p class="small mb-0">Add extra listing slots without changing your plan.</p>
                </div>
                <button class="btn btn-primary fw-semibold" @click="showUpgradeModal = true">
                  Upgrade Limit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 g-lg-4 mt-1">
      <div class="col-12">
        <div class="card border-0 glass-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <div>
                <h6 class="fw-bold mb-1">Upgrade Options</h6>
                <p class="text-muted small mb-0">Compare plans tailored for growing portfolios.</p>
              </div>
              <button class="btn btn-outline-secondary fw-semibold" disabled>
                Coming Soon
              </button>
            </div>

            <div class="row g-3">
              <div class="col-12 col-md-6" v-for="plan in upgradePlans" :key="plan.name">
                <div class="plan-card" :class="{ 'plan-card--current': isCurrentPlan(plan) }">
                  <div class="d-flex align-items-start justify-content-between mb-3">
                    <div>
                      <p class="text-uppercase small fw-semibold text-muted mb-1">{{ plan.tag }}</p>
                      <h6 class="fw-bold mb-1">{{ plan.name }}</h6>
                      <p class="text-muted small mb-0">{{ plan.desc }}</p>
                    </div>
                    <i :class="plan.icon" class="plan-icon"></i>
                  </div>
                  <div class="plan-price mb-3">
                    <span class="fw-bold">{{ plan.price }}</span>
                    <span class="text-muted small">/ {{ plan.cycle }}</span>
                  </div>
                  <ul class="plan-features">
                    <li v-for="feature in plan.features" :key="feature">
                      <i class="bi bi-check2-circle"></i>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                  <button class="btn w-100 fw-semibold mt-3" :class="planButtonClass(plan)" disabled>
                    {{ planButtonLabel(plan) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showUpgradeModal" class="modal fade show modal-backdrop-open" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header border-0">
          <h5 class="modal-title fw-bold">Upgrade Listing Limit</h5>
          <button type="button" class="btn-close" @click="showUpgradeModal = false"></button>
        </div>
        <div class="modal-body">
          <p class="text-muted small mb-3">Choose how many extra listings you want to add.</p>
          <div class="stepper-card">
            <div class="stepper-controls">
              <button class="btn btn-outline-secondary" @click="decreaseAddon" :disabled="addonQty <= addonMin">
                <i class="bi bi-dash"></i>
              </button>
              <div class="stepper-value">{{ addonQty }}</div>
              <button class="btn btn-outline-secondary" @click="increaseAddon" :disabled="addonQty >= addonMax">
                <i class="bi bi-plus"></i>
              </button>
            </div>
            <div class="stepper-meta">
              <div>
                <p class="text-muted small mb-1">Unit Price</p>
                <p class="fw-bold mb-0">PHP {{ addonUnitPrice }} / {{ addonCycleLabel }}</p>
              </div>
              <div class="text-end">
                <p class="text-muted small mb-1">Total</p>
                <p class="fw-bold mb-0">PHP {{ addonTotal }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0">
          <button class="btn btn-light border" @click="showUpgradeModal = false">Cancel</button>
          <button class="btn btn-primary fw-semibold" @click="goToAddonPayment">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOwnerSubscriptionStatus } from "@/api/subscription";
import { useUserInfo } from "@/store/userInfo";

export default {
  name: "OwnerSubscription",
  data() {
    return {
      showUpgradeModal: false,
      addonQty: 1,
      addonMin: 1,
      addonMax: 10,
      upgradePlans: [
        {
          tag: "Starter",
          name: "Monthly",
          desc: "Best for new property owners.",
          price: "PHP 200", 
          cycle: "monthly",
          icon: "bi bi-stars",
          features: ["Up to 2 listings"],
        },
        {
          tag: "Popular",
          name: "Annual",
          desc: "For steady rental growth.",
          price: "PHP 1800",
          cycle: "annual",
          icon: "bi bi-graph-up-arrow",
          features: ["Up to 5 listings", "System Management"],
        },
      ],
    };
  },
  async mounted() {
    await this.refreshSubscription();
  },
  computed: {
    subscription() {
      const info = useUserInfo();
      return info.subscription || null;
    },
    hasSubscription() {
      return !!this.subscription;
    },
    planName() {
      return this.subscription?.plan_name || "No active plan";
    },
    subscriptionMessage() {
      return this.subscription?.message || "Review your plan status and limits.";
    },
    statusLabel() {
      const status = String(this.subscription?.status || "inactive").toLowerCase();
      if (status.includes("active")) return "Active";
      if (status.includes("trial")) return "Trial";
      if (status.includes("expired")) return "Expired";
      if (status.includes("pending")) return "Pending";
      return this.hasSubscription ? "Inactive" : "No Plan";
    },
    statusTone() {
      const label = this.statusLabel.toLowerCase();
      if (label.includes("active")) return "status-success";
      if (label.includes("trial")) return "status-info";
      if (label.includes("pending")) return "status-warning";
      if (label.includes("expired")) return "status-danger";
      return "status-neutral";
    },
    manageLabel() {
      if (!this.hasSubscription) return "Unavailable";
      return this.subscription?.can_manage_properties ? "Allowed" : "Blocked";
    },
    manageTone() {
      return this.subscription?.can_manage_properties ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger";
    },
    daysLeftText() {
      if (!this.hasSubscription) return "Subscription details will appear here once available.";
      const days = this.subscription?.days_left;
      if (typeof days !== "number") return "Renewal date is being updated.";
      if (days <= 0) return "Your subscription is due for renewal.";
      return `${days} day(s) remaining until renewal.`;
    },
    currentCycle() {
      return String(this.subscription?.billing_cycle || "").toLowerCase();
    },
    addonUnitPrice() {
      return this.currentCycle === "annual" ? 450 : 50;
    },
    addonCycleLabel() {
      return this.currentCycle === "annual" ? "year" : "month";
    },
    addonTotal() {
      return this.addonQty * this.addonUnitPrice;
    },
    listingUsageText() {
      const limit = this.subscription?.listing_limit;
      if (typeof limit !== "number" || limit <= 0) {
        return "Usage data unavailable";
      }
      return `${limit} listings available`;
    },
    listingUsagePercent() {
      const limit = this.subscription?.listing_limit;
      if (typeof limit !== "number" || limit <= 0) {
        return 0;
      }
      return 0;
    },
  },
  methods: {
    increaseAddon() {
      this.addonQty = Math.min(this.addonQty + 1, this.addonMax);
    },
    decreaseAddon() {
      this.addonQty = Math.max(this.addonQty - 1, this.addonMin);
    },
    goToAddonPayment() {
      const query = {
        qty: this.addonQty,
        cycle: this.currentCycle || "monthly",
        unit_price: this.addonUnitPrice,
        total: this.addonTotal,
      };
      this.showUpgradeModal = false;
      this.$router.push({ path: "/owner/addon-payment", query });
    },
    isCurrentPlan(plan) {
      if (!this.currentCycle) return false;
      return String(plan.cycle || "").toLowerCase() === this.currentCycle;
    },
    planButtonLabel(plan) {
      return this.isCurrentPlan(plan) ? "Current Plan" : "Upgrade to this plan";
    },
    planButtonClass(plan) {
      return this.isCurrentPlan(plan) ? "btn-primary" : "btn-light border";
    },
    async refreshSubscription() {
      try {
        const subscription = await getOwnerSubscriptionStatus();
        const info = useUserInfo();
        info.setSubscriptionStatus(subscription);
      } catch (error) {
        console.warn("Failed to refresh subscription status:", error);
      }
    },
    formatAmount(amount) {
      if (amount === null || amount === undefined || amount === "") return "—";
      const value = Number(amount || 0);
      return `PHP ${value.toLocaleString()}`;
    },
    formatDate(value) {
      if (!value) return "—";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "—";
      return date.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
    },
    formatLimit(value) {
      if (value === null || value === undefined) return "—";
      if (value === 0) return "No limit";
      return value;
    },
  },
};
</script>

<style scoped>
.subscription-page {
  color: #0f172a;
}
.subscription-header h4 {
  letter-spacing: 0.2px;
}
.glass-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
}
.status-pill {
  font-size: 0.75rem;
  padding: 0.4rem 0.85rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
}
.status-success { background: rgba(34, 197, 94, 0.15); color: #15803d; }
.status-info { background: rgba(14, 165, 233, 0.15); color: #0369a1; }
.status-warning { background: rgba(245, 158, 11, 0.18); color: #b45309; }
.status-danger { background: rgba(239, 68, 68, 0.16); color: #b91c1c; }
.status-neutral { background: rgba(148, 163, 184, 0.2); color: #475569; }

.info-tile {
  background: rgba(15, 23, 42, 0.03);
  border-radius: 14px;
  padding: 14px 16px;
  border: 1px solid rgba(15, 23, 42, 0.06);
}
.info-tile .label {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 600;
}
.info-tile .value {
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}
.notice-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: rgba(43, 106, 243, 0.12);
  color: #1d4ed8;
  font-weight: 600;
  font-size: 0.85rem;
}
.empty-state {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px dashed rgba(15, 23, 42, 0.1);
}
.empty-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(43, 106, 243, 0.15);
  color: #1d4ed8;
  font-size: 1.4rem;
}
.limit-list {
  display: grid;
  gap: 0.75rem;
}
.limit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.06);
}
.limit-row .label {
  font-weight: 600;
  color: #475569;
}
.limit-row .value {
  font-weight: 700;
}
.upgrade-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: linear-gradient(120deg, rgba(43, 106, 243, 0.95), rgba(45, 212, 191, 0.9));
  color: #fff;
}
.upgrade-banner .btn {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
}
.upgrade-cta {
  display: grid;
  gap: 1rem;
}
.usage-bar {
  display: grid;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.08);
}
.usage-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.usage-progress {
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
}
.usage-progress .progress-bar {
  background: linear-gradient(120deg, rgba(43, 106, 243, 0.95), rgba(45, 212, 191, 0.9));
  border-radius: 999px;
}
.upgrade-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(43, 106, 243, 0.2);
  background: rgba(43, 106, 243, 0.08);
}
.modal-backdrop-open {
  display: block;
  background: rgba(15, 23, 42, 0.35);
}
.stepper-card {
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.03);
  padding: 1rem;
  display: grid;
  gap: 1rem;
}
.stepper-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.stepper-value {
  font-size: 1.6rem;
  font-weight: 700;
  min-width: 64px;
  text-align: center;
}
.stepper-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.plan-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.25rem;
  height: 100%;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
}
.plan-card--current {
  border-color: rgba(43, 106, 243, 0.45);
  box-shadow: 0 16px 34px rgba(43, 106, 243, 0.15);
}
.plan-icon {
  font-size: 1.4rem;
  color: #2b6af3;
}
.plan-price {
  font-size: 1.2rem;
}
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.92rem;
}
.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.plan-features i {
  color: #22c55e;
}

@media (max-width: 768px) {
  .upgrade-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .upgrade-inline {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
