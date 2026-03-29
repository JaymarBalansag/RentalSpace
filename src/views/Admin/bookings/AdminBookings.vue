<template>
  <div class="admin-bookings-page p-3 p-md-4">
    <section class="hero-panel mb-4">
      <div>
        <h3 class="fw-bold mb-1">Booking Operations</h3>
        <p class="mb-0 small text-muted">Centralized monitoring with exception-only intervention.</p>
      </div>
      <button class="btn btn-refresh" :disabled="isListLoading" @click="loadBookings">
        <i class="bi bi-arrow-repeat me-2"></i>{{ isListLoading ? "Refreshing..." : "Refresh" }}
      </button>
    </section>

    <section class="summary-grid mb-4">
      <article class="summary-card total">
        <small>Total</small>
        <h5>{{ bookings.length }}</h5>
      </article>
      <article class="summary-card pending">
        <small>Pending</small>
        <h5>{{ pendingCount }}</h5>
      </article>
      <article class="summary-card approved">
        <small>Approved</small>
        <h5>{{ approvedCount }}</h5>
      </article>
      <article class="summary-card rejected">
        <small>Rejected</small>
        <h5>{{ rejectedCount }}</h5>
      </article>
    </section>

    <section class="filters-panel mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label class="form-label small fw-semibold">Search</label>
          <div class="input-group search-control">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              placeholder="Tenant, owner, property..."
              @keyup.enter="applyFilters"
            />
          </div>
        </div>
        <div class="col-md-2">
          <label class="form-label small fw-semibold">Status</label>
          <select v-model="filters.status" class="form-select">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label small fw-semibold">Created From</label>
          <input v-model="filters.date_from" type="date" class="form-control" />
        </div>
        <div class="col-md-2">
          <label class="form-label small fw-semibold">Created To</label>
          <input v-model="filters.date_to" type="date" class="form-control" />
        </div>
        <div class="col-md-2 d-flex gap-2">
          <button class="btn btn-primary flex-grow-1" @click="applyFilters">
            Apply
          </button>
          <button class="btn btn-light border" title="Reset filters" @click="resetFilters">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>
    </section>

    <section class="table-panel">
      <div class="panel-head">
        <span class="fw-bold">Bookings</span>
        <span class="small text-muted">{{ bookings.length }} results</span>
      </div>

      <div v-if="listError" class="alert alert-danger m-3 mb-0">
        {{ listError }}
      </div>

      <div v-if="isListLoading" class="list-loading py-5 text-center">
        <div class="spinner-border text-primary mb-2" role="status"></div>
        <p class="text-muted small mb-0">Loading bookings...</p>
      </div>

      <div v-else class="table-responsive d-none d-lg-block">
        <table class="table align-middle mb-0 admin-table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Tenant</th>
              <th>Property</th>
              <th>Owner</th>
              <th>Move-in</th>
              <th>Status</th>
              <th class="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
              <td class="text-muted fw-semibold small">#{{ booking.id }}</td>
              <td>
                <div class="fw-semibold">{{ booking.tenant_name }}</div>
                <small class="text-muted">{{ booking.tenant_email }}</small>
              </td>
              <td>
                <div class="fw-semibold">{{ booking.property_title }}</div>
                <small class="text-muted">Property #{{ booking.property_id }}</small>
              </td>
              <td>
                <div>{{ booking.owner_name }}</div>
                <small class="text-muted">{{ booking.owner_email }}</small>
              </td>
              <td>{{ booking.move_in_date || "-" }}</td>
              <td>
                <span class="status-pill" :class="booking.status">{{ booking.status }}</span>
              </td>
              <td class="text-end pe-4">
                <div class="d-flex justify-content-end gap-2">
                  <button class="action-btn info" title="View details" @click="openDetails(booking.id)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="action-btn danger"
                    title="Force cancel"
                    :disabled="isActionLoading || booking.status === 'rejected'"
                    @click="openForceCancelModal(booking)"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="bookings.length === 0">
              <td colspan="7" class="text-center py-5">
                <i class="bi bi-calendar-x fs-2 text-muted opacity-50"></i>
                <p class="text-muted mt-2 mb-0">No bookings matched your filters.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isListLoading" class="d-lg-none p-3 mobile-list-shell">
        <div v-if="bookings.length === 0" class="text-center py-5 text-muted">
          No bookings matched your filters.
        </div>
        <article v-for="booking in bookings" :key="booking.id" class="mobile-card mb-3">
          <div class="mobile-card-top">
            <div class="mobile-card-heading">
              <h6 class="fw-bold mb-1">{{ booking.property_title }}</h6>
              <small class="text-muted d-block booking-meta-line">#{{ booking.id }} - {{ booking.tenant_name }}</small>
            </div>
            <span class="status-pill mobile-status-pill" :class="booking.status">{{ booking.status }}</span>
          </div>
          <div class="small text-muted mobile-card-details">
            <div class="mobile-detail-line"><i class="bi bi-person me-2"></i><span>{{ booking.owner_name }}</span></div>
            <div class="mobile-detail-line"><i class="bi bi-calendar-event me-2"></i><span>{{ booking.move_in_date || "-" }}</span></div>
          </div>
          <div class="mobile-card-actions">
            <button class="mobile-action info" @click="openDetails(booking.id)">
              <i class="bi bi-eye"></i>
            </button>
            <button
              class="mobile-action danger"
              :disabled="isActionLoading || booking.status === 'rejected'"
              @click="openForceCancelModal(booking)"
            >
              <i class="bi bi-x-circle"></i>
            </button>
          </div>
        </article>
      </div>
    </section>

    <div v-if="showDetailsModal" class="modal-overlay-custom" @click.self="closeDetails">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Booking Details</h5>
          <button class="btn-close" @click="closeDetails"></button>
        </div>

        <div v-if="isDetailsLoading" class="py-4 text-center text-muted">Loading booking details...</div>
        <div v-else-if="detailsError" class="alert alert-danger mb-0">{{ detailsError }}</div>
        <div v-else-if="selectedBooking" class="row g-3">
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Booking</h6>
              <p><strong>ID:</strong> #{{ selectedBooking.id }}</p>
              <p><strong>Status:</strong> <span class="text-capitalize">{{ selectedBooking.status }}</span></p>
              <p><strong>Move-in:</strong> {{ selectedBooking.move_in_date || "-" }}</p>
              <p class="mb-0"><strong>Lease Duration:</strong> {{ selectedBooking.lease_duration || "-" }}</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Stay Profile</h6>
              <p><strong>Occupants:</strong> {{ selectedBooking.occupants_num || "-" }}</p>
              <p><strong>Room Preference:</strong> {{ selectedBooking.room_preference || "-" }}</p>
              <p><strong>Agreement:</strong> {{ selectedBooking.agreement ? "Accepted" : "Not accepted" }}</p>
              <p class="mb-0"><strong>Created:</strong> {{ selectedBooking.created_at || "-" }}</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Tenant</h6>
              <p><strong>Name:</strong> {{ selectedBooking.tenant_name || "-" }}</p>
              <p><strong>Email:</strong> {{ selectedBooking.tenant_email || "-" }}</p>
              <p class="mb-0"><strong>Phone:</strong> {{ selectedBooking.tenant_phone || "-" }}</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Property + Owner</h6>
              <p><strong>Property:</strong> {{ selectedBooking.property_title || "-" }}</p>
              <p><strong>Owner:</strong> {{ selectedBooking.owner_name || "-" }}</p>
              <p><strong>Owner Email:</strong> {{ selectedBooking.owner_email || "-" }}</p>
              <p class="mb-0"><strong>Rent:</strong> {{ selectedBooking.property_price || "-" }} / {{ selectedBooking.payment_frequency || "-" }}</p>
            </div>
          </div>
          <div class="col-12">
            <div class="detail-card">
              <h6>Notes</h6>
              <p class="mb-0">{{ selectedBooking.notes || "-" }}</p>
            </div>
          </div>
          <div class="col-12" v-if="selectedBooking.rejection_reason">
            <div class="detail-card danger">
              <h6>Rejection / Cancel Reason</h6>
              <p class="mb-0">{{ selectedBooking.rejection_reason }}</p>
            </div>
          </div>
          <div class="col-12" v-if="selectedBooking.valid_id_url">
            <a :href="selectedBooking.valid_id_url" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary">
              View Submitted Valid ID
            </a>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      :show="showConfirmModal"
      :title="'Force Cancel Booking'"
      :message="confirmMessage"
      :confirm-text="'Force Cancel'"
      :variant="'danger'"
      :loading="isActionLoading"
      :show-input="true"
      :input-label="'Reason'"
      :input-placeholder="'State why this booking must be force-cancelled...'"
      :input-required="true"
      :input-value="confirmReason"
      @update:inputValue="confirmReason = $event"
      @cancel="closeForceCancelModal"
      @confirm="confirmForceCancel"
    />
  </div>
