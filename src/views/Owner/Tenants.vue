<template>
  <div>
    <h4 class="mb-3">👥 Tenants</h4>
    <div class="d-flex justify-content-between mb-3">
      <div class="d-flex gap-2">
        <select class="form-select" aria-label="Default select example" v-model="selectedProperty">
          <option value="0">All</option>
          <option v-for="property in properties" :key="property.id" :value="property.id">{{ property.title }}</option>
        </select>
        <input type="text" class="form-control" placeholder="Search Tenant..." v-model="searchQuery" />
        <button class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
      </div>
      <button class="btn btn-primary">Show Inactive Tenant</button>
    </div>

    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Property</th>
          <th>Email</th>
          <th>Rent Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tenant in tenants" :key="tenant.id" class="table-row-hover">
          <td>{{ tenant.first_name }} {{ tenant.last_name }}</td>
          <td>{{ tenant.property_title }}</td>
          <td>{{ tenant.tenant_email }}</td>
          <td>
            <span :class="tenant.rent_status === 'active' ? 'badge bg-warning' : 'badge bg-success'">
              {{ tenant.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getTenantsByProperty, getTenantsList } from '@/api/Owner/tenants';
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
    filteredTenants() {
      return this.tenants.filter(tenant => tenant.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
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

    async getPropertyType(){
      try {
        const response = await getOwnerProperties();
        this.properties = response.data.properties;
      } catch (error) {
        console.error(error);
      }
    },

    // Gets the tenants based on property type selected

    async getTenants() {
      switch (Number(this.selectedProperty)) {
        case 0:
          // console.log(this.selectedProperty);
          const response = await getTenantsList();
          this.tenants = response.data.data;

          break;
        default:
          // console.log(this.selectedProperty);
          const res = await getTenantsByProperty(this.selectedProperty);
          this.tenants = res.data.data;

          break;
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
.table-row-hover:hover {
  background-color: #f1f1f1;
}

.table th, .table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.875rem;
}

.btn-outline-secondary {
  font-size: 0.9rem;
}
</style>
