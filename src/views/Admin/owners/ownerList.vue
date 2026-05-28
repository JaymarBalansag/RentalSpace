<template>
  <div class="admin-view-container p-3 p-md-4">
    <div class="page-top d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold text-dark mb-1">Owner Verification</h3>
        <p class="text-muted small mb-0">Review owner documents and approve or reject verification.</p>
      </div>
      <button class="btn btn-outline-secondary px-4 shadow-sm refresh-btn" @click="fetchOwners">
        <i class="bi bi-arrow-repeat me-2"></i>Refresh
      </button>
    </div>

    <div class="card shadow-sm border-0 mb-4 p-2 filter-shell">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6 col-lg-7">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input
                v-model="search"
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Search by name or email..."
              />
            </div>
          </div>
          <div class="col-md-3 col-lg-3">
            <select v-model="filterStatus" class="form-select">
              <option value="">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="unverified">Unverified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="col-md-3 col-lg-2">
            <button class="btn btn-outline-secondary w-100" @click="resetFilter">
              <i class="bi bi-arrow-clockwise me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="data-card shadow-sm border-0">
      <div class="card-header bg-white py-3 border-bottom border-light d-flex justify-content-between align-items-center">
        <span class="fw-bold">Owners</span>
        <span class="badge bg-light text-dark border">{{ filteredOwners.length }} Total</span>
      </div>

      <div class="table-responsive d-none d-lg-block">
        <table class="table align-middle custom-admin-table mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Verification</th>
              <th class="text-end px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredOwners.length > 0">
              <tr v-for="owner in filteredOwners" :key="owner.id">
                <td class="text-muted small fw-bold">#{{ owner.id }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">{{ initials(owner) }}</div>
                    <span class="fw-semibold">{{ owner.first_name }} {{ owner.last_name }}</span>
                  </div>
                </td>
                <td class="small">{{ owner.email }}</td>
                <td class="text-muted small">{{ owner.created_at }}</td>
                <td>
                  <span class="badge-modern" :class="normalizeVerificationStatus(owner)">
                    {{ verificationLabel(owner) }}
                  </span>
                </td>
                <td class="text-end px-4">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn-action view" title="View Owner" @click="openOwnerModal(owner)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn-action notify"
                      title="Notify Owner"
                      :disabled="isActionLoading"
                      @click="openNotifyOwnerModal(owner)"
                    >
                      <i class="bi bi-bell"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="6" class="text-center py-5">
                <i class="bi bi-people fs-1 text-muted opacity-25"></i>
                <p class="text-muted mt-2">No owners found matching your criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-lg-none p-3 mobile-list-shell">
        <div v-if="filteredOwners.length > 0">
          <div v-for="owner in filteredOwners" :key="owner.id" class="mobile-owner-card mb-3 p-3 border rounded shadow-sm">
            <div class="mobile-owner-top">
              <div class="mobile-owner-identity">
                <div class="avatar-circle me-2">{{ initials(owner) }}</div>
                <div class="mobile-owner-copy">
                  <h6 class="fw-bold mb-1">{{ owner.first_name }} {{ owner.last_name }}</h6>
                  <small class="text-muted owner-email">{{ owner.email }}</small>
                </div>
              </div>
              <span class="badge-modern mobile-status-badge" :class="normalizeVerificationStatus(owner)">{{ verificationLabel(owner) }}</span>
            </div>

            <div class="mobile-owner-meta">
              <small class="text-muted">Joined: {{ owner.created_at }}</small>
            </div>

            <div class="mobile-owner-actions">
              <div class="d-flex flex-wrap gap-2">
                <button class="btn-mobile-icon view" @click="openOwnerModal(owner)"><i class="bi bi-eye"></i></button>
                <button
                  class="btn-mobile-icon notify"
                  :disabled="isActionLoading"
                  @click="openNotifyOwnerModal(owner)"
                >
                  <i class="bi bi-bell"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5">
          <p class="text-muted">No owners found.</p>
        </div>
      </div>
    </div>

    <div v-if="showOwnerModal && selectedOwner" class="modal-overlay-custom" @click.self="closeOwnerModal">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Owner Details</h5>
          <button class="btn-close" @click="closeOwnerModal"></button>
        </div>

        <div class="row g-3">
          <div class="col-12">
            <div class="info-card border rounded p-3">
              <p class="fw-semibold small mb-2 text-uppercase text-muted">User Info</p>
              <p class="mb-1"><strong>Name:</strong> {{ selectedOwner.first_name }} {{ selectedOwner.last_name }}</p>
              <p class="mb-1"><strong>Email:</strong> {{ selectedOwner.email || "-" }}</p>
              <p class="mb-1"><strong>Phone:</strong> {{ selectedOwner.user_phone_number || "-" }}</p>
            </div>
          </div>

          <div class="col-12">
            <div class="info-card border rounded p-3">
              <div v-if="ownerValidIdUrl" class="id-review-card" :class="{ fullscreen: isIdPreviewFullscreen }">
                <div class="id-review-header">
                  <div>
                    <p class="fw-semibold small mb-0 text-uppercase text-muted">Valid ID</p>
                    <small class="text-muted">Review the uploaded owner ID here before verifying.</small>
                  </div>
                  <div class="id-review-controls">
                    <button type="button" class="btn btn-sm btn-light border" @click="zoomIdPreview(-25)" title="Zoom out">
                      <i class="bi bi-zoom-out"></i>
                    </button>
                    <span class="id-zoom-label">{{ idPreviewZoom }}%</span>
                    <button type="button" class="btn btn-sm btn-light border" @click="zoomIdPreview(25)" title="Zoom in">
                      <i class="bi bi-zoom-in"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="toggleIdPreviewFullscreen">
                      <i :class="isIdPreviewFullscreen ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'"></i>
                      {{ isIdPreviewFullscreen ? "Exit" : "Full Screen" }}
                    </button>
                  </div>
                </div>

                <div class="id-preview-frame">
                  <img
                    v-if="isOwnerValidIdImage"
                    :src="ownerValidIdUrl"
                    alt="Owner valid ID"
                    class="id-preview-image"
                    :style="{ width: idPreviewZoom + '%' }"
                  >
                  <iframe
                    v-else
                    :src="ownerValidIdUrl"
                    title="Owner valid ID preview"
                    class="id-preview-document"
                    :style="{ zoom: idPreviewScale }"
                  ></iframe>
                </div>
              </div>
              <small v-else class="text-muted">No uploaded user valid ID</small>
            </div>
          </div>

          <div class="col-12">
            <div class="info-card border rounded p-3">
              <p class="fw-semibold small mb-2 text-uppercase text-muted">Owner Info</p>
              <p class="mb-1"><strong>Verification:</strong> {{ verificationLabel(selectedOwner) }}</p>
              <p v-if="selectedOwner.owner_phone_number || selectedOwner.phone_number" class="mb-1"><strong>Owner Phone:</strong> {{ selectedOwner.owner_phone_number || selectedOwner.phone_number }}</p>
              <p v-if="selectedOwner.owner_payment_type || selectedOwner.paymentType" class="mb-1"><strong>Payment Type:</strong> {{ selectedOwner.owner_payment_type || selectedOwner.paymentType }}</p>
              <p class="mb-1"><strong>Owner Status:</strong> {{ selectedOwner.owner_status || selectedOwner.status || "-" }}</p>
              <p class="mb-0"><strong>Rejected Reason:</strong> {{ selectedOwner.owner_verification_rejected_reason || "-" }}</p>
            </div>
          </div>

          <div class="col-12">
            <div class="info-card border rounded p-3">
              <p class="fw-semibold small mb-2 text-uppercase text-muted">Subscription Info</p>
              <template v-if="selectedOwner.subscription_info">
                <p class="mb-1"><strong>Plan:</strong> {{ selectedOwner.subscription_info.plan_name || "-" }}</p>
                <p class="mb-1"><strong>Amount:</strong> {{ formatCurrency(selectedOwner.subscription_info.amount) }}</p>
                <p class="mb-1"><strong>Billing Cycle:</strong> {{ selectedOwner.subscription_info.billing_cycle || "-" }}</p>
                <p class="mb-1"><strong>Status:</strong> {{ selectedOwner.subscription_info.status || "-" }}</p>
                <p class="mb-1"><strong>Start:</strong> {{ selectedOwner.subscription_info.start_date || "-" }}</p>
                <p class="mb-1"><strong>End:</strong> {{ selectedOwner.subscription_info.end_date || "-" }}</p>
                <p class="mb-0"><strong>Listing Limit:</strong> {{ selectedOwner.subscription_info.listing_limit ?? "-" }}</p>
              </template>
              <p v-else class="small text-muted mb-0">No subscription record found.</p>
            </div>
          </div>
        </div>

        <div class="owner-modal-actions d-flex flex-wrap gap-2 mt-4">
          <button
            v-if="normalizeVerificationStatus(selectedOwner) !== 'verified'"
            class="review-decision-btn approve"
            :disabled="isActionLoading"
            @click="openVerifyOwnerModal(selectedOwner)"
          >
            <span class="decision-icon"><i class="bi bi-check2-circle"></i></span>
            <span>
              <strong>Approve</strong>
              <small>Mark this owner as verified</small>
            </span>
          </button>
          <button
            v-if="normalizeVerificationStatus(selectedOwner) !== 'verified' && normalizeVerificationStatus(selectedOwner) !== 'rejected'"
            class="review-decision-btn reject"
            :disabled="isActionLoading"
            @click="openRejectOwnerModal(selectedOwner)"
          >
            <span class="decision-icon"><i class="bi bi-x-circle"></i></span>
            <span>
              <strong>Reject</strong>
              <small>Decline owner verification</small>
            </span>
          </button>
        </div>
      </div>
    </div>

    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :confirm-text="confirmConfig.confirmText"
      :variant="confirmConfig.variant"
      :loading="isActionLoading"
      :show-input="confirmConfig.showInput"
      :input-label="confirmConfig.inputLabel"
      :input-placeholder="confirmConfig.inputPlaceholder"
      :input-required="confirmConfig.inputRequired"
      :input-value="confirmInput"
      @update:inputValue="confirmInput = $event"
      @cancel="closeConfirmModal"
      @confirm="handleConfirmAction"
    />
  </div>
