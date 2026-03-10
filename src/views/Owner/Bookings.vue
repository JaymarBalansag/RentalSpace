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

          <div class="details-grid">
            <div class="detail-card">
              <div class="detail-card-head">
                <h6 class="fw-bold mb-0">Tenant Info</h6>
                <span class="chip-muted">User</span>
              </div>
              <div class="detail-kv">
                <span>Name</span>
                <strong>{{ selectedBooking.first_name }} {{ selectedBooking.last_name }}</strong>
              </div>
              <div class="detail-kv">
                <span>Email</span>
                <strong>{{ selectedBooking.email || '-' }}</strong>
              </div>
              <div class="detail-kv">
                <span>Phone</span>
                <strong>{{ selectedBooking.phone_number || selectedBooking.phone || '-' }}</strong>
              </div>
            </div>

            <div class="detail-card">
              <div class="detail-card-head">
                <h6 class="fw-bold mb-0">Booking Info</h6>
                <span class="chip-muted">Request</span>
              </div>
              <div class="detail-kv">
                <span>Property</span>
                <strong>{{ selectedBooking.title }}</strong>
              </div>
              <div class="detail-kv">
                <span>Status</span>
                <span class="badge" :class="statusBadgeClass(selectedBooking.status)">{{ selectedBooking.status }}</span>
              </div>
              <div class="detail-kv">
                <span>Move-in Date</span>
                <strong>{{ selectedBooking.move_in_date || '-' }}</strong>
              </div>
              <div class="detail-kv">
                <span>Lease Duration</span>
                <strong>{{ selectedBooking.lease_duration || '-' }}</strong>
              </div>
              <div class="detail-kv">
                <span>Occupants</span>
                <strong>{{ selectedBooking.occupants_num || '-' }}</strong>
              </div>
            </div>

            <div class="detail-card detail-card-full">
              <div class="detail-card-head">
                <h6 class="fw-bold mb-0">Valid ID</h6>
                <span class="chip-muted">Verification</span>
              </div>
              <div v-if="selectedBooking.valid_id_url || selectedBooking.user_valid_govt_id_url" class="id-preview">
                <iframe
                  v-if="String(selectedBooking.valid_id_url || selectedBooking.user_valid_govt_id_url).toLowerCase().includes('.pdf')"
                  :src="selectedBooking.valid_id_url || selectedBooking.user_valid_govt_id_url"
                  title="Valid ID preview"
                ></iframe>
                <img
                  v-else
                  :src="selectedBooking.valid_id_url || selectedBooking.user_valid_govt_id_url"
                  alt="Valid ID"
                />
                <a
                  :href="selectedBooking.valid_id_url || selectedBooking.user_valid_govt_id_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline-primary btn-sm mt-2"
                >
                  <i class="bi bi-box-arrow-up-right me-1"></i> Open in new tab
                </a>
              </div>
              <div v-else class="empty-state-sm">No uploaded ID found.</div>
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

.details-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-card {
  border: 1px solid #e7edf5;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  background: #ffffff;
}

.detail-card-full {
  grid-column: 1 / -1;
}

.detail-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.chip-muted {
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.68rem;
  font-weight: 600;
  background: #f2f6fb;
  color: #516079;
  border: 1px solid #e1e8f2;
}

.detail-kv {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.85rem;
  padding: 0.35rem 0;
  border-bottom: 1px dashed #eef2f7;
}

.detail-kv:last-child {
  border-bottom: none;
}

.detail-kv span {
  color: #6b7280;
}

.id-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.id-preview img,
.id-preview iframe {
  width: 100%;
  max-height: 260px;
  border-radius: 12px;
  border: 1px solid #e6ebf2;
  background: #f8fafc;
}

.empty-state-sm {
  border: 1px dashed #d9e5f3;
  border-radius: 12px;
  padding: 0.75rem;
  font-size: 0.82rem;
  color: #6b7280;
  background: #f8fbff;
  text-align: center;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
