<template>
  <div class="p-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-0">👥 Tenant Management</h4>
        <p class="text-muted small">Manage resident status and occupancy details</p>
      </div>
      <button class="btn btn-outline-primary btn-sm">
        <i class="bi bi-person-x me-1"></i> Show Inactive Tenants
      </button>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-4">
            <label class="small fw-bold text-muted">Property Filter</label>
            <select class="form-select" v-model="selectedProperty">
              <option :value="0">All Properties</option>
              <option v-for="property in properties" :key="property.id" :value="property.id">
                {{ property.title }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="small fw-bold text-muted">Search</label>
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Search by name or email..." v-model="searchQuery" />
              <button v-if="searchQuery" class="btn btn-outline-secondary" @click="clearSearch">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-3">Name</th>
              <th>Property</th>
              <th>Email</th>
              <th>Status</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tenant in filteredTenants" :key="tenant.id">
              <td class="ps-3 fw-medium">{{ tenant.first_name }} {{ tenant.last_name }}</td>
              <td>{{ tenant.property_title }}</td>
              <td class="text-muted small">{{ tenant.tenant_email }}</td>
              <td>
                <span :class="['badge rounded-pill', statusClass(tenant.status)]">
                  {{ tenant.status }}
                </span>
              </td>
              <td class="text-center">
                <button 
                  v-if="tenant.status === 'inactive'" 
                  class="btn btn-sm btn-success px-3 shadow-sm"
                  @click="processMoveIn(tenant)"
                >
                  <i class="bi bi-door-open-fill me-1"></i> Move In
                </button>
                <span v-else class="text-muted small">-</span>
              </td>
            </tr>
            <tr v-if="filteredTenants.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">No tenants found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getTenantsByProperty, getTenantsList, moveIn } from '@/api/Owner/tenants';
import { getOwnerProperties } from '@/api/property';
import axios from 'axios'; // For the update calls

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