</template>

<script>
import ConfirmModal from "@/components/confirmModal.vue";
import {
  getOwner,
  getOwnerDetails,
  notifyOwner,
  verifyOwner,
  rejectOwnerVerification,
} from "@/api/Admin/AdminOwner/AdminOwner";

export default {
  name: "ownerList",
  components: {
    ConfirmModal,
  },
  data() {
    return {
      search: "",
      filterStatus: "",
      owners: [],
      showOwnerModal: false,
      idPreviewZoom: 100,
      isIdPreviewFullscreen: false,
      selectedOwner: null,
      isActionLoading: false,
      showConfirmModal: false,
      confirmInput: "",
      confirmConfig: {
        action: null,
        owner: null,
        title: "Confirm Action",
        message: "Are you sure you want to proceed?",
        confirmText: "Yes",
        variant: "success",
        showInput: false,
        inputLabel: "Reason",
        inputPlaceholder: "Type here...",
        inputRequired: false,
      },
    };
  },
  computed: {
    filteredOwners() {
      return this.owners.filter((owner) => {
        const fullName = `${owner.first_name || ""} ${owner.last_name || ""}`.toLowerCase();
        const email = (owner.email || "").toLowerCase();
        const matchSearch =
          fullName.includes(this.search.toLowerCase()) ||
          email.includes(this.search.toLowerCase());
        const matchStatus =
          this.filterStatus === "" || this.normalizeVerificationStatus(owner) === this.filterStatus;
        return matchSearch && matchStatus;
      });
    },
    ownerValidIdUrl() {
      return this.selectedOwner?.user_valid_govt_id_url || this.validIdUrl(this.selectedOwner);
    },
    isOwnerValidIdImage() {
      const url = String(this.ownerValidIdUrl || "").split("?")[0].toLowerCase();
      return /\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(url);
    },
    idPreviewScale() {
      return this.idPreviewZoom / 100;
    },
  },
  methods: {
    normalizeVerificationStatus(owner) {
      const raw =
        owner?.owner_verification_status ??
        owner?.verification_status ??
        owner?.status ??
        "unverified";
      const status = String(raw).toLowerCase().trim();
      return ["verified", "pending", "rejected", "unverified"].includes(status) ? status : "unverified";
    },
    verificationLabel(owner) {
      const status = this.normalizeVerificationStatus(owner);
      if (status === "verified") return "Verified";
      if (status === "pending") return "Pending";
      if (status === "rejected") return "Rejected";
      return "Unverified";
    },
    initials(owner) {
      const first = String(owner?.first_name || "").charAt(0);
      const last = String(owner?.last_name || "").charAt(0);
      return `${first}${last}`.toUpperCase() || "OW";
    },
    permitUrl(owner) {
      return owner?.business_permit_url || owner?.permit_url || owner?.business_permit || null;
    },
    validIdUrl(owner) {
      return owner?.valid_id_url || owner?.government_id_url || owner?.valid_id || null;
    },
    formatCurrency(value) {
      const amount = Number(value ?? 0);
      if (!Number.isFinite(amount)) return "-";
      return `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    },
    resetFilter() {
      this.search = "";
      this.filterStatus = "";
    },
    async fetchOwners() {
      try {
        const res = await getOwner();
        const list = res?.data?.data || res?.data?.owners || [];
        this.owners = Array.isArray(list) ? list : [];
      } catch (error) {
        console.error("Error fetching owners:", error);
        this.owners = [];
      }
    },
    async openOwnerModal(owner) {
      this.selectedOwner = owner;
      this.showOwnerModal = true;
      this.idPreviewZoom = 100;
      this.isIdPreviewFullscreen = false;
      try {
        const res = await getOwnerDetails(owner.id);
        const payload = res?.data?.data || res?.data?.owner || null;
        if (payload) {
          this.selectedOwner = payload;
        }
      } catch (error) {
        console.warn("Owner details endpoint unavailable, using list row data.");
      }
    },
    closeOwnerModal() {
      this.showOwnerModal = false;
      this.selectedOwner = null;
      this.idPreviewZoom = 100;
      this.isIdPreviewFullscreen = false;
    },
    zoomIdPreview(amount) {
      this.idPreviewZoom = Math.min(200, Math.max(50, this.idPreviewZoom + amount));
    },
    toggleIdPreviewFullscreen() {
      this.isIdPreviewFullscreen = !this.isIdPreviewFullscreen;
    },
    openVerifyOwnerModal(owner) {
      this.confirmInput = "";
      this.confirmConfig = {
        action: "verify",
        owner,
        title: "Verify Owner",
        message: `Verify ${owner.first_name} ${owner.last_name} as owner?`,
        confirmText: "Verify",
        variant: "success",
        showInput: false,
        inputLabel: "Reason",
        inputPlaceholder: "Type here...",
        inputRequired: false,
      };
      this.showConfirmModal = true;
    },
    openRejectOwnerModal(owner) {
      this.confirmInput = "";
      this.confirmConfig = {
        action: "reject",
        owner,
        title: "Reject Owner Verification",
        message: `Reject verification for ${owner.first_name} ${owner.last_name}?`,
        confirmText: "Reject",
        variant: "danger",
        showInput: true,
        inputLabel: "Rejection Reason",
        inputPlaceholder: "Optional reason for rejection...",
        inputRequired: false,
      };
      this.showConfirmModal = true;
    },
    openNotifyOwnerModal(owner) {
      this.confirmInput = "";
      this.confirmConfig = {
        action: "notify",
        owner,
        title: "Notify Owner",
        message: `Send review feedback to ${owner.first_name} ${owner.last_name}?`,
        confirmText: "Send Notification",
        variant: "primary",
        showInput: true,
        inputLabel: "Message to Owner",
        inputPlaceholder: "Example: Please update your phone number to match your profile records.",
        inputRequired: true,
      };
      this.showConfirmModal = true;
    },
    closeConfirmModal() {
      if (this.isActionLoading) return;
      this.showConfirmModal = false;
      this.confirmInput = "";
    },
    async handleConfirmAction() {
      const owner = this.confirmConfig.owner;
      if (!owner || this.isActionLoading) return;

      this.isActionLoading = true;
      try {
        if (this.confirmConfig.action === "verify") {
          await verifyOwner(owner.id);
        } else if (this.confirmConfig.action === "notify") {
          if (!this.confirmInput.trim()) {
            alert("Please enter the feedback message for the owner.");
            this.isActionLoading = false;
            return;
          }
          await notifyOwner(owner.id, this.confirmInput.trim());
        } else {
          await rejectOwnerVerification(owner.id, this.confirmInput.trim());
        }

        this.isActionLoading = false;
        this.closeConfirmModal();
        await this.fetchOwners();
        if (this.selectedOwner?.id === owner.id) {
          await this.openOwnerModal(owner);
        }
      } catch (error) {
        alert(error?.response?.data?.message || "Failed to process owner verification action.");
      } finally {
        this.isActionLoading = false;
      }
    },
  },
  mounted() {
    this.fetchOwners();
  },
};
</script>

<style scoped>
.admin-view-container {
  min-height: 100vh;
  background:
    radial-gradient(circle at 0 0, rgba(226, 240, 255, 0.7), transparent 40%),
    radial-gradient(circle at 100% 0, rgba(240, 255, 244, 0.45), transparent 35%),
    #f6f8fc;
}

.data-card { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #e4eaf4; }

.card {
  border-radius: 14px;
  border: 1px solid #e3e9f3 !important;
}

.custom-admin-table thead th {
  background-color: #f1f4f9;
  border: none;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #5c677d;
  padding: 15px;
  font-weight: 700;
}
.custom-admin-table tbody td { padding: 15px; border-bottom: 1px solid #f1f4f9; }

.badge-modern {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.badge-modern.verified { background: #e6fcf5; color: #0ca678; }
.badge-modern.pending { background: #fff9db; color: #b08900; }
.badge-modern.unverified { background: #f1f3f5; color: #495057; }
.badge-modern.rejected { background: #fff5f5; color: #fa5252; }

.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-action.view { background: #e7f5ff; color: #228be6; }
.btn-action.notify { background: #eef2ff; color: #4f46e5; }
.btn-action.approve { background: #ebfbee; color: #40c057; }
.btn-action.reject { background: #fff5f5; color: #fa5252; }
.btn-action:hover { transform: translateY(-2px); filter: brightness(0.95); }

.mobile-list-shell {
  padding-inline: 0.25rem;
}

.mobile-owner-card {
  background: white;
  border-color: #e8edf5 !important;
  border-radius: 16px !important;
}

.mobile-owner-top {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.mobile-owner-identity {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
}

.mobile-owner-copy {
  min-width: 0;
}

.owner-email {
  display: block;
  overflow-wrap: anywhere;
}

.mobile-status-badge {
  align-self: flex-start;
}

.mobile-owner-meta {
  margin-top: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eef2f7;
}

.mobile-owner-actions {
  margin-top: 0.85rem;
}

.btn-mobile-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-mobile-icon.view { background: #e7f5ff; color: #228be6; }
.btn-mobile-icon.notify { background: #eef2ff; color: #4f46e5; }
.btn-mobile-icon.approve { background: #198754; color: white; }
.btn-mobile-icon.reject { background: #dc3545; color: white; }

.info-card p {
  font-size: 0.9rem;
}

.avatar-circle {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #475569, #64748b);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.modal-overlay-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-body-custom {
  background: white;
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
}

.info-card {
  overflow-wrap: anywhere;
}

.id-review-card {
  background: #ffffff;
}

.id-review-card.fullscreen {
  position: fixed;
  inset: 1rem;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #e4eaf4;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.28);
}

.id-review-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 0.85rem;
}

.id-review-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.45rem;
}

.id-zoom-label {
  min-width: 48px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4f5d75;
}

.id-preview-frame {
  height: 360px;
  overflow: auto;
  border: 1px solid #e4eaf4;
  border-radius: 10px;
  background: #f8fafc;
}

.id-review-card.fullscreen .id-preview-frame {
  flex: 1;
  height: auto;
}

.id-preview-image {
  display: block;
  max-width: none;
  margin: 0 auto;
  transform-origin: top center;
}

.id-preview-document {
  width: 100%;
  height: 620px;
  border: 0;
  transform-origin: top left;
}

.id-review-card.fullscreen .id-preview-document {
  height: 100%;
  min-height: 720px;
}

.owner-modal-actions {
  padding: 0.85rem;
  border: 1px solid #e4eaf4;
  border-radius: 14px;
  background: #f8fafc;
}

.review-decision-btn {
  flex: 1 1 220px;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 64px;
  padding: 0.85rem 1rem;
  border: 1px solid transparent;
  border-radius: 12px;
  text-align: left;
  transition: all 0.2s ease;
}

.review-decision-btn strong,
.review-decision-btn small {
  display: block;
  line-height: 1.2;
}

.review-decision-btn strong {
  font-size: 0.95rem;
}

.review-decision-btn small {
  margin-top: 0.18rem;
  font-size: 0.76rem;
  font-weight: 600;
  opacity: 0.82;
}

.review-decision-btn.approve {
  background: #e6fcf5;
  border-color: #b2f2dc;
  color: #087f5b;
}

.review-decision-btn.reject {
  background: #fff5f5;
  border-color: #ffc9c9;
  color: #c92a2a;
}

.review-decision-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.review-decision-btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.review-decision-btn:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.25);
  outline-offset: 2px;
}

.decision-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  font-size: 1.25rem;
  background: rgba(255, 255, 255, 0.72);
}

@media (max-width: 991.98px) {
  .page-top {
    margin-bottom: 1rem !important;
  }

  .refresh-btn {
    width: 100%;
  }

  .filter-shell {
    padding: 0.35rem !important;
  }
}

@media (max-width: 767.98px) {
  .admin-view-container {
    padding-inline: 0.75rem !important;
  }

  .mobile-list-shell {
    padding: 0.75rem !important;
  }

  .mobile-owner-card {
    padding: 1rem !important;
  }

  .btn-mobile-icon {
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

  .owner-modal-actions {
    flex-direction: column;
  }

  .review-decision-btn {
    width: 100%;
    justify-content: center;
  }

  .id-review-card.fullscreen {
    inset: 0.5rem;
  }

  .id-review-header {
    flex-direction: column;
  }

  .id-review-controls,
  .id-review-controls .btn {
    width: 100%;
  }

  .id-preview-frame {
    height: 300px;
  }
}
</style>
