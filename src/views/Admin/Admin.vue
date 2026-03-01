<template>
  <div class="overview-container">
    <div class="hero-panel mb-4">
      <h3 class="fw-bold text-dark mb-1">System Overview</h3>
      <p class="text-muted mb-0">Welcome back, Admin. Here's what's happening today.</p>
    </div>

    <div class="row g-4 mb-4">
      <div v-for="stat in stats" :key="stat.label" class="col-xl-3 col-md-6">
        <div class="stat-card shadow-sm border-0 card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="stat-icon" :class="stat.colorClass">
                <i :class="stat.icon"></i>
              </div>
              <span :class="stat.trend >= 0 ? 'trend-up' : 'trend-down'">
                <i :class="stat.trend >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                {{ Math.abs(stat.trend) }}%
              </span>
            </div>
            <h3 class="fw-bold mb-1">{{ stat.value }}</h3>
            <p class="text-muted small mb-0">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white py-3">
            <h6 class="fw-bold mb-0">Admin Action Queue</h6>
          </div>
          <div class="card-body">
            <div class="d-flex flex-column gap-3">
              <div
                v-for="item in actionQueue"
                :key="item.id"
                class="queue-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <p class="mb-1 small fw-semibold text-dark">{{ item.label }}</p>
                  <div class="d-flex align-items-center gap-2">
                    <span :class="['badge rounded-pill', item.badgeClass]">{{ item.count }}</span>
                    <span class="text-muted extra-small">{{ item.waiting }}</span>
                  </div>
                </div>
                <RouterLink
                  v-if="item.route && !item.isStatic"
                  :to="item.route"
                  class="btn btn-light btn-sm text-primary border"
                >
                  Review
                </RouterLink>
                <button v-else class="btn btn-light btn-sm text-secondary border" disabled>Soon</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0">Pending Approvals</h6>
            <RouterLink to="/admin/properties" class="btn btn-link btn-sm text-decoration-none p-0">Manage All</RouterLink>
          </div>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="bg-light">
                <tr class="small text-uppercase text-muted">
                  <th class="ps-4">Property</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th class="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pendingProperties" :key="p.id">
                  <td class="ps-4">
                    <div class="d-flex align-items-center">
                      <div class="prop-img-sm me-2 bg-secondary-subtle rounded"></div>
                      <span class="fw-semibold small">{{ p.name }}</span>
                    </div>
                  </td>
                  <td class="small">{{ p.owner }}</td>
                  <td><span class="badge rounded-pill bg-warning-subtle text-warning border border-warning-subtle">Pending</span></td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary py-0 px-2"><i class="bi bi-check2"></i></button>
                  </td>
                </tr>
                <tr v-if="!pendingProperties.length">
                  <td colspan="4" class="text-center text-muted small py-4">No pending approvals.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAdminOverview } from "@/api/Admin/AdminDashboard/AdminDashboard";

export default {
  name: "AdminOverview",
  data() {
    return {
      loading: false,
      stats: [
        { label: "Active Properties", value: "0", icon: "bi bi-house-door", colorClass: "green", trend: 0 },
        { label: "Total Users", value: "0", icon: "bi bi-people", colorClass: "purple", trend: 0 },
        { label: "Pending Approvals", value: "0", icon: "bi bi-hourglass-split", colorClass: "orange", trend: 0 },
        { label: "Collections This Month", value: "P 0", icon: "bi bi-wallet2", colorClass: "blue", trend: 0 },
      ],
      actionQueue: [],
      pendingProperties: []
    };
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat("en-PH").format(Number(value) || 0);
    },
    mapBadgeClass(label, isStatic = false) {
      if (isStatic) {
        return "bg-secondary-subtle text-secondary border border-secondary-subtle";
      }

      const normalized = String(label || "").toLowerCase();
      if (normalized.includes("property")) {
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
      }
      if (normalized.includes("owner")) {
        return "bg-info-subtle text-info border border-info-subtle";
      }
      if (normalized.includes("payment")) {
        return "bg-primary-subtle text-primary border border-primary-subtle";
      }
      return "bg-secondary-subtle text-secondary border border-secondary-subtle";
    },
    async loadOverview() {
      this.loading = true;
      try {
        const res = await getAdminOverview();
        const payload = res?.data?.data || {};
        const stats = payload?.stats || {};
        const queue = Array.isArray(payload?.action_queue) ? payload.action_queue : [];
        const pending = Array.isArray(payload?.pending_properties) ? payload.pending_properties : [];

        this.stats = [
          { label: "Active Properties", value: this.formatNumber(stats.active_properties), icon: "bi bi-house-door", colorClass: "green", trend: 0 },
          { label: "Total Users", value: this.formatNumber(stats.total_users), icon: "bi bi-people", colorClass: "purple", trend: 0 },
          { label: "Pending Approvals", value: this.formatNumber(stats.pending_approvals), icon: "bi bi-hourglass-split", colorClass: "orange", trend: 0 },
          { label: "Collections This Month", value: `P ${this.formatNumber(stats.collections_this_month)}`, icon: "bi bi-wallet2", colorClass: "blue", trend: 0 },
        ];

        this.actionQueue = queue.map((item, index) => ({
          id: item.id || `queue-${index}`,
          label: item.label || "Queue item",
          count: item.count === null || item.count === undefined ? "Static" : item.count,
          waiting: item.waiting || "-",
          route: item.route || null,
          isStatic: !!item.is_static,
          badgeClass: this.mapBadgeClass(item.label, !!item.is_static),
        }));

        this.pendingProperties = pending;
      } catch (error) {
        console.error("Failed to load admin overview:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.loadOverview();
  }
};
</script>

<style scoped>
.overview-container {
  min-height: 100vh;
  background:
    radial-gradient(circle at 0 0, rgba(226, 240, 255, 0.65), transparent 40%),
    radial-gradient(circle at 100% 0, rgba(255, 245, 230, 0.45), transparent 35%),
    #f6f8fc;
}

.hero-panel {
  padding: 1rem 1.2rem;
  border-radius: 14px;
  border: 1px solid #e3e9f3;
  background: rgba(255, 255, 255, 0.9);
}

/* Stat Cards */
.stat-card { border-radius: 16px; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-5px); }

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.stat-icon.blue { background: #e7f5ff; color: #228be6; }
.stat-icon.green { background: #ebfbee; color: #40c057; }
.stat-icon.purple { background: #f3f0ff; color: #7950f2; }
.stat-icon.orange { background: #fff4e6; color: #fd7e14; }

.trend-up { color: #40c057; font-size: 0.85rem; font-weight: 600; }
.trend-down { color: #fa5252; font-size: 0.85rem; font-weight: 600; }

.queue-item {
  border: 1px solid #eef2f7;
  border-radius: 10px;
  padding: 0.75rem;
  background: #fff;
}

.extra-small { font-size: 0.7rem; }
.prop-img-sm { width: 32px; height: 32px; flex-shrink: 0; }
</style>
