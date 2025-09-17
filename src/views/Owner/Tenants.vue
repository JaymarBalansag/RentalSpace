<template>
  <div>
    <h4 class="mb-3">👥 Tenants</h4>
    <div class="d-flex justify-content-between mb-3">
      <div class="d-flex gap-2">
        <input type="text" class="form-control" placeholder="Search Tenant..." v-model="searchQuery" />
        <button class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
      </div>
      <button class="btn btn-primary">Add Tenant</button>
    </div>

    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Property</th>
          <th>Contact</th>
          <th>Rent Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tenant in filteredTenants" :key="tenant.id" class="table-row-hover">
          <td>{{ tenant.name }}</td>
          <td>{{ tenant.property }}</td>
          <td>{{ tenant.contact }}</td>
          <td>
            <span :class="tenant.rent_status === 'Paid' ? 'badge bg-success' : 'badge bg-warning'">
              {{ tenant.rent_status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tenants: [
        { id: 1, name: 'Juan Dela Cruz', property: 'Boarding House A', contact: '09123456789', rent_status: 'Paid' },
        { id: 2, name: 'Maria Clara', property: 'Apartment B', contact: '09123456780', rent_status: 'Pending' },
      ],
      searchQuery: '',
    };
  },
  computed: {
    filteredTenants() {
      return this.tenants.filter(tenant => tenant.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
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
