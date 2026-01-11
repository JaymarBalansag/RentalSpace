<template>
  <div class="admin-view-container p-3 p-md-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold text-dark mb-1">Owner Management</h3>
        <p class="text-muted small mb-0">View and manage all registered property owners.</p>
      </div>
      <button class="btn btn-primary px-4 shadow-sm">
        <i class="bi bi-download me-2"></i>Export CSV
      </button>
    </div>

    <div class="card shadow-sm border-0 mb-4 p-2">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6 col-lg-7">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input
                v-model="search"
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Search by name or email..."
              />
            </div>
          </div>
          <div class="col-md-3 col-lg-3">
            <select v-model="filterStatus" class="form-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="col-md-3 col-lg-2">
            <button class="btn btn-outline-secondary w-100" @click="resetFilter">
              <i class="bi bi-arrow-clockwise me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="data-card shadow-sm border-0">
      <div class="card-header bg-white py-3 border-bottom border-light d-flex justify-content-between align-items-center">
        <span class="fw-bold">All Owners</span>
        <span class="badge bg-light text-dark border">{{ filteredOwners.length }} Total</span>
      </div>

      <div class="table-responsive d-none d-lg-block">
        <table class="table align-middle custom-admin-table mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Properties</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th class="text-end px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredOwners.length > 0">
              <tr v-for="owner in filteredOwners" :key="owner.id">
                <td class="text-muted small fw-bold">#{{ owner.id }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">{{ owner.first_name[0] }}{{ owner.last_name[0] }}</div>
                    <span class="fw-semibold">{{ owner.first_name }} {{ owner.last_name }}</span>
                  </div>
                </td>
                <td class="small">{{ owner.email }}</td>
                <td><span class="property-tag">Coming Soon</span></td>
                <td class="text-muted small">{{ owner.created_at }}</td>
                <td>
                  <span class="badge-modern" :class="owner.status.toLowerCase()">
                    {{ owner.status }}
                  </span>
                </td>
                <td class="text-end px-4">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn-action view" title="View Profile"><i class="bi bi-eye"></i></button>
                    <button 
                      class="btn-action" 
                      :class="owner.status.toLowerCase() === 'active' ? 'reject' : 'approve'"
                      :title="owner.status.toLowerCase() === 'active' ? 'Deactivate' : 'Activate'"
                    >
                      <i :class="owner.status.toLowerCase() === 'active' ? 'bi bi-person-x' : 'bi bi-person-check'"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="7" class="text-center py-5">
                <i class="bi bi-people fs-1 text-muted opacity-25"></i>
                <p class="text-muted mt-2">No owners found matching your criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-lg-none p-3">
        <div v-if="filteredOwners.length > 0">
          <div v-for="owner in filteredOwners" :key="owner.id" class="mobile-owner-card mb-3 p-3 border rounded shadow-sm">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="d-flex align-items-center">
                <div class="avatar-circle me-2">{{ owner.first_name[0] }}{{ owner.last_name[0] }}</div>
                <div>
                  <h6 class="fw-bold mb-0">{{ owner.first_name }} {{ owner.last_name }}</h6>
                  <small class="text-muted">{{ owner.email }}</small>
                </div>
              </div>
              <span class="badge-modern" :class="owner.status.toLowerCase()">{{ owner.status }}</span>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <small class="text-muted">Joined: {{ owner.created_at }}</small>
              <div class="d-flex gap-2">
                <button class="btn-mobile-icon view"><i class="bi bi-eye"></i></button>
                <button class="btn-mobile-icon" :class="owner.status.toLowerCase() === 'active' ? 'reject' : 'approve'">
                  <i :class="owner.status.toLowerCase() === 'active' ? 'bi bi-person-x' : 'bi bi-person-check'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5">
           <p class="text-muted">No owners found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOwner } from '@/api/Admin/AdminOwner/AdminOwner';

export default {
  name: "ownerList",
  data() {
    return {
      search: "",
      filterStatus: "",
      owners: [],
      hasOwners: null
    };
  },
  computed: {
    filteredOwners() {
      return this.owners.filter((owner) => {
        const fullName = `${owner.first_name} ${owner.last_name}`.toLowerCase();
        const matchSearch =
          fullName.includes(this.search.toLowerCase()) ||
          owner.email.toLowerCase().includes(this.search.toLowerCase());

        const matchStatus =
          this.filterStatus === "" ||
          owner.status.toLowerCase() === this.filterStatus.toLowerCase();

        return matchSearch && matchStatus;
      });
    },
  },
  methods: {
    resetFilter() {
      this.search = "";
      this.filterStatus = "";
    },
    async fetchOwners() {
      try {
        const res = await getOwner();
        if(res && res.data){
          this.owners = res.data.data;
          this.hasOwners = true;
        } else {
          this.owners = [];
          this.hasOwners = false;
        }
      } catch (error) {
        console.error("Error fetching owners:", error);
        this.owners = [];
      }
    }
  },
  mounted() {
    this.fetchOwners();
  }
};
</script>

<style scoped>
.admin-view-container { background-color: #f8f9fa; min-height: 100vh; }
.data-card { background: white; border-radius: 12px; overflow: hidden; }

/* Desktop Table Styling */
.custom-admin-table thead th {
  background-color: #f1f4f9;
  border: none;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #5c677d;
  padding: 15px;
  font-weight: 700;
}
.custom-admin-table tbody td { padding: 15px; border-bottom: 1px solid #f1f4f9; }

/* Status Badges */
.badge-modern {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.badge-modern.active { background: #e6fcf5; color: #0ca678; }
.badge-modern.inactive { background: #f1f3f5; color: #495057; }

/* Action Buttons */
.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-action.view { background: #e7f5ff; color: #228be6; }
.btn-action.approve { background: #ebfbee; color: #40c057; }
.btn-action.reject { background: #fff5f5; color: #fa5252; }
.btn-action:hover { transform: translateY(-2px); filter: brightness(0.95); }

/* Mobile View Styles */
.mobile-owner-card { background: white; }
.btn-mobile-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-mobile-icon.view { background: #e7f5ff; color: #228be6; }
.btn-mobile-icon.approve { background: #198754; color: white; }
.btn-mobile-icon.reject { background: #dc3545; color: white; }

/* Avatar & Tags */
.avatar-circle {
  width: 35px;
  height: 35px;
  background: #6c757d;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}
.property-tag {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #6c757d;
}
</style>