</template>

<script>
import ConfirmModal from "@/components/confirmModal.vue";
import {
  forceCancelAdminBooking,
  getAdminBookingDetails,
  getAdminBookings,
} from "@/api/Admin/AdminBooking/AdminBooking";
import Swal from "sweetalert2";

export default {
  name: "AdminBookings",
  components: {
    ConfirmModal,
  },
  data() {
    return {
      filters: {
        search: "",
        status: "all",
        date_from: "",
        date_to: "",
      },
      bookings: [],
      isListLoading: false,
      listError: "",
      showDetailsModal: false,
      selectedBooking: null,
      isDetailsLoading: false,
      detailsError: "",
      showConfirmModal: false,
      confirmBookingId: null,
      confirmReason: "",
      confirmMessage: "Are you sure you want to force-cancel this booking?",
      isActionLoading: false,
    };
  },
  computed: {
    pendingCount() {
      return this.bookings.filter((b) => b.status === "pending").length;
    },
    approvedCount() {
      return this.bookings.filter((b) => b.status === "approved").length;
    },
    rejectedCount() {
      return this.bookings.filter((b) => b.status === "rejected").length;
    },
  },
  methods: {
    showAlert(options) {
      return Swal.fire({
        confirmButtonText: "Okay",
        ...options,
      });
    },
    async loadBookings() {
      this.isListLoading = true;
      this.listError = "";

      const params = {
        status: this.filters.status,
        search: this.filters.search,
        date_from: this.filters.date_from,
        date_to: this.filters.date_to,
      };

      const res = await getAdminBookings(params);
      if (res && res.status >= 200 && res.status < 300) {
        this.bookings = res.data?.data || [];
      } else {
        this.bookings = [];
        this.listError = res?.data?.message || "Failed to load bookings.";
      }

      this.isListLoading = false;
    },
    applyFilters() {
      this.loadBookings();
    },
    resetFilters() {
      this.filters = {
        search: "",
        status: "all",
        date_from: "",
        date_to: "",
      };
      this.loadBookings();
    },
    async openDetails(bookingId) {
      this.showDetailsModal = true;
      this.selectedBooking = null;
      this.detailsError = "";
      this.isDetailsLoading = true;

      const res = await getAdminBookingDetails(bookingId);
      if (res && res.status >= 200 && res.status < 300) {
        this.selectedBooking = res.data?.data || null;
      } else {
        this.detailsError = res?.data?.message || "Failed to load booking details.";
      }

      this.isDetailsLoading = false;
    },
    closeDetails() {
      this.showDetailsModal = false;
      this.selectedBooking = null;
      this.detailsError = "";
    },
    openForceCancelModal(booking) {
      this.confirmBookingId = booking.id;
      this.confirmReason = "";
      this.confirmMessage = `Force-cancel booking #${booking.id} for ${booking.tenant_name}?`;
      this.showConfirmModal = true;
    },
    closeForceCancelModal() {
      if (this.isActionLoading) return;
      this.showConfirmModal = false;
      this.confirmBookingId = null;
      this.confirmReason = "";
    },
    async confirmForceCancel() {
      if (!this.confirmBookingId || this.isActionLoading) return;

      this.isActionLoading = true;
      const targetId = this.confirmBookingId;
      const res = await forceCancelAdminBooking(targetId, this.confirmReason.trim());
      this.isActionLoading = false;

      if (!res || res.status < 200 || res.status >= 300) {
        await this.showAlert({
          icon: "error",
          title: "Force Cancel Failed",
          text: res?.data?.message || "Failed to force-cancel booking.",
        });
        return;
      }

      this.closeForceCancelModal();
      await this.loadBookings();
      if (this.selectedBooking?.id === targetId) {
        await this.openDetails(targetId);
      }
    },
  },
  mounted() {
    this.loadBookings();
  },
  watch: {
    "filters.status"() {
      this.loadBookings();
    },
  },
};
</script>

