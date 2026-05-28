<template>
  <Header />

  <section class="payment-wall">
    <div class="container py-5">
      <div class="hero text-center mb-5">
        <span class="eyebrow">Owner Plans</span>
        <h2 class="fw-bold">Choose a plan that fits your listings</h2>
        <p class="text-muted">
          Clear tools, clear limits. Pick Standard or Pro, then choose monthly or annual billing based on what works best for you.
        </p>
        <div class="value-row">
          <div class="value-pill"><i class="bi bi-shield-check me-2"></i>Secure payments</div>
          <div class="value-pill"><i class="bi bi-patch-check me-2"></i>Verified listings</div>
          <div class="value-pill"><i class="bi bi-headset me-2"></i>Priority support</div>
        </div>
      </div>

      <div v-if="step === 1" ref="comparisonRef" class="comparison-card mx-auto mb-5">
        <div class="comparison-header">
          <h5 class="fw-bold mb-1">Compare features</h5>
          <p class="text-muted small mb-0">See what's included in Standard vs what unlocks in Pro.</p>
        </div>
        <div class="table-responsive">
          <table class="table table-borderless align-middle comparison-table mb-0">
            <thead>
              <tr>
                <th class="feature-col">Feature</th>
                <th class="tier-col text-center">Standard</th>
                <th class="tier-col text-center">Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in comparisonRows" :key="row.id">
                <td class="feature-name">{{ row.label }}</td>
                <td class="text-center">
                  <div class="tier-cell" :class="{ excluded: !row.standard.included }">
                    <i class="bi" :class="row.standard.included ? 'bi-check-circle-fill' : 'bi-x-circle'"></i>
                    <span v-if="cellLabel(row.standard.value)" class="tier-value">{{ cellLabel(row.standard.value) }}</span>
                  </div>
                </td>
                <td class="text-center">
                  <div class="tier-cell" :class="{ excluded: !row.pro.included }">
                    <i class="bi" :class="row.pro.included ? 'bi-check-circle-fill' : 'bi-x-circle'"></i>
                    <span v-if="cellLabel(row.pro.value)" class="tier-value">{{ cellLabel(row.pro.value) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="comparison-cta-row">
                <td class="comparison-cta-spacer"></td>
                <td class="text-center comparison-cta-cell">
                  <button type="button" class="btn btn-primary fw-bold w-100 comparison-cta-btn" @click="goToStep2('standard')">
                    Choose Standard
                  </button>
                </td>
                <td class="text-center comparison-cta-cell">
                  <button type="button" class="btn btn-dark fw-bold w-100 comparison-cta-btn" @click="goToStep2('pro')">
                    Choose Pro
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div v-if="step === 2" ref="step2Ref" class="choose-card mx-auto">
        <div class="choose-header">
          <div class="choose-header-left">
            <button type="button" class="btn btn-link p-0 back-link" @click="goBackToComparison">
              <i class="bi bi-arrow-left"></i> Back to comparison
            </button>
            <h5 class="fw-bold mb-1">Choose billing for {{ selectedTier === "pro" ? "Pro" : "Standard" }}</h5>
            <p class="text-muted small mb-0">Monthly is flexible; Annual saves more overall.</p>
          </div>
          <div class="choose-price text-end">
            <div class="choose-amount">{{ selectedTier === "pro" ? "Pro" : "Standard" }}</div>
            <div class="choose-cycle text-muted small">Monthly vs Annual</div>
          </div>
        </div>

        <div class="choose-controls">
          <div class="plan-grid">
            <div
              v-for="plan in tierPlans"
              :key="plan.code"
              class="plan-card"
              :class="[selectedTier === 'pro' ? 'plan-card--pro' : 'plan-card--standard', plan.cycle === 'annual' ? 'plan-card--annual' : '']"
            >
              <div class="plan-card-top">
                <div v-if="plan.cycle === 'annual'" class="plan-ribbon">Best value</div>
                <div class="plan-card-badges">
                  <span class="pill" :class="plan.cycle === 'annual' ? 'pill-annual' : 'pill-monthly'">
                    {{ plan.cycle === 'annual' ? 'Annual' : 'Monthly' }}
                  </span>
                  <span v-if="plan.cycle === 'annual'" class="pill pill-value">
                    Save
                    <span class="pill-value-num">-{{ annualSavingsPercent(selectedTier) }}%</span>
                  </span>
                </div>
                <h4 class="plan-card-title">{{ plan.name }}</h4>
                <p class="plan-card-subtext mb-0">
                  <span class="fw-semibold">PHP {{ plan.displayPrice.toLocaleString() }}</span>
                  <span class="text-muted"> {{ plan.cycle === 'annual' ? '/ year' : '/ month' }}</span>
                </p>
                <p v-if="plan.cycle === 'annual'" class="small text-muted mb-0">
                  Equivalent: <span class="fw-semibold">PHP {{ annualPerMonth(plan).toLocaleString() }}</span> / month
                </p>
              </div>

              <div class="plan-card-bottom">
                <div class="plan-card-note">
                  <span v-if="plan.cycle === 'annual'" class="small text-muted">
                    Pay once for the year and save more overall. Great if you plan to stay active.
                  </span>
                  <span v-else class="small text-muted">
                    Flexible monthly billing to get started fast. You can switch to annual later.
                  </span>
                </div>
                <button
                  type="button"
                  class="btn w-100 fw-bold"
                  :class="selectedTier === 'pro' ? 'btn-dark' : 'btn-primary'"
                  @click="selectPlan(plan.code)"
                >
                  Choose {{ plan.cycle === 'annual' ? 'Annual' : 'Monthly' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from '@/components/Header.vue';
import { useUserInfo } from '@/store/userInfo';
import Swal from "sweetalert2";
import { getOwnerPlan, getOwnerPlanFeatureComparisonRows } from "@/utils/ownerPlans";

export default {
  name: "PaymentWall",
  components: { Header },
  data() {
    return {
      standardPlanSample: getOwnerPlan("monthly_standard"),
      proPlanSample: getOwnerPlan("monthly_pro"),
      step: 1,
      selectedTier: "standard",
    };
  },
  computed: {
    comparisonRows() {
      return getOwnerPlanFeatureComparisonRows(this.standardPlanSample, this.proPlanSample);
    },
    tierPlans() {
      return [
        getOwnerPlan(`monthly_${this.selectedTier}`),
        getOwnerPlan(`annual_${this.selectedTier}`),
      ];
    },
  },
  methods: {
    goToStep2(tier) {
      this.selectedTier = tier;
      this.step = 2;
      this.$nextTick(() => {
        this.$refs.step2Ref?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    goBackToComparison() {
      this.step = 1;
      this.$nextTick(() => {
        this.$refs.comparisonRef?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    cellLabel(value) {
      if (value === null || typeof value === "undefined") return "";
      if (Number.isFinite(Number(value))) {
        return `${Number(value)} listings`;
      }
      return String(value);
    },
    annualPerMonth(plan) {
      const raw = Number(plan?.displayPrice || 0);
      const perMonth = raw / 12;
      return Number.isFinite(perMonth) ? Math.round(perMonth) : 0;
    },
    annualSavingsPercent(tier) {
      const monthly = getOwnerPlan(`monthly_${tier}`);
      const annual = getOwnerPlan(`annual_${tier}`);
      const monthlyTotal = Number(monthly?.displayPrice || 0) * 12;
      const annualTotal = Number(annual?.displayPrice || 0);
      if (!monthlyTotal || monthlyTotal <= 0) return 0;
      const pct = ((monthlyTotal - annualTotal) / monthlyTotal) * 100;
      return Math.max(0, Math.round(pct));
    },
    selectPlan(planCode) {
      const info = useUserInfo();
      const status = String(info.user_verification_status || "unverified").toLowerCase().trim();
      if (status !== "verified") {
        const text = status === "pending"
          ? "Your verification is under review. Owner onboarding unlocks once approved."
          : status === "rejected"
            ? "Your verification was rejected. Please resubmit a valid government ID in your profile."
            : "You must verify your account first before applying as owner.";
        Swal.fire({
          icon: "warning",
          title: "Verification required",
          text,
          confirmButtonText: "Go to Profile",
        }).then(() => {
          this.$router.push("/profile");
        });
        return;
      }
      this.$router.push({
        path: '/payment/details',
        query: { plan: planCode }
      });
    }
  }
}
</script>

<style scoped>
.payment-wall {
  background:
    radial-gradient(circle at top left, rgba(16, 24, 40, 0.12), transparent 50%),
    radial-gradient(circle at top right, rgba(184, 134, 11, 0.12), transparent 48%),
    linear-gradient(180deg, #f7f7fb 0%, #ffffff 100%);
}

.hero h2 {
  font-family: "Poppins", system-ui, sans-serif;
  color: #0b1020;
}

.hero .eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  color: #1f2a44;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.value-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.value-pill {
  padding: 8px 16px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  color: #1f2937;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
}

.comparison-card {
  max-width: 920px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.comparison-header {
  padding: 18px 20px 12px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.06) 0%, rgba(255, 255, 255, 0) 100%);
}

.comparison-table th {
  font-size: 0.85rem;
  color: #334155;
  padding: 14px 20px;
}

.comparison-table td {
  padding: 12px 20px;
}

.comparison-table thead tr {
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.comparison-table tbody tr + tr {
  border-top: 1px solid rgba(15, 23, 42, 0.06);
}

.comparison-table tfoot tr {
  border-top: 1px solid rgba(15, 23, 42, 0.10);
}

.comparison-cta-row td {
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.02);
}

.comparison-cta-spacer {
  background: rgba(15, 23, 42, 0.02);
}

.comparison-cta-btn {
  border-radius: 14px;
  padding: 12px 14px;
}

.feature-col {
  width: 58%;
}

.tier-col {
  width: 21%;
}

.feature-name {
  font-weight: 650;
  color: #0b1020;
}

.tier-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  color: #0b1020;
}

.tier-cell i {
  color: #1d4ed8;
}

.tier-cell.excluded {
  color: #94a3b8;
}

.tier-cell.excluded i {
  color: #94a3b8;
}

.tier-value {
  font-weight: 650;
  color: inherit;
}

.choose-card {
  max-width: 920px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.choose-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.choose-header-left {
  display: grid;
  gap: 6px;
}

.back-link {
  text-decoration: none;
  color: #475569;
  font-weight: 700;
}

.back-link:hover {
  color: #0b1020;
}

.choose-amount {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0b1020;
  line-height: 1.1;
}

.choose-controls {
  padding: 18px 20px;
  display: grid;
  gap: 14px;
}

.choose-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.choose-cta {
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 800;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 6px;
}

.plan-card {
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: #ffffff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  position: relative;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.12);
}

.plan-ribbon {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  background: #0b1020;
  color: #fff;
}

.plan-card--standard.plan-card--annual {
  border-color: rgba(37, 99, 235, 0.35);
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.06) 0%, #ffffff 70%);
}

.plan-card--pro.plan-card--annual {
  border-color: rgba(184, 134, 11, 0.35);
  background: linear-gradient(180deg, rgba(184, 134, 11, 0.08) 0%, #ffffff 70%);
}

.plan-card-top {
  display: grid;
  gap: 8px;
}

.plan-card-title {
  font-family: "Poppins", system-ui, sans-serif;
  color: #0b1020;
  margin: 0;
}

.plan-card-subtext {
  color: #0b1020;
}

.plan-card-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-right: 84px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(15, 23, 42, 0.04);
  color: #0b1020;
}

.pill-monthly {
  background: rgba(148, 163, 184, 0.18);
  border-color: rgba(148, 163, 184, 0.28);
}

.pill-annual {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.25);
  color: #0f5132;
}

.pill-value {
  background: rgba(16, 185, 129, 0.10);
  border-color: rgba(16, 185, 129, 0.22);
  color: #065f46;
}

.pill-value-num {
  font-weight: 900;
}

.plan-card-bottom {
  display: grid;
  gap: 12px;
}

.plan-card-note {
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.btn-dark {
  background: #0b1020;
  border-color: #0b1020;
}

.btn-dark:hover {
  background: #1f2937;
  border-color: #1f2937;
}

@media (max-width: 768px) {
  .comparison-table th,
  .comparison-table td {
    padding: 12px 14px;
  }
  .comparison-cta-row td {
    padding: 12px 14px;
  }
  .choose-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .choose-price {
    text-align: left !important;
  }
  .plan-grid {
    grid-template-columns: 1fr;
  }
}
</style>
