<template>
  <div class="p-3 p-md-4">
    <div class="row mb-4 align-items-center g-3">
      <div class="col-12 col-md-6">
        <h4 class="fw-bold mb-0"><i class="bi bi-book me-2"></i>Pending Bookings</h4>
        <p class="text-muted small mb-0">Manage and approve tenant booking requests.</p>
      </div>
      <div class="col-12 col-md-6">
        <div class="d-flex gap-2">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-start-0 ps-0" placeholder="Search Tenant..." v-model="searchQuery" />
          </div>
          <button v-if="searchQuery" class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
        </div>
      </div>
    </div>

    <div class="d-none d-md-block card border-0 shadow-sm overflow-hidden">
      <table class="table table-hover mb-0">
        <thead class="bg-light text-muted small text-uppercase fw-bold">
          <tr>
            <th class="px-4 py-3 border-0">Tenant Name</th>
            <th class="py-3 border-0">Property</th>
            <th class="py-3 border-0">Status</th>
            <th class="px-4 py-3 border-0 text-end">Action</th>
          </tr>
        </thead>
        <tbody v-if="filteredBookings.length > 0">
          <tr v-for="booking in filteredBookings" :key="booking.id" class="align-middle">
            <td class="px-4 py-3 fw-bold">{{ booking.first_name }} {{ booking.last_name }}</td>
            <td class="py-3">{{ booking.title }}</td>
            <td class="py-3">
              <span class="badge bg-warning-subtle text-warning border border-warning px-3 py-2 rounded-pill">
                {{ booking.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-end">
              <div class="d-flex gap-2 justify-content-end">
                <button class="btn btn-light btn-sm border" title="View"><i class="bi bi-eye"></i></button>
                <button class="btn btn-light btn-sm border text-danger" title="Delete"><i class="bi bi-trash"></i></button>
                <button class="btn btn-primary btn-sm px-3 fw-bold shadow-sm" @click="openApproveModal(booking)">
                  Approve
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

    <div class="d-md-none">
      <div v-if="filteredBookings.length > 0" class="row g-3">
        <div v-for="booking in filteredBookings" :key="booking.id" class="col-12">
          <div class="card border-0 shadow-sm p-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 class="fw-bold mb-0 text-dark">{{ booking.first_name }} {{ booking.last_name }}</h6>
                <small class="text-muted"><i class="bi bi-house-door me-1"></i>{{ booking.title }}</small>
              </div>
              <span class="badge bg-warning-subtle text-warning px-2 py-1 rounded-pill small">
                {{ booking.status }}
              </span>
            </div>
            <hr class="my-2 opacity-25">
            <div class="d-flex gap-2 mt-2">
              <button class="btn btn-light border flex-grow-1"><i class="bi bi-eye"></i> View</button>
              <button class="btn btn-primary flex-grow-1 fw-bold shadow-sm" @click="openApproveModal(booking)">
                Approve
              </button>
              <button class="btn btn-outline-danger border"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <p class="text-muted">No pending bookings found.</p>
      </div>
    </div>

    <div v-if="showApproveModal" class="modal-backdrop-custom px-3">
      <div class="modal-custom shadow-lg border-0 my-auto">
        <div class="modal-scroll-area">
           <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Approve Booking</h5>
            <button class="btn-close" @click="closeApproveModal"></button>
          </div>
          <div class="alert alert-primary py-2 small border-0 mb-3">
            <i class="bi bi-info-circle me-2"></i>
            Set lease for <strong>{{ selectedBooking.first_name }}</strong>.
          </div>
          
          <div class="mb-3">
             <label class="form-label small fw-bold text-muted">Lease/Stay Details</label>
             <div v-if="selectedBooking.type_name === 'Boarding House'">
                <select v-model="selectedBooking.stay_duration" class="form-select mb-2">
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">1 year</option>
                  <option value="custom">Custom</option>
                </select>
                <input v-if="selectedBooking.stay_duration === 'custom'" type="number" v-model="selectedBooking.custom_months" class="form-control" placeholder="Enter months" />
             </div>
             <input v-else type="number" v-model="selectedBooking.lease_duration" class="form-control" placeholder="Months" />
          </div>

          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="small fw-bold text-muted">Move-in</label>
              <input type="date" v-model="selectedBooking.move_in_date" class="form-control" />
            </div>
            <div class="col-6">
              <label class="small fw-bold text-muted">Occupants</label>
              <input type="number" v-model="selectedBooking.occupants_num" class="form-control" />
            </div>
          </div>

          <div class="mb-3">
            <label class="small fw-bold text-muted">Notes</label>
            <textarea v-model="selectedBooking.notes" class="form-control" rows="2"></textarea>
          </div>

          <div class="form-check mb-4">
            <input type="checkbox" v-model="selectedBooking.agreement" class="form-check-input" id="approveAgree">
            <label class="form-check-label small" for="approveAgree">Verified all details</label>
          </div>

          <div class="d-flex flex-column flex-md-row gap-2">
            <button class="btn btn-primary order-0 order-md-1 flex-grow-1 fw-bold" @click="submitApproval" :disabled="loading">
              Confirm Approval
            </button>
            <button class="btn btn-light order-1 order-md-0 px-4" @click="closeApproveModal">Cancel</button>
          </div>
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
        const response = await approveBooking(this.selectedBooking.id);
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
