<template>

  <div class="p-3 p-md-4">
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h4 class="fw-bold mb-0"><i class="bi bi-book me-2"></i>Pending Bookings</h4>
        <p class="text-muted small">Manage and approve tenant booking requests.</p>
      </div>
    </div>

    <div class="d-flex justify-content-between mb-3">
      <div class="d-flex gap-2">
        <input type="text" class="form-control" placeholder="Search Tenant..." v-model="searchQuery" />
        <button class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
      </div>
    </div>

    <div class="card border-0 shadow-sm overflow-hidden">
      <table class="table table-hover mb-0">
        <thead class="bg-light">
          <tr>
            <th class="px-4 py-3 border-0">Name</th>
            <th class="py-3 border-0">Property</th>
            <th class="py-3 border-0">Booking Status</th>
            <th class="px-4 py-3 border-0 text-end">Action</th>
          </tr>
        </thead>
        <tbody v-if="bookings.length > 0">
          <tr v-for="booking in bookings" :key="booking.id" class="align-middle">
            <td class="px-4 py-3 fw-bold">{{ booking.first_name }} {{ booking.last_name }}</td>
            <td class="py-3">{{ booking.title }}</td>
            <td class="py-3">
              <span class="badge bg-warning-subtle text-warning border border-warning px-3 py-2 rounded-pill">
                {{ booking.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-end">
              <div class="d-flex gap-2 justify-content-end">
                <button class="btn btn-light btn-sm border"><i class="bi bi-eye"></i></button>
                <button class="btn btn-light btn-sm border text-danger"><i class="bi bi-trash"></i></button>
                <button class="btn btn-primary btn-sm px-3 fw-bold" @click="openApproveModal(booking)">
                  <i class="bi bi-check-lg me-1"></i> Approve
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="p-5 text-center text-muted">No pending bookings yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showApproveModal" class="modal-backdrop-custom">
      <div class="modal-custom shadow-lg border-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Approve Booking</h5>
          <button class="btn-close" @click="closeApproveModal"></button>
        </div>

        <div class="alert alert-primary py-2 small border-0">
          <i class="bi bi-info-circle me-2"></i>
          Set the lease details for <strong>{{ selectedBooking.first_name }}</strong>.
        </div>

        <div class="mb-3">
          <div v-if="selectedBooking.type_name === 'Boarding House'">
            <label class="form-label small fw-bold text-muted">Stay Duration</label>
            <select v-model="selectedBooking.stay_duration" class="form-select">
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">1 year</option>
              <option value="custom">Custom</option>
            </select>
            <div v-if="selectedBooking.stay_duration === 'custom'" class="mt-2">
              <input type="number" v-model="selectedBooking.custom_months" min="1" class="form-control" placeholder="Enter months" />
            </div>
          </div>

          <div v-else-if="['Apartment', 'Condo', 'House', 'Commercial Space'].includes(selectedBooking.type_name)">
            <label class="form-label small fw-bold text-muted">Lease Duration (Months)</label>
            <input type="number" v-model="selectedBooking.lease_duration" min="1" class="form-control" />
          </div>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label small fw-bold text-muted">Move-in Date</label>
            <input type="date" v-model="selectedBooking.move_in_date" class="form-control" />
          </div>
          <div v-if="selectedBooking.type_name !== 'Boarding House'" class="col-md-6">
            <label class="form-label small fw-bold text-muted">Occupants</label>
            <input type="number" v-model="selectedBooking.occupants_num" min="1" class="form-control" />
          </div>
        </div>

        <div class="mt-3">
          <label class="form-label small fw-bold text-muted">Internal Notes</label>
          <textarea v-model="selectedBooking.notes" class="form-control" rows="2" placeholder="Private notes for reference..."></textarea>
        </div>

        <div class="form-check mt-3">
          <input type="checkbox" v-model="selectedBooking.agreement" class="form-check-input" id="approveAgree">
          <label class="form-check-label small" for="approveAgree">
            Confirm that all details are verified and agreed upon.
          </label>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-light px-4" @click="closeApproveModal">Cancel</button>
          <button class="btn btn-primary px-4 fw-bold" @click="submitApproval" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { approveBooking, getPendingUserBookings } from '@/api/Owner/bookings';
import Header from '@/components/Header.vue';

export default {
  components: { Header },
  data() {
    return {
      bookings: [],
      searchQuery: '',
      showApproveModal: false,
      loading: false,
      selectedBooking: null
    };
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter(b => 
        (b.first_name + ' ' + b.last_name).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  mounted() {
    this.fetchPendingBookings();
  },
  methods: {
    async fetchPendingBookings() {
      try {
        const response = await getPendingUserBookings();
        this.bookings = response.data.data.map(b => ({
          ...b,
          agreement: b.agreement == 1,
          stay_duration: b.stay_duration || '1',
          move_in_date: b.move_in_date || new Date().toISOString().split('T')[0]
        }));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    },
    openApproveModal(booking) {
      // Create a shallow copy so we don't edit the main list directly
      this.selectedBooking = { ...booking };
      this.showApproveModal = true;
    },
    closeApproveModal() {
      this.showApproveModal = false;
      this.selectedBooking = null;
    },
    clearSearch() {
      this.searchQuery = '';
    },
    async submitApproval() {
      if (!this.selectedBooking.agreement) {
        alert("Please check the verification box to proceed.");
        return;
      }

      this.loading = true;
      try {
        const response = await approveBooking(this.selectedBooking.id, this.selectedBooking);
        if (response.status === 200) {
          alert("Booking approved successfully!");
          this.closeApproveModal();
          this.fetchPendingBookings();
        }
      } catch (error) {
        alert(error.response?.data?.message || "An error occurred during approval.");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Exact CSS from your custom modal snippet */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-custom {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 95%;
  max-width: 500px;
}
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>