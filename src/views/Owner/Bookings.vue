<template>
  <div class="p-3 p-md-4">
    <div class="row mb-4 align-items-center g-3">
      <div class="col-12 col-md-5">
        <h4 class="fw-bold mb-0"><i class="bi bi-book me-2"></i>Bookings</h4>
        <p class="text-muted small mb-0">Review tenant booking requests and submitted IDs.</p>
      </div>
      <div class="col-12 col-md-7">
        <div class="d-flex gap-2">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-start-0 ps-0" placeholder="Search tenant or property..." v-model="searchQuery" />
          </div>
          <select v-model="selectedStatus" class="form-select" style="max-width: 180px;" @change="fetchBookings">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button v-if="searchQuery" class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
        </div>
      </div>
    </div>

    <div class="d-none d-md-block card border-0 shadow-sm overflow-hidden">
      <table class="table table-hover mb-0">
        <thead class="bg-light text-muted small text-uppercase fw-bold">
          <tr>
            <th class="px-4 py-3 border-0">Tenant</th>
            <th class="py-3 border-0">Property</th>
            <th class="py-3 border-0">Move-in</th>
            <th class="py-3 border-0">Status</th>
            <th class="px-4 py-3 border-0 text-end">Action</th>
          </tr>
        </thead>
        <tbody v-if="filteredBookings.length > 0">
          <tr v-for="booking in filteredBookings" :key="booking.id" class="align-middle">
            <td class="px-4 py-3">
              <div class="fw-bold">{{ booking.first_name }} {{ booking.last_name }}</div>
              <small class="text-muted">{{ booking.email || '-' }}</small>
            </td>
            <td class="py-3">{{ booking.title }}</td>
            <td class="py-3">{{ booking.move_in_date || '-' }}</td>
            <td class="py-3">
              <span class="badge px-3 py-2 rounded-pill" :class="statusBadgeClass(booking.status)">
                {{ booking.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-end">
              <div class="d-flex gap-2 justify-content-end">
                <button class="btn btn-light btn-sm border" @click="openDetailsModal(booking)"><i class="bi bi-eye"></i> View</button>
                <button
                  v-if="booking.status === 'pending'"
                  class="btn btn-primary btn-sm px-3 fw-bold shadow-sm"
                  @click="approve(booking.id)"
                  :disabled="loading"
                >
                  Approve
                </button>
                <button
                  v-if="booking.status === 'pending'"
                  class="btn btn-outline-danger btn-sm"
                  @click="reject(booking.id)"
                  :disabled="loading"
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" class="p-5 text-center text-muted">No bookings found for this status.</td>
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
              <span class="badge px-2 py-1 rounded-pill small" :class="statusBadgeClass(booking.status)">
                {{ booking.status }}
              </span>
            </div>
            <small class="text-muted">Move-in: {{ booking.move_in_date || '-' }}</small>
            <hr class="my-2 opacity-25">
            <div class="d-flex gap-2 mt-2">
              <button class="btn btn-light border flex-grow-1" @click="openDetailsModal(booking)"><i class="bi bi-eye"></i> View</button>
              <button
                v-if="booking.status === 'pending'"
                class="btn btn-primary flex-grow-1 fw-bold shadow-sm"
                @click="approve(booking.id)"
                :disabled="loading"
              >
                Approve
              </button>
              <button
                v-if="booking.status === 'pending'"
                class="btn btn-outline-danger border"
                @click="reject(booking.id)"
                :disabled="loading"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <p class="text-muted">No bookings found.</p>
      </div>
    </div>

    <div v-if="showDetailsModal && selectedBooking" class="modal-backdrop-custom px-3">
      <div class="modal-custom shadow-lg border-0 my-auto">
        <div class="modal-scroll-area">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Booking Details</h5>
            <button class="btn-close" @click="closeDetailsModal"></button>
          </div>

          <div class="row g-3 small mb-3">
            <div class="col-6">
              <div class="text-muted">Tenant</div>
              <div class="fw-semibold">{{ selectedBooking.first_name }} {{ selectedBooking.last_name }}</div>
            </div>
            <div class="col-6">
              <div class="text-muted">Email</div>
              <div class="fw-semibold">{{ selectedBooking.email || '-' }}</div>
            </div>
            <div class="col-6">
              <div class="text-muted">Property</div>
              <div class="fw-semibold">{{ selectedBooking.title }}</div>
            </div>
            <div class="col-6">
              <div class="text-muted">Status</div>
              <span class="badge" :class="statusBadgeClass(selectedBooking.status)">{{ selectedBooking.status }}</span>
            </div>
            <div class="col-6">
              <div class="text-muted">Move-in Date</div>
              <div class="fw-semibold">{{ selectedBooking.move_in_date || '-' }}</div>
            </div>
            <div class="col-6">
              <div class="text-muted">Lease Duration</div>
              <div class="fw-semibold">{{ selectedBooking.lease_duration || '-' }}</div>
            </div>
            <div class="col-6">
              <div class="text-muted">Occupants</div>
              <div class="fw-semibold">{{ selectedBooking.occupants_num || '-' }}</div>
            </div>
          </div>

          <div class="mb-3">
            <div class="text-muted small">Notes</div>
            <div class="border rounded p-2 bg-light small">{{ selectedBooking.notes || 'No notes provided.' }}</div>
          </div>

          <div v-if="selectedBooking.rejection_reason" class="mb-3">
            <div class="text-muted small">Rejection Reason</div>
            <div class="border rounded p-2 bg-danger-subtle small text-danger-emphasis">{{ selectedBooking.rejection_reason }}</div>
          </div>

          <div class="mb-4">
            <div class="text-muted small mb-2">Submitted Valid ID</div>
            <a
              v-if="selectedBooking.valid_id_url"
              :href="selectedBooking.valid_id_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline-primary btn-sm"
            >
              <i class="bi bi-file-earmark-image me-1"></i> View Valid ID
            </a>
            <div v-else class="small text-muted">No uploaded ID found.</div>
          </div>

          <div class="d-flex gap-2" v-if="selectedBooking.status === 'pending'">
            <button class="btn btn-primary flex-grow-1 fw-bold" @click="approve(selectedBooking.id)" :disabled="loading">Approve</button>
            <button class="btn btn-outline-danger flex-grow-1" @click="reject(selectedBooking.id)" :disabled="loading">Reject</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { approveBooking, getPendingUserBookings, rejectBooking } from '@/api/Owner/bookings';

export default {
  data() {
    return {
      bookings: [],
      searchQuery: '',
      selectedStatus: 'pending',
      showDetailsModal: false,
      loading: false,
      selectedBooking: null,
    };
  },
  computed: {
    filteredBookings() {
      const query = this.searchQuery.toLowerCase();
      return this.bookings.filter((b) =>
        (`${b.first_name} ${b.last_name}`).toLowerCase().includes(query) ||
        String(b.title || '').toLowerCase().includes(query)
      );
    },
  },
  mounted() {
    this.fetchBookings();
  },
  methods: {
    statusBadgeClass(status) {
      if (status === 'pending') return 'bg-warning-subtle text-warning border border-warning-subtle';
      if (status === 'approved') return 'bg-success-subtle text-success border border-success-subtle';
      if (status === 'rejected') return 'bg-danger-subtle text-danger border border-danger-subtle';
      return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    },
    async fetchBookings() {
      try {
        const response = await getPendingUserBookings(this.selectedStatus);
        this.bookings = response?.data?.data || [];
      } catch (error) {
        console.error('Error fetching bookings:', error);
        this.bookings = [];
      }
    },
    openDetailsModal(booking) {
      this.selectedBooking = { ...booking };
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedBooking = null;
    },
    clearSearch() {
      this.searchQuery = '';
    },
    async approve(bookingId) {

      this.showDetailsModal = false;
      const result = await Swal.fire({
        icon: 'question',
        title: 'Approve booking?',
        text: 'This will move the user into your tenant workflow.',
        showCancelButton: true,
        confirmButtonText: 'Approve',
      });

      if (!result.isConfirmed) return;

      this.loading = true;
      try {
        await approveBooking(bookingId);
        await Swal.fire({ icon: 'success', title: 'Approved', timer: 1200, showConfirmButton: false });
        await this.fetchBookings();
        if (this.selectedBooking?.id === bookingId) this.closeDetailsModal();
      } catch (error) {
        await Swal.fire({ icon: 'error', title: 'Approval failed', text: error?.response?.data?.error || error?.response?.data?.message || 'An error occurred.' });
      } finally {
        this.loading = false;
      }
    },
    async reject(bookingId) {
      this.showDetailsModal = false;
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Reject booking',
        input: 'textarea',
        inputLabel: 'Reason for rejection',
        inputPlaceholder: 'Enter reason...',
        inputAttributes: { maxlength: 500 },
        showCancelButton: true,
        confirmButtonText: 'Reject',
        preConfirm: (value) => {
          if (!value || !value.trim()) {
            Swal.showValidationMessage('Rejection reason is required.');
          }
          return value;
        },
      });

      if (!result.isConfirmed) return;

      this.loading = true;
      try {
        await rejectBooking(bookingId, result.value.trim());
        await Swal.fire({ icon: 'success', title: 'Rejected', timer: 1200, showConfirmButton: false });
        await this.fetchBookings();
        if (this.selectedBooking?.id === bookingId) this.closeDetailsModal();
      } catch (error) {
        await Swal.fire({ icon: 'error', title: 'Rejection failed', text: error?.response?.data?.error || error?.response?.data?.message || 'An error occurred.' });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
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
  padding: 1.25rem;
  border-radius: 16px;
  width: 95%;
  max-width: 560px;
}

.modal-scroll-area {
  max-height: 82vh;
  overflow-y: auto;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
