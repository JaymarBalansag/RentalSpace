<template>
  <Header />

  <div class="container py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h4 class="fw-bold mb-1">My Bookings</h4>
        <p class="text-muted small mb-0">Track your booking requests and owner decisions.</p>
      </div>
      <div class="d-flex gap-2">
        <select v-model="selectedStatus" class="form-select" @change="fetchMyBookings" style="min-width: 180px;">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <div class="card border-0 shadow-sm d-none d-md-block">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="bg-light">
            <tr class="small text-uppercase text-muted">
              <th class="ps-4">Property</th>
              <th>Owner</th>
              <th>Move-in</th>
              <th>Status</th>
              <th class="pe-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
              <td class="ps-4">
                <div class="fw-semibold">{{ booking.title }}</div>
                <small class="text-muted">{{ booking.type_name || '-' }}</small>
              </td>
              <td>{{ booking.owner_name || '-' }}</td>
              <td>{{ formatDate(booking.move_in_date) }}</td>
              <td>
                <span class="badge rounded-pill px-3 py-2" :class="statusClass(booking.status)">
                  {{ booking.status }}
                </span>
              </td>
              <td class="pe-4">{{ formatDateTime(booking.created_at) }}</td>
            </tr>
            <tr v-if="!loading && bookings.length === 0">
              <td colspan="5" class="text-center text-muted py-5">No bookings found.</td>
            </tr>
            <tr v-if="loading">
              <td colspan="5" class="text-center text-muted py-5">Loading bookings...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="d-md-none d-grid gap-3">
      <div v-if="loading" class="text-center text-muted py-4">Loading bookings...</div>

      <div v-for="booking in bookings" :key="booking.id" class="card border-0 shadow-sm p-3">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 class="fw-bold mb-0">{{ booking.title }}</h6>
            <small class="text-muted">{{ booking.type_name || '-' }}</small>
          </div>
          <span class="badge rounded-pill" :class="statusClass(booking.status)">{{ booking.status }}</span>
        </div>

        <div class="small text-muted mb-1"><strong>Owner:</strong> {{ booking.owner_name || '-' }}</div>
        <div class="small text-muted mb-1"><strong>Move-in:</strong> {{ formatDate(booking.move_in_date) }}</div>
        <div class="small text-muted mb-2"><strong>Submitted:</strong> {{ formatDateTime(booking.created_at) }}</div>

        <div v-if="booking.rejection_reason" class="alert alert-danger py-2 px-3 small mb-2">
          <strong>Rejection reason:</strong> {{ booking.rejection_reason }}
        </div>

        <div class="d-flex gap-2">
          <RouterLink :to="`/property/${booking.property_id}`" class="btn btn-outline-primary btn-sm">View Property</RouterLink>
          <a v-if="booking.valid_id_url" :href="booking.valid_id_url" target="_blank" rel="noopener noreferrer" class="btn btn-light border btn-sm">View ID</a>
        </div>
      </div>

      <div v-if="!loading && bookings.length === 0" class="text-center text-muted py-4">No bookings found.</div>
    </div>

    <div class="mt-3 d-none d-md-block" v-for="booking in bookings" :key="`note-${booking.id}`">
      <div v-if="booking.rejection_reason" class="alert alert-danger small py-2 px-3 mb-2">
        <strong>{{ booking.title }}:</strong> {{ booking.rejection_reason }}
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import { getMyBookings } from '@/api/bookings';

export default {
  name: 'MyBookings',
  components: { Header },
  data() {
    return {
      bookings: [],
      selectedStatus: 'all',
      loading: false,
    };
  },
  mounted() {
    this.fetchMyBookings();
  },
  methods: {
    async fetchMyBookings() {
      this.loading = true;
      try {
        const res = await getMyBookings(this.selectedStatus);
        this.bookings = res?.data?.data || [];
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        this.bookings = [];
      } finally {
        this.loading = false;
      }
    },
    statusClass(status) {
      if (status === 'approved') return 'bg-success-subtle text-success border border-success-subtle';
      if (status === 'rejected') return 'bg-danger-subtle text-danger border border-danger-subtle';
      return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
    },
    formatDate(date) {
      if (!date) return '-';
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return '-';
      return d.toLocaleDateString();
    },
    formatDateTime(date) {
      if (!date) return '-';
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return '-';
      return d.toLocaleString();
    },
  },
};
</script>