<style scoped>
.admin-bookings-page {
  background:
    radial-gradient(circle at 0 0, rgba(228, 242, 255, 0.65), transparent 40%),
    radial-gradient(circle at 100% 0, rgba(255, 238, 230, 0.45), transparent 35%),
    #f6f8fc;
  min-height: 100vh;
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1px solid #e5ebf5;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}

.btn-refresh {
  border: 1px solid #d7dfec;
  background: #fff;
  color: #2f3a4f;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.summary-card {
  border-radius: 12px;
  padding: 0.8rem 1rem;
  border: 1px solid #e8edf5;
  background: #fff;
}

.summary-card small {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.68rem;
  color: #64748b;
}

.summary-card h5 {
  margin: 0.2rem 0 0;
  font-weight: 800;
}

.summary-card.pending { background: #fffbed; }
.summary-card.approved { background: #effdf6; }
.summary-card.rejected { background: #fff3f3; }

.filters-panel {
  border-radius: 14px;
  border: 1px solid #e5ebf5;
  background: #fff;
  padding: 1rem;
}

.search-control .input-group-text {
  background: #fff;
  border-right: none;
}

.search-control .form-control {
  border-left: none;
}

.table-panel {
  background: #fff;
  border: 1px solid #e5ebf5;
  border-radius: 14px;
  overflow: hidden;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #edf2f8;
}

.admin-table thead th {
  background: #f4f7fb;
  border: none;
  color: #5b687d;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.75rem 1rem;
}

.admin-table tbody td {
  border-bottom: 1px solid #eef2f8;
  padding: 0.8rem 1rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  text-transform: capitalize;
  font-size: 0.72rem;
  font-weight: 700;
}

.status-pill.pending { background: #fff4ce; color: #956800; }
.status-pill.approved { background: #d9f9e8; color: #0a7c4d; }
.status-pill.rejected { background: #ffe2e2; color: #b42318; }

.action-btn {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn.info { background: #e8f3ff; color: #2d7dd2; }
.action-btn.danger { background: #ffeaea; color: #d92d20; }

.mobile-card {
  border: 1px solid #e9eef6;
  border-radius: 16px;
  padding: 1rem;
  background: #fff;
}

.mobile-list-shell {
  padding-inline: 0.35rem;
}

.mobile-card-top {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.mobile-card-heading {
  min-width: 0;
}

.booking-meta-line {
  overflow-wrap: anywhere;
}

.mobile-status-pill {
  align-self: flex-start;
}

.mobile-card-details {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.9rem;
}

.mobile-detail-line {
  display: flex;
  align-items: flex-start;
}

.mobile-detail-line span {
  overflow-wrap: anywhere;
}

.mobile-card-actions {
  display: flex;
  gap: 0.65rem;
  margin-top: 0.95rem;
  padding-top: 0.85rem;
  border-top: 1px solid #eef2f8;
}

.mobile-action {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 10px;
}

.mobile-action.info { background: #e8f3ff; color: #2d7dd2; }
.mobile-action.danger { background: #ffdede; color: #cc1f1a; }

.modal-overlay-custom {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-body-custom {
  background: #fff;
  width: min(94vw, 880px);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-body-custom .detail-card {
  overflow-wrap: anywhere;
}

.detail-card {
  border: 1px solid #e8edf5;
  border-radius: 12px;
  padding: 0.85rem;
  height: 100%;
}

.detail-card h6 {
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 800;
  color: #667085;
  margin-bottom: 0.65rem;
}

.detail-card p {
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

.detail-card.danger {
  border-color: #fecaca;
  background: #fff5f5;
}

@media (max-width: 991px) {
  .hero-panel {
    flex-direction: column;
    align-items: stretch;
    padding: 0.95rem 1rem;
  }

  .btn-refresh {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filters-panel .row > div:last-child {
    margin-top: 0.25rem;
  }
}

@media (max-width: 767.98px) {
  .admin-bookings-page {
    padding-inline: 0.75rem !important;
  }

  .summary-grid {
    gap: 0.6rem;
  }

  .summary-card {
    padding: 0.75rem 0.85rem;
  }

  .filters-panel {
    padding: 0.9rem;
  }

  .mobile-list-shell {
    padding: 0.75rem !important;
  }

  .mobile-action {
    width: 42px;
    height: 42px;
  }

  .modal-body-custom {
    width: calc(100% - 1rem);
    max-width: none;
    max-height: calc(100vh - 1rem);
    margin: 0.5rem;
    padding: 1rem !important;
    border-radius: 18px !important;
  }
}
</style>

