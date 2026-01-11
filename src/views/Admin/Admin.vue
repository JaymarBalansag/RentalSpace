<template>
  <div class="overview-container">
    <div class="row mb-4">
      <div class="col-12">
        <h3 class="fw-bold text-dark">System Overview</h3>
        <p class="text-muted">Welcome back, Admin. Here's what's happening today.</p>
      </div>
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
            <h6 class="fw-bold mb-0">Recent Activity</h6>
          </div>
          <div class="card-body">
            <div class="activity-timeline">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-dot" :class="activity.type"></div>
                <div class="activity-content">
                  <p class="mb-0 small"><strong>{{ activity.user }}</strong> {{ activity.action }}</p>
                  <span class="text-muted extra-small">{{ activity.time }}</span>
                </div>
              </div>
            </div>
            <button class="btn btn-light btn-sm w-100 mt-3 text-primary">View All Logs</button>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminOverview",
  data() {
    return {
      stats: [
        { label: "Total Revenue", value: "₱128,430", icon: "bi bi-wallet2", colorClass: "blue", trend: 12 },
        { label: "Active Properties", value: "42", icon: "bi bi-house-door", colorClass: "green", trend: 5 },
        { label: "Total Users", value: "1,240", icon: "bi bi-people", colorClass: "purple", trend: -2 },
        { label: "New Bookings", value: "+18", icon: "bi bi-calendar-check", colorClass: "orange", trend: 8 },
      ],
      recentActivities: [
        { id: 1, user: "John Doe", action: "listed a new property", time: "2 mins ago", type: "green" },
        { id: 2, user: "Admin", action: "approved payment #8821", time: "1 hour ago", type: "blue" },
        { id: 3, user: "Maria S.", action: "reported an issue", time: "3 hours ago", type: "red" },
      ],
      pendingProperties: [
        { id: 1, name: "Sunset Villa", owner: "Kurt Destriza" },
        { id: 2, name: "City Loft", owner: "Marilou B." },
        { id: 3, name: "Garden Apartment", owner: "James B." },
      ]
    };
  }
};
</script>

<style scoped>
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

/* Timeline Activity */
.activity-timeline { position: relative; padding-left: 20px; }
.activity-timeline::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #f1f3f5;
}

.activity-item { position: relative; padding-bottom: 20px; }
.activity-dot {
  position: absolute;
  left: -20px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #adb5bd;
  border: 2px solid #fff;
  z-index: 1;
}

.activity-dot.green { background: #40c057; }
.activity-dot.blue { background: #228be6; }
.activity-dot.red { background: #fa5252; }

.extra-small { font-size: 0.7rem; }
.prop-img-sm { width: 32px; height: 32px; flex-shrink: 0; }
</style>