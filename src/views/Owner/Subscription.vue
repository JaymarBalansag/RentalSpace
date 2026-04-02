<template>
  <div class="subscription-page p-3 p-md-4">
    <div class="subscription-header mb-4">
      <h4 class="fw-bold text-dark mb-1">Subscription</h4>
      <p class="text-muted small mb-0">Manage your plan, limits, and renewal timeline.</p>
    </div>

    <OwnerSubscriptionExpiredBanner />
    <SubscriptionWarningBanner />

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
              <div v-if="showRenewCTA" class="col-12">
                <button class="btn btn-primary w-100 fw-semibold" @click="goToRenew">
                  Renew Now
                </button>
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
                <h6 class="fw-bold mb-1">Plan Options</h6>
                <p class="text-muted small mb-0">Switch plans near expiry or after your current term ends.</p>
              </div>
              <span class="small fw-semibold" :class="canChangePlan ? 'text-success' : 'text-muted'">
                {{ canChangePlan ? "Plan change available now" : planChangeMessage }}
              </span>
            </div>

            <div class="plan-window-note mb-3" :class="canChangePlan ? 'plan-window-note--ready' : ''">
              <i class="bi" :class="canChangePlan ? 'bi-unlock-fill' : 'bi-lock-fill'"></i>
              <span>{{ planChangeMessage }}</span>
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
                  <div v-if="showDowngradeWarning(plan)" class="plan-warning mt-3">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <span>Changing to a Standard plan will keep your listings active, but advanced Pro tools like bookings, tenants, billing, ledger, and reports will be hidden until you upgrade again.</span>
                  </div>
                  <button
                    class="btn w-100 fw-semibold mt-3"
                    :class="planButtonClass(plan)"
                    :disabled="isPlanButtonDisabled(plan)"
                    @click="goToPlanChange(plan)"
                  >
                    {{ planButtonLabel(plan) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card border-0 glass-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <div>
                <h6 class="fw-bold mb-1">Renewal History</h6>
                <p class="text-muted small mb-0">Track your past renewals and billing periods.</p>
              </div>
            </div>
            <div v-if="historyLoading" class="text-muted small">Loading history...</div>
            <div v-else-if="history.length === 0" class="text-muted small">No renewal history yet.</div>
            <div v-else class="table-responsive">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr class="text-muted small">
                    <th>Date</th>
                    <th>Plan</th>
                    <th>Period</th>
                    <th class="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in history" :key="item.id">
                    <td>{{ formatDate(item.created_at) }}</td>
                    <td>{{ formatPlanLabel(item.plan_name) }}</td>
                    <td>{{ formatDate(item.period_start) }} – {{ formatDate(item.period_end) }}</td>
                    <td class="text-end">{{ formatAmount(item.amount) }}</td>
                  </tr>
                </tbody>
              </table>
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
import { getOwnerSubscriptionHistory, getOwnerSubscriptionStatus } from "@/api/subscription";
import { useUserInfo } from "@/store/userInfo";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner.vue";
import OwnerSubscriptionExpiredBanner from "@/components/OwnerSubscriptionExpiredBanner.vue";
import {
  getOwnerPlanCodeFromSubscription,
  getOwnerPlanDisplayName,
  getOwnerPlanList,
  ownerPlanDowngradesFromPro,
  ownerPlanHasProFeatures,
} from "@/utils/ownerPlans";

export default {
  name: "OwnerSubscription",
  components: { SubscriptionWarningBanner, OwnerSubscriptionExpiredBanner },
  data() {
    return {
      showUpgradeModal: false,
      addonQty: 1,
      addonMin: 1,
      addonMax: 10,
      history: [],
      historyLoading: false,
      upgradePlans: getOwnerPlanList().map((plan) => ({
        ...plan,
        tag: plan.tier === "pro" ? (plan.cycle === "annual" ? "Popular" : "Pro") : "Standard",
        desc: plan.description,
        price: `PHP ${plan.displayPrice.toLocaleString()}`,
        icon: plan.tier === "pro" ? "bi bi-graph-up-arrow" : "bi bi-stars",
      })),
    };
  },
  async mounted() {
    await this.refreshSubscription();
    await this.refreshHistory();
  },
  computed: {
    subscription() {
      const info = useUserInfo();
      return info.subscription || null;
    },
    hasSubscription() {
      return !!(this.subscription && this.subscription.plan_name);
    },
    currentPlanCode() {
      return getOwnerPlanCodeFromSubscription(this.subscription || {});
    },
    hasProFeatures() {
      return ownerPlanHasProFeatures(this.currentPlanCode, this.subscription?.billing_cycle);
    },
    planName() {
      if (!this.subscription?.plan_name) return "No active plan";
      return getOwnerPlanDisplayName(this.currentPlanCode, this.subscription?.billing_cycle);
    },
    subscriptionMessage() {
      return this.subscription?.message || "Review your plan status and limits.";
    },
    statusLabel() {
      if (!this.hasSubscription) return "No Plan";
      const status = String(this.subscription?.status || "inactive").toLowerCase();
      if (status.includes("active")) return "Active";
      if (status.includes("trial")) return "Trial";
      if (status.includes("expired")) return "Expired";
      if (status.includes("pending")) return "Pending";
      return "Inactive";
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
    showRenewCTA() {
      if (!this.hasSubscription) return false;
      const status = String(this.subscription?.status || "").toLowerCase();
      return Boolean(this.subscription?.is_expiring_soon) || status === "expired";
    },
    currentCycle() {
      return String(this.subscription?.billing_cycle || "").toLowerCase();
    },
    canChangePlan() {
      if (!this.hasSubscription) return false;
      if (typeof this.subscription?.can_change_plan === "boolean") {
        return this.subscription.can_change_plan;
      }
      const status = String(this.subscription?.status || "").toLowerCase();
      const days = Number(this.subscription?.days_left);
      if (status === "expired") return true;
      return status === "active" && Number.isFinite(days) && days <= 7;
    },
    planChangeMessage() {
      if (!this.hasSubscription) return "Choose a plan after your first subscription is active.";
      if (this.subscription?.plan_change_message) return this.subscription.plan_change_message;
      return this.canChangePlan
        ? "You can change your plan now."
        : "Plan changes become available in the last 7 days of your subscription or after expiry.";
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
      return plan.code === this.currentPlanCode;
    },
    planButtonLabel(plan) {
      if (this.isCurrentPlan(plan)) return "Current Plan";
      if (ownerPlanDowngradesFromPro(this.currentPlanCode, plan.code)) return "Switch to Standard";
      if (!this.hasProFeatures && plan.tier === "pro") return "Upgrade to Pro";
      if (plan.cycle !== this.currentCycle) return plan.cycle === "annual" ? "Switch to Annual Billing" : "Switch to Monthly Billing";
      return "Change to this plan";
    },
    planButtonClass(plan) {
      return this.isCurrentPlan(plan) ? "btn-primary" : "btn-light border";
    },
    isPlanButtonDisabled(plan) {
      if (this.isCurrentPlan(plan)) return true;
      return !this.canChangePlan;
    },
    showDowngradeWarning(plan) {
      return ownerPlanDowngradesFromPro(this.currentPlanCode, plan?.code);
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
    async refreshHistory() {
      this.historyLoading = true;
      try {
        const response = await getOwnerSubscriptionHistory();
        this.history = response?.data || response?.history || [];
      } catch (error) {
        console.warn("Failed to load subscription history:", error);
        this.history = [];
      } finally {
        this.historyLoading = false;
      }
    },
    goToRenew() {
      this.$router.push({ path: "/subscription/renew", query: { plan: this.currentPlanCode } });
    },
    goToPlanChange(plan) {
      if (this.isPlanButtonDisabled(plan)) return;
      this.$router.push({ path: "/subscription/change", query: { plan: plan.code } });
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
    formatPlanLabel(value) {
      if (!value) return "—";
      return getOwnerPlanDisplayName(value);
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
.plan-window-note {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(148, 163, 184, 0.09);
  color: #475569;
  font-size: 0.92rem;
  font-weight: 600;
}
.plan-window-note i {
  color: #64748b;
}
.plan-window-note--ready {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.18);
  color: #166534;
}
.plan-window-note--ready i {
  color: #16a34a;
}
.plan-warning {
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  padding: 0.85rem 0.95rem;
  border-radius: 14px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.18);
  color: #9a3412;
  font-size: 0.86rem;
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


