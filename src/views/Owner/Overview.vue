<template>
  <div class="container-fluid p-0 overview-shell">
    <div class="mb-4 overview-header">
      <h4 class="fw-bold text-dark mb-1">Dashboard Overview</h4>
      <p class="text-muted small">Welcome back. Here is what is happening with your properties today.</p>
    </div>

    <div class="row g-3 g-md-4">
      <div class="col-12 col-sm-6 col-xl-3" v-for="(item, index) in overviewItems" :key="index">
        <div class="card h-100 border-0 stat-card glass-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-3 kpi-meta">
              <div :class="`icon-box bg-${item.color}-subtle text-${item.color}`">
                <i :class="`bi bi-${item.icon} fs-4`"></i>
              </div>
              <span class="badge rounded-pill badge-soft small fw-semibold">Live</span>
            </div>

            <div>
              <h6 class="text-muted small text-uppercase fw-bold mb-1">{{ item.title }}</h6>
              <h2 class="fw-bold mb-3 kpi-value">{{ item.count }}</h2>
            </div>

            <RouterLink
              :to="item.link"
              class="btn btn-link p-0 text-decoration-none stretched-link fw-semibold small kpi-link"
              :class="`text-${item.color}`"
            >
              View Details <i class="bi bi-arrow-right ms-1"></i>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4 g-3 g-md-4">
      <div v-if="!isMonthlyPlan" class="col-12 col-lg-7">
        <div class="card border-0 glass-card activity-card h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 class="fw-bold mb-1">Recent Activity</h6>
                <p class="text-muted small mb-0">Quick snapshot based on your current data.</p>
              </div>
              <span class="badge rounded-pill badge-soft">Today</span>
            </div>
            <ul class="activity-list mb-0">
              <li v-for="(item, idx) in activityItems" :key="`activity-${idx}`">
                <i class="bi bi-dot"></i>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="card border-0 glass-card quick-actions h-100">
          <div class="card-body p-4">
            <h6 class="fw-bold mb-2">Quick Actions</h6>
            <p class="text-muted small mb-3">Jump to the tasks you do most often.</p>
            <div class="d-flex flex-column gap-2">
              <RouterLink to="/dashboard/properties/add" class="btn btn-primary fw-semibold">Add Property</RouterLink>
              <RouterLink to="/properties" class="btn btn-outline-primary fw-semibold">View Reviews</RouterLink>
              <RouterLink v-if="!isMonthlyPlan" to="/bookings" class="btn btn-outline-primary fw-semibold">View Bookings</RouterLink>
              <RouterLink v-if="!isMonthlyPlan" to="/ledger" class="btn btn-outline-dark fw-semibold">Go to Ledger</RouterLink>
              <RouterLink v-if="!isMonthlyPlan" to="/tenants?tab=moveout" class="btn btn-outline-secondary fw-semibold">Move-Out Notices</RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isMonthlyPlan" class="col-12">
        <div class="card border-0 glass-card banner-card p-4">
          <div class="d-flex align-items-center flex-wrap gap-3">
            <div class="me-3">
              <i class="bi bi-lightning-charge-fill display-6"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-1">Need to collect rent?</h5>
              <p class="mb-0 opacity-75 small">You have {{ summary.pending_payments_count }} pending payment proof(s) for review.</p>
            </div>
            <RouterLink to="/ledger" class="btn btn-light ms-lg-auto fw-bold px-4">Go to Ledger</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOwnerDashboardSummary } from '@/api/billings';
import { getOwnerProperties } from "@/api/property";
import { useUserInfo } from "@/store/userInfo";

