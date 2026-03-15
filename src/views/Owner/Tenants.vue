<template>
  <div class="p-2 p-md-3">
    <div class="row g-3 mb-4">
      <div class="col-12 col-lg-8">
        <div class="mb-3">
          <h4 class="fw-bold mb-0 text-dark">👥 Tenant Management</h4>
          <p class="text-muted small mb-0">Manage resident status and occupancy details</p>
        </div>
        <div class="card border-0 shadow-sm">
          <div class="card-body p-3">
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <label class="small fw-bold text-muted mb-1 text-uppercase">Property</label>
                <select class="form-select border-light-subtle shadow-sm" v-model="selectedProperty">
                  <option :value="0">All Properties</option>
                  <option v-for="property in properties" :key="property.id" :value="property.id">
                    {{ property.title }}
                  </option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label class="small fw-bold text-muted mb-1 text-uppercase">Status</label>
                <select class="form-select border-light-subtle shadow-sm" v-model="statusFilter">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="col-12 col-md-4 d-flex align-items-end">
                <div class="form-check form-switch ms-md-2">
                  <input class="form-check-input" type="checkbox" id="moveOutToggle" v-model="moveOutRequested">
                  <label class="form-check-label small fw-bold text-muted text-uppercase" for="moveOutToggle">
                    Move-Out Requested
                  </label>
                </div>
              </div>
              <div class="col-12">
                <label class="small fw-bold text-muted mb-1 text-uppercase">Search Tenants</label>
                <div class="input-group shadow-sm">
                  <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                  <input type="text" class="form-control border-start-0 ps-0" placeholder="Name or email..." v-model="searchQuery" />
                  <button v-if="searchQuery" class="btn btn-white border border-start-0" @click="clearSearch">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm h-100" id="moveout">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold mb-0">Move-Out Notices</h6>
              <div class="d-flex align-items-center gap-2">
                <span class="badge rounded-pill bg-secondary-subtle text-secondary">{{ noticesTotal }}</span>
                <button class="btn btn-link btn-sm p-0 fw-semibold" @click="openNoticesModal" :disabled="noticesTotal === 0">
                  View all
                </button>
              </div>
            </div>
            <p class="text-muted small mb-3">Latest tenant move-out requests will appear here.</p>
            <div v-if="!latestNotice" class="text-center py-4 text-muted small">
              No notices yet.
            </div>
            <div v-else class="latest-notice border rounded-3 p-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">{{ latestNotice.first_name }} {{ latestNotice.last_name }}</div>
                  <small class="text-muted">{{ latestNotice.property_title }}</small>
                </div>
                <span class="badge rounded-pill" :class="noticeStatusClass(latestNotice.status)">
                  {{ (latestNotice.status || 'pending').toUpperCase() }}
                </span>
              </div>
              <small class="text-muted d-block mt-1">
                Submitted: {{ formatDate(latestNotice.created_at) }}
              </small>
              <small v-if="latestNotice.requested_move_out_date" class="text-muted d-block">
                Requested: {{ formatDate(latestNotice.requested_move_out_date) }}
              </small>
              <p v-if="latestNotice.message" class="small text-muted mb-0 mt-1">
                {{ latestNotice.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-none d-md-block card border-0 shadow-sm overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="ps-4 py-3">Tenant Details</th>
              <th>Property</th>
              <th>Status</th>
              <th class="text-center px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tenant in filteredTenants" :key="tenant.id">
              <td class="ps-4">
                <div class="fw-bold">{{ tenant.first_name }} {{ tenant.last_name }}</div>
                <div class="text-muted small">{{ tenant.tenant_email }}</div>
              </td>
              <td>{{ tenant.property_title }}</td>
              <td>
                <span :class="['badge rounded-pill px-3 py-2', statusClass(tenant.status)]">
                  {{ tenant.status }}
                </span>
              </td>
              <td class="text-center px-4">
                <button 
                  v-if="tenant.status === 'inactive'" 
                  class="btn btn-sm btn-success px-3 fw-bold shadow-sm"
                  @click="processMoveIn(tenant)"
                >
                  <i class="bi bi-door-open-fill me-1"></i> Move In
                </button>
                <span v-else class="text-muted small">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-md-none">
      <div v-if="filteredTenants.length === 0" class="text-center py-5">
        <p class="text-muted">No tenants found.</p>
      </div>
      
      <div v-for="tenant in filteredTenants" :key="tenant.id" class="card border-0 shadow-sm mb-3">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="d-flex align-items-center">
              <div class="avatar-circle me-2 bg-primary-subtle text-primary fw-bold">
                {{ tenant.first_name[0] }}{{ tenant.last_name[0] }}
              </div>
              <div>
                <h6 class="fw-bold mb-0 text-dark">{{ tenant.first_name }} {{ tenant.last_name }}</h6>
                <small class="text-muted">{{ tenant.tenant_email }}</small>
              </div>
            </div>
            <span :class="['badge rounded-pill px-2', statusClass(tenant.status)]" style="font-size: 0.7rem;">
              {{ tenant.status }}
            </span>
          </div>

          <div class="bg-light rounded p-2 mb-3">
            <small class="text-muted d-block extra-small text-uppercase fw-bold">Assigned Property</small>
            <span class="small fw-medium text-dark"><i class="bi bi-house me-1"></i>{{ tenant.property_title }}</span>
          </div>

          <button 
            v-if="tenant.status === 'inactive'" 
            class="btn btn-success w-100 py-2 fw-bold shadow-sm"
            @click="processMoveIn(tenant)"
          >
            <i class="bi bi-door-open-fill me-2"></i> Process Move-In
          </button>
          <button v-else class="btn btn-outline-secondary w-100 disabled py-2 small">
            Tenant is Active
          </button>
        </div>
      </div>
    </div>

    <div v-if="showNoticesModal" class="modal-backdrop-custom">
      <div class="modal-custom shadow-lg border-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Move-Out Notices</h5>
          <button class="btn-close" @click="closeNoticesModal"></button>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-bold text-muted">Status</label>
            <select class="form-select" v-model="noticeFilters.status">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="col-6 col-md-4">
            <label class="form-label small fw-bold text-muted">From</label>
            <input type="date" class="form-control" v-model="noticeFilters.dateFrom" />
          </div>
          <div class="col-6 col-md-4">
            <label class="form-label small fw-bold text-muted">To</label>
            <input type="date" class="form-control" v-model="noticeFilters.dateTo" />
          </div>
        </div>

        <div class="d-none d-md-block">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Requested</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredNotices.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">No notices found.</td>
                </tr>
                <tr v-for="notice in filteredNotices" :key="notice.id">
                  <td class="fw-semibold">{{ notice.first_name }} {{ notice.last_name }}</td>
                  <td>{{ notice.property_title }}</td>
                  <td>
                    <span class="badge rounded-pill" :class="noticeStatusClass(notice.status)">
                      {{ (notice.status || 'pending').toUpperCase() }}
                    </span>
                  </td>
                  <td>{{ formatDate(notice.created_at) }}</td>
                  <td>{{ formatDate(notice.requested_move_out_date) }}</td>
                  <td class="text-muted small">{{ notice.message || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="d-md-none">
          <div v-if="filteredNotices.length === 0" class="text-center text-muted py-4">
            No notices found.
          </div>
          <div v-for="notice in filteredNotices" :key="notice.id" class="card border-0 shadow-sm mb-2">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">{{ notice.first_name }} {{ notice.last_name }}</div>
                  <small class="text-muted">{{ notice.property_title }}</small>
                </div>
                <span class="badge rounded-pill" :class="noticeStatusClass(notice.status)">
                  {{ (notice.status || 'pending').toUpperCase() }}
                </span>
              </div>
              <small class="text-muted d-block mt-1">Submitted: {{ formatDate(notice.created_at) }}</small>
              <small class="text-muted d-block">Requested: {{ formatDate(notice.requested_move_out_date) }}</small>
              <p class="small text-muted mb-0 mt-1">{{ notice.message || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTenantsByProperty, getTenantsList, moveIn, getOwnerMoveOutNotices } from '@/api/Owner/tenants';
import { getOwnerProperties } from '@/api/property';

export default {
  data() {
    return {
      selectedProperty: 0,
      tenants: [],
      searchQuery: '',
      properties: [],
      statusFilter: '',
      moveOutRequested: false,
      moveOutNotices: [],
      noticesPage: 1,
      noticesLastPage: 1,
      noticesTotal: 0,
      showNoticesModal: false,
      noticeFilters: {
        status: "",
        dateFrom: "",
        dateTo: ""
      },
      allNotices: []
    };
  },
  computed: {
    // Improved search: Checks both first and last name
    filteredTenants() {
      const query = this.searchQuery.toLowerCase();
      return this.tenants.filter(t => {
        const matchesQuery =
          t.first_name.toLowerCase().includes(query) ||
          t.last_name.toLowerCase().includes(query) ||
          t.tenant_email.toLowerCase().includes(query);
        const matchesStatus = this.statusFilter
          ? String(t.status || '').toLowerCase() === this.statusFilter
          : true;
        return matchesQuery && matchesStatus;
      });
    },
    latestNotice() {
      if (!this.moveOutNotices.length) return null;
      const sorted = [...this.moveOutNotices].sort((a, b) => {
        const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
        if (aTime === bTime) return (b?.id || 0) - (a?.id || 0);
        return bTime - aTime;
      });
      return sorted[0] || null;
    },
    filteredNotices() {
      let records = this.allNotices;
      if (this.noticeFilters.status) {
        records = records.filter(r => String(r.status || '').toLowerCase() === this.noticeFilters.status);
      }
      if (this.noticeFilters.dateFrom) {
        const from = new Date(this.noticeFilters.dateFrom);
        records = records.filter(r => r.created_at && new Date(r.created_at) >= from);
      }
      if (this.noticeFilters.dateTo) {
        const to = new Date(this.noticeFilters.dateTo);
        records = records.filter(r => r.created_at && new Date(r.created_at) <= to);
      }
      return records.sort((a, b) => {
        const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
        if (aTime === bTime) return (b?.id || 0) - (a?.id || 0);
        return bTime - aTime;
      });
    }
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
    },
    statusClass(status) {
      if (status === 'active') return 'bg-success-subtle text-success border border-success';
      if (status === 'pending') return 'bg-warning-subtle text-warning-emphasis border border-warning';
      return 'bg-light text-dark border';
    },

    async processMoveIn(tenant) {
      if (confirm(`Are you sure you want to move in ${tenant.first_name}? This will also set their billing to unpaid.`)) {
        try {
          // Pass just the ID
          await moveIn(tenant.id); 
          
          // Refresh the list immediately to show the 'Active' badge
          await this.getTenants();
          
          alert("Tenant activated and initial bill set to unpaid!");
        } catch (error) {
          console.error("Move-in failed:", error);
          alert("Failed to process move-in. Please try again.");
        }
      }
    },

    async getPropertyType() {
      try {
        const response = await getOwnerProperties();
        this.properties = response.data.properties;
      } catch (error) {
        console.error(error);
      }
    },

    async getTenants() {
      try {
        const response = this.selectedProperty == 0 
          ? await getTenantsList() 
          : await getTenantsByProperty(this.selectedProperty);
        this.tenants = response.data.data;
      } catch (error) {
        console.error("Failed to fetch tenants", error);
      }
    },
    async getMoveOutNotices(page = 1) {
      try {
        const res = await getOwnerMoveOutNotices({ page, per_page: 5 });
        const incoming = res?.data?.data || [];
        this.moveOutNotices = incoming.sort((a, b) => {
          const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
          if (aTime === bTime) return (b?.id || 0) - (a?.id || 0);
          return bTime - aTime;
        });
        this.noticesPage = res?.data?.current_page || page;
        this.noticesLastPage = res?.data?.last_page || 1;
        this.noticesTotal = res?.data?.total || this.moveOutNotices.length;
      } catch (error) {
        console.warn("Failed to fetch move-out notices", error);
        this.moveOutNotices = [];
        this.noticesPage = 1;
        this.noticesLastPage = 1;
        this.noticesTotal = 0;
      }
    },
    async openNoticesModal() {
      this.showNoticesModal = true;
      if (this.allNotices.length === 0) {
        try {
          const res = await getOwnerMoveOutNotices({ page: 1, per_page: 1000 });
          this.allNotices = res?.data?.data || [];
        } catch (error) {
          console.warn("Failed to fetch all notices", error);
          this.allNotices = [];
        }
      }
    },
    closeNoticesModal() {
      this.showNoticesModal = false;
    },
    changeNoticesPage(page) {
      this.getMoveOutNotices(page);
    },
    noticeStatusClass(status) {
      const value = String(status || 'pending').toLowerCase();
      if (value === 'approved') return 'bg-success-subtle text-success';
      if (value === 'rejected') return 'bg-danger-subtle text-danger';
      if (value === 'acknowledged') return 'bg-info-subtle text-info';
      return 'bg-warning-subtle text-warning';
    },
    formatDate(date) {
      if (!date) return '-';
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return '-';
      return parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  },
  watch: {
    '$route.query.tab'(val) {
      if (val === 'moveout') {
        this.$nextTick(() => {
          const el = document.getElementById('moveout');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    },
    selectedProperty() {
      this.getTenants();
    }
  },
  mounted() {
    this.getPropertyType();
    this.getTenants();
    this.getMoveOutNotices(1);
    if (this.$route?.query?.tab === 'moveout') {
      this.$nextTick(() => {
        const el = document.getElementById('moveout');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
};
</script>

<style scoped>
.avatar-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}
.extra-small { font-size: 0.65rem; }
.form-select, .form-control {
  padding: 0.6rem 0.8rem;
}
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-custom {
  background: #fff;
  padding: 1.5rem;
  border-radius: 18px;
  width: 95%;
  max-width: 900px;
  max-height: 85vh;
  overflow: auto;
}
.latest-notice {
  background: rgba(15, 23, 42, 0.03);
}
</style>
