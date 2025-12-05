<template>
  <div>
    <h4 class="mb-3"><span class="bi bi-book"></span> Bookings</h4>
    <div class="d-flex justify-content-between mb-3">
      <div class="d-flex gap-2">
        <input type="text" class="form-control" placeholder="Search Tenant..." v-model="searchQuery" />
        <button class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
      </div>
    </div>

    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Property</th>
          <th>Booking Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id" class="table-row-hover">
          <td>{{ booking.first_name }} {{ booking.last_name }}</td>
          <td>{{ booking.title }}</td>
          <td>
            
            <span class="text-dark rounded-pill text-center bg-warning p-1">{{ booking.status }}</span>
          </td>
          <td class="d-flex gap-2">
            <button class="btn btn-primary"><span class="bi bi-eye"></span></button>
            <button class="btn btn-success"><span class="bi bi-check"></span></button>
            <button class="btn btn-danger"><span class="bi bi-trash"></span></button>
            <button class="btn btn-primary"><span class="bi bi-chat"></span></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import {getPendingUserBookings} from '@/api/Owner/bookings';

export default {
  data() {
    return {
      bookings: [],
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
    },

    // Get PEnding Bookings
    async fetchPendingBookings() {
      try {
        const response = await getPendingUserBookings();
        this.bookings = response.data.data; 
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      }
    }

  },
  mounted() {
    this.fetchPendingBookings();
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
