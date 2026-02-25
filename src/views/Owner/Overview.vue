<template>
  <div class="container-fluid p-0">
    <div class="mb-4">
      <h4 class="fw-bold text-dark mb-1">Dashboard Overview</h4>
      <p class="text-muted small">Welcome back. Here is what is happening with your properties today.</p>
    </div>

    <div class="row g-3 g-md-4">
      <div class="col-12 col-sm-6 col-xl-3" v-for="(item, index) in overviewItems" :key="index">
        <div class="card h-100 border-0 shadow-sm stat-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div :class="`icon-box bg-${item.color}-subtle text-${item.color}`">
                <i :class="`bi bi-${item.icon} fs-4`"></i>
              </div>
              <span class="badge rounded-pill bg-light text-dark border small fw-normal">Live</span>
            </div>

            <div>
              <h6 class="text-muted small text-uppercase fw-bold mb-1">{{ item.title }}</h6>
              <h2 class="fw-bold mb-3">{{ item.count }}</h2>
            </div>

            <RouterLink
              :to="item.link"
              class="btn btn-link p-0 text-decoration-none stretched-link fw-semibold small"
              :class="`text-${item.color}`"
            >
              View Details <i class="bi bi-arrow-right ms-1"></i>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm bg-primary text-white p-4">
          <div class="d-flex align-items-center">
            <div class="me-3">
              <i class="bi bi-lightning-charge-fill display-6"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-1">Need to collect rent?</h5>
              <p class="mb-0 opacity-75 small">You have {{ summary.pending_payments_count }} pending payment proof(s) for review.</p>
            </div>
            <RouterLink to="/ledger" class="btn btn-light ms-auto fw-bold px-4">Go to Ledger</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOwnerDashboardSummary } from '@/api/billings';

export default {
  data() {
    return {
      summary: {
        properties_count: 0,
        active_tenants_count: 0,
        pending_bookings_count: 0,
        pending_payments_count: 0,
        monthly_verified_total: 0,
      },
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
  methods: {
    async loadSummary() {
      try {
        const res = await getOwnerDashboardSummary();
        this.summary = res?.data?.data || this.summary;
        this.overviewItems = [
          { title: 'Properties', count: this.summary.properties_count, link: '/properties', icon: 'house-door-fill', color: 'primary' },
          { title: 'Tenants', count: this.summary.active_tenants_count, link: '/tenants', icon: 'people-fill', color: 'info' },
          { title: 'Monthly Verified', count: `PHP ${Number(this.summary.monthly_verified_total || 0).toLocaleString()}`, link: '/ledger', icon: 'wallet2', color: 'success' },
          { title: 'Pending Bookings', count: this.summary.pending_bookings_count, link: '/bookings', icon: 'bar-chart-line-fill', color: 'warning' },
        ];
      } catch (error) {
        console.error("Failed to load owner summary:", error);
      }
    },
  },
};
</script>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
  border-radius: 1rem;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}

.icon-box {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
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
</style>
