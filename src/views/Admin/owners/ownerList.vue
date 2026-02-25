<template>
  <div class="admin-view-container p-3 p-md-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold text-dark mb-1">Owner Verification</h3>
        <p class="text-muted small mb-0">Review owner documents and approve or reject verification.</p>
      </div>
      <button class="btn btn-outline-secondary px-4 shadow-sm" @click="fetchOwners">
        <i class="bi bi-arrow-repeat me-2"></i>Refresh
      </button>
    </div>

    <div class="card shadow-sm border-0 mb-4 p-2">
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
                      class="btn-action approve"
                      title="Verify Owner"
                      :disabled="isActionLoading || normalizeVerificationStatus(owner) === 'verified'"
                      @click="verifyOwnerAction(owner)"
                    >
                      <i class="bi bi-patch-check"></i>
                    </button>
                    <button
                      class="btn-action reject"
                      title="Reject Verification"
                      :disabled="isActionLoading || normalizeVerificationStatus(owner) === 'rejected'"
                      @click="rejectOwnerAction(owner)"
                    >
                      <i class="bi bi-x-circle"></i>
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

      <div class="d-lg-none p-3">
        <div v-if="filteredOwners.length > 0">
          <div v-for="owner in filteredOwners" :key="owner.id" class="mobile-owner-card mb-3 p-3 border rounded shadow-sm">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div class="d-flex align-items-center">
                <div class="avatar-circle me-2">{{ initials(owner) }}</div>
                <div>
                  <h6 class="fw-bold mb-0">{{ owner.first_name }} {{ owner.last_name }}</h6>
                  <small class="text-muted">{{ owner.email }}</small>
                </div>
              </div>
              <span class="badge-modern" :class="normalizeVerificationStatus(owner)">{{ verificationLabel(owner) }}</span>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <small class="text-muted">Joined: {{ owner.created_at }}</small>
              <div class="d-flex gap-2">
                <button class="btn-mobile-icon view" @click="openOwnerModal(owner)"><i class="bi bi-eye"></i></button>
                <button
                  class="btn-mobile-icon approve"
                  :disabled="isActionLoading || normalizeVerificationStatus(owner) === 'verified'"
                  @click="verifyOwnerAction(owner)"
                >
                  <i class="bi bi-patch-check"></i>
                </button>
                <button
                  class="btn-mobile-icon reject"
                  :disabled="isActionLoading || normalizeVerificationStatus(owner) === 'rejected'"
                  @click="rejectOwnerAction(owner)"
                >
                  <i class="bi bi-x-circle"></i>
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

        <div class="mb-3">
          <p class="mb-1"><strong>Name:</strong> {{ selectedOwner.first_name }} {{ selectedOwner.last_name }}</p>
          <p class="mb-1"><strong>Email:</strong> {{ selectedOwner.email }}</p>
          <p class="mb-0"><strong>Verification:</strong> {{ verificationLabel(selectedOwner) }}</p>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-6">
            <div class="border rounded p-3 h-100">
              <p class="fw-semibold small mb-2">Business Permit</p>
              <a
                v-if="permitUrl(selectedOwner)"
                class="btn btn-sm btn-outline-primary"
                :href="permitUrl(selectedOwner)"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
              <p v-else class="small text-muted mb-0">No permit uploaded.</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="border rounded p-3 h-100">
              <p class="fw-semibold small mb-2">Government ID</p>
              <a
                v-if="validIdUrl(selectedOwner)"
                class="btn btn-sm btn-outline-primary"
                :href="validIdUrl(selectedOwner)"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
              <p v-else class="small text-muted mb-0">No government ID uploaded.</p>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button
            class="btn btn-success"
            :disabled="isActionLoading || normalizeVerificationStatus(selectedOwner) === 'verified'"
            @click="verifyOwnerAction(selectedOwner)"
          >
            <i class="bi bi-patch-check me-1"></i> Verify
          </button>
          <button
            class="btn btn-outline-danger"
            :disabled="isActionLoading || normalizeVerificationStatus(selectedOwner) === 'rejected'"
            @click="rejectOwnerAction(selectedOwner)"
          >
            <i class="bi bi-x-circle me-1"></i> Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOwner,
  getOwnerDetails,
  verifyOwner,
  rejectOwnerVerification,
} from "@/api/Admin/AdminOwner/AdminOwner";

export default {
  name: "ownerList",
  data() {
    return {
      search: "",
      filterStatus: "",
      owners: [],
      showOwnerModal: false,
      selectedOwner: null,
      isActionLoading: false,
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
    },
    async verifyOwnerAction(owner) {
      const confirmed = confirm(`Verify ${owner.first_name} ${owner.last_name} as owner?`);
      if (!confirmed) return;

      this.isActionLoading = true;
      try {
        await verifyOwner(owner.id);
        await this.fetchOwners();
        if (this.selectedOwner?.id === owner.id) {
          await this.openOwnerModal(owner);
        }
      } catch (error) {
        alert(error?.response?.data?.message || "Failed to verify owner.");
      } finally {
        this.isActionLoading = false;
      }
    },
    async rejectOwnerAction(owner) {
      const reason = prompt("Optional rejection reason:", "") || "";
      const confirmed = confirm(`Reject verification for ${owner.first_name} ${owner.last_name}?`);
      if (!confirmed) return;

      this.isActionLoading = true;
      try {
        await rejectOwnerVerification(owner.id, reason);
        await this.fetchOwners();
        if (this.selectedOwner?.id === owner.id) {
          await this.openOwnerModal(owner);
        }
      } catch (error) {
        alert(error?.response?.data?.message || "Failed to reject owner verification.");
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
.admin-view-container { background-color: #f8f9fa; min-height: 100vh; }
.data-card { background: white; border-radius: 12px; overflow: hidden; }

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
.btn-action.approve { background: #ebfbee; color: #40c057; }
.btn-action.reject { background: #fff5f5; color: #fa5252; }
.btn-action:hover { transform: translateY(-2px); filter: brightness(0.95); }

.mobile-owner-card { background: white; }
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
.btn-mobile-icon.approve { background: #198754; color: white; }
.btn-mobile-icon.reject { background: #dc3545; color: white; }

.avatar-circle {
  width: 35px;
  height: 35px;
  background: #6c757d;
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
</style>