export default {
  data() {
    return {
      summary: {
        properties_count: 0,
        active_tenants_count: 0,
        pending_bookings_count: 0,
        pending_payments_count: 0,
        monthly_verified_total: 0,
        reviews_count: 0,
      },
      activityItems: [
        "Loading your latest activity.",
      ],
      overviewItems: [
        { title: 'Properties', count: 0, link: '/properties', icon: 'house-door-fill', color: 'primary' },
        { title: 'Tenants', count: 0, link: '/tenants', icon: 'people-fill', color: 'info' },
        { title: 'Monthly Verified', count: 'PHP 0', link: '/ledger', icon: 'wallet2', color: 'success' },
        { title: 'Pending Bookings', count: 0, link: '/bookings', icon: 'bar-chart-line-fill', color: 'warning' },
      ],
    };
  },
  async mounted() {
    await this.loadSummary();
  },
  computed: {
    subscription() {
      return useUserInfo().subscription || null;
    },
    isMonthlyPlan() {
      return String(this.subscription?.billing_cycle || "").toLowerCase() === "monthly";
    },
  },
  methods: {
    async loadSummary() {
      try {
        const res = await getOwnerDashboardSummary();
        this.summary = res?.data?.data || this.summary;
        await this.loadReviewCount();
        if (this.isMonthlyPlan) {
          this.overviewItems = [
            { title: 'Properties', count: this.summary.properties_count, link: '/properties', icon: 'house-door-fill', color: 'primary' },
            { title: 'Reviews', count: this.summary.reviews_count, link: '/properties', icon: 'chat-left-text-fill', color: 'warning' },
          ];
        } else {
          this.overviewItems = [
            { title: 'Properties', count: this.summary.properties_count, link: '/properties', icon: 'house-door-fill', color: 'primary' },
            { title: 'Tenants', count: this.summary.active_tenants_count, link: '/tenants', icon: 'people-fill', color: 'info' },
            { title: 'Monthly Verified', count: `PHP ${Number(this.summary.monthly_verified_total || 0).toLocaleString()}`, link: '/ledger', icon: 'wallet2', color: 'success' },
            { title: 'Pending Bookings', count: this.summary.pending_bookings_count, link: '/bookings', icon: 'bar-chart-line-fill', color: 'warning' },
            { title: 'Reviews', count: this.summary.reviews_count, link: '/properties', icon: 'chat-left-text-fill', color: 'primary' },
          ];
        }
        if (!this.isMonthlyPlan) {
          this.activityItems = [
            `${this.summary.pending_bookings_count} pending booking request(s)`,
            `${this.summary.pending_payments_count} pending payment proof(s) for review`,
            `${this.summary.active_tenants_count} active tenant(s) across your listings`,
            `${this.summary.properties_count} total properties listed`,
          ];
        }
      } catch (error) {
        console.error("Failed to load owner summary:", error);
        this.activityItems = [
          "Unable to load activity right now.",
          "Check your connection or try again later.",
        ];
      }
    },
    async loadReviewCount() {
      try {
        const response = await getOwnerProperties();
        const properties = response?.data?.properties || [];
        const total = properties.reduce((sum, property) => {
          const value = Number(property?.total_reviews ?? property?.review_count ?? 0);
          return sum + (Number.isFinite(value) ? value : 0);
        }, 0);
        this.summary.reviews_count = total;
      } catch (error) {
        console.warn("Failed to load review count:", error);
        this.summary.reviews_count = 0;
      }
    },
  },
};
</script>

<style scoped>
.overview-shell {
  color: #0f172a;
}
.overview-header h4 {
  letter-spacing: 0.2px;
}
.glass-card {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
}
.stat-card {
  transition: all 0.3s ease;
  border-radius: 1rem;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12) !important;
}

.icon-box {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.kpi-value {
  font-size: 1.9rem;
}
.badge-soft {
  background: rgba(15, 23, 42, 0.06);
  color: #1f2937;
  border: 1px solid rgba(15, 23, 42, 0.08);
}
.kpi-link {
  position: relative;
  z-index: 2;
}
.activity-card .activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.65rem;
}
.activity-card .activity-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #334155;
  font-size: 0.95rem;
}
.activity-card .activity-list i {
  color: #2b6af3;
  font-size: 1.25rem;
}
.quick-actions .btn {
  border-radius: 12px;
  padding: 0.65rem 1rem;
}
.banner-card {
  background: linear-gradient(120deg, rgba(43, 106, 243, 0.95), rgba(45, 212, 191, 0.9));
  color: #fff;
}

.stretched-link::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  content: "";
}

.bg-primary-subtle { background-color: #e7f1ff; }
.bg-success-subtle { background-color: #e6fcf5; }
.bg-info-subtle { background-color: #e7f5ff; }
.bg-warning-subtle { background-color: #fff9db; }

@media (prefers-reduced-motion: reduce) {
  .stat-card {
    transition: none !important;
  }
}
</style>
