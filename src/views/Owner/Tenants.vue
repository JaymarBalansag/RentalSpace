<template>
  <div class="p-2 p-md-3">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h4 class="fw-bold mb-0 text-dark">👥 Tenant Management</h4>
        <p class="text-muted small mb-0">Manage resident status and occupancy details</p>
      </div>
      <button class="btn btn-outline-primary btn-sm rounded-pill px-3 py-2">
        <i class="bi bi-person-x me-1"></i> Show Inactive Tenants
      </button>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-3">
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <label class="small fw-bold text-muted mb-1 text-uppercase">Property Filter</label>
            <select class="form-select border-light-subtle shadow-sm" v-model="selectedProperty">
              <option :value="0">All Properties</option>
              <option v-for="property in properties" :key="property.id" :value="property.id">
                {{ property.title }}
              </option>
            </select>
          </div>
          <div class="col-12 col-md-8">
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
  </div>
</template>

<script>
import { getTenantsByProperty, getTenantsList, moveIn } from '@/api/Owner/tenants';
import { getOwnerProperties } from '@/api/property';

export default {
  data() {
    return {
      selectedProperty: 0,
      tenants: [],
      searchQuery: '',
      properties: []
    };
  },
  computed: {
    // Improved search: Checks both first and last name
    filteredTenants() {
      const query = this.searchQuery.toLowerCase();
      return this.tenants.filter(t => 
        t.first_name.toLowerCase().includes(query) || 
        t.last_name.toLowerCase().includes(query) ||
        t.tenant_email.toLowerCase().includes(query)
      );
    }
  },
  mounted() {
    this.getPropertyType();
    this.getTenants();
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
    }
  },
  watch: {
    selectedProperty() {
      this.getTenants();
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
</style>
