<template>
  <div class="admin-view-container p-3 p-md-4">
    <div class="page-top d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold text-dark mb-1">User Management</h3>
        <p class="text-muted small mb-0">Monitor tenant profiles and location data.</p>
      </div>
      <button class="btn btn-outline-secondary shadow-sm px-4 refresh-btn" @click="getUsers">
        <i class="bi bi-arrow-repeat me-2"></i>Refresh
      </button>
    </div>

    <div class="card shadow-sm border-0 mb-4 overflow-hidden filter-shell">
      <div class="card-body bg-white">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input
                v-model="search"
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Search by name or email..."
              />
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="filterStatus" class="form-select">
              <option value="all">All Verification</option>
              <option value="pending">Pending Review</option>
              <option value="verified">Verified Users</option>
              <option value="rejected">Rejected Users</option>
              <option value="unverified">Unverified Users</option>
            </select>
          </div>
          <div class="col-md-3 text-md-end">
            <button class="btn btn-light border text-secondary w-100 w-md-auto" @click="resetFilter">
              <i class="bi bi-arrow-clockwise me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="data-card shadow-sm">
      <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <span class="fw-bold text-dark">All Users</span>
        <span class="badge bg-primary-subtle text-primary border border-primary-subtle">{{ users.length }} result(s)</span>
      </div>

      <div class="table-responsive d-none d-lg-block">
        <table class="table align-middle custom-admin-table mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Location (Muni/Brgy)</th>
              <th>Joined Date</th>
              <th>Profile</th>
              <th>Verification</th>
              <th class="text-end px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredUsers.length > 0">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td class="text-muted small fw-bold">#{{ user.id }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <img 
                      :src="user.user_img_url || 'https://ui-avatars.com/api/?name=' + user.first_name + '+' + user.last_name" 
                      alt="User image" 
                      class="user-img-sm me-2"
                    >
                    <div class="d-flex flex-column">
                      <span class="fw-semibold text-dark">{{ user.first_name }} {{ user.last_name }}</span>
                      <small class="text-muted" style="font-size: 0.7rem;">{{ user.village_name || 'No Barangay' }}</small>
                    </div>
                  </div>
                </td>
                <td class="small">{{ user.email || 'N/A' }}</td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="small text-dark">{{ user.town_name || 'N/A' }}</span>
                    <small class="text-muted" style="font-size: 0.7rem;">{{ user.state_name }}</small>
                  </div>
                </td>
                <td class="text-muted small">{{ user.created_at }}</td>
                <td>
                  <span class="badge-modern" :class="user.isComplete ? 'complete' : 'incomplete'">
                    {{ user.isComplete ? 'Complete' : 'Incomplete' }}
                  </span>
                </td>
                <td>
                  <span class="badge-modern" :class="verificationBadgeClass(user.user_verification_status)">
                    {{ verificationLabel(user.user_verification_status) }}
                  </span>
                </td>
                <td class="text-end px-4">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn-action review" title="Review User" @click="openUserModal(user)">
                      <i class="bi bi-eye"></i>
                      <span>Review</span>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="8" class="text-center py-5">
                <i class="bi bi-person-x fs-1 text-muted opacity-25"></i>
                <p class="text-muted mt-2">No users found.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-lg-none p-3 mobile-list-shell">
        <div v-if="filteredUsers.length > 0">
          <div v-for="user in filteredUsers" :key="user.id" class="mobile-user-card mb-3 p-3 border rounded shadow-sm">
            <div class="mobile-user-top">
              <div class="mobile-user-identity">
                <img :src="user.user_img_url || 'https://ui-avatars.com/api/?name=' + user.first_name" class="user-img-sm me-2">
                <div class="mobile-user-copy">
                  <h6 class="fw-bold mb-1 text-dark">{{ user.first_name }} {{ user.last_name }}</h6>
                  <small class="text-muted user-email">{{ user.email || 'N/A' }}</small>
                </div>
              </div>
              <span class="badge-modern mobile-profile-badge" :class="user.isComplete ? 'complete' : 'incomplete'">
                {{ user.isComplete ? 'Done' : 'Pending' }}
              </span>
            </div>
            
            <div class="mobile-user-details small text-muted">
              <div class="mobile-detail-line">
                <i class="bi bi-geo-alt me-2"></i>
                <span class="detail-text">{{ user.town_name || 'N/A' }}, {{ user.state_name || 'N/A' }}</span>
              </div>
              <div class="mobile-detail-line">
                <i class="bi bi-patch-check me-2"></i>
                <span class="badge-modern mobile-verification-badge" :class="verificationBadgeClass(user.user_verification_status)">
                  {{ verificationLabel(user.user_verification_status) }}
                </span>
              </div>
            </div>

            <div class="mobile-user-meta">
              <span class="small text-muted">ID: #{{ user.id }}</span>
              <span class="small text-muted">Joined: {{ user.created_at }}</span>
            </div>

            <div class="mobile-user-actions">
              <div class="d-flex flex-wrap gap-2">
                <button class="btn-mobile-icon review" @click="openUserModal(user)">
                  <i class="bi bi-eye"></i>
                  <span>Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showUserModal" class="modal-overlay-custom" @click.self="closeUserModal">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">User Details</h5>
          <button class="btn-close" @click="closeUserModal"></button>
        </div>

        <div v-if="isUserDetailsLoading" class="py-4 text-center text-muted">
          Loading user details...
        </div>

        <div v-else-if="userDetailsError" class="alert alert-danger mb-0">
          {{ userDetailsError }}
        </div>

        <div v-else-if="selectedUserDetails">
          <div class="d-flex align-items-center mb-3">
            <img
              :src="selectedUserDetails.user_img_url || avatarFallback(selectedUserDetails)"
              alt="User image"
              class="user-img-lg me-3"
            >
            <div>
              <h6 class="fw-bold mb-1">{{ selectedUserDetails.first_name }} {{ selectedUserDetails.last_name }}</h6>
              <p class="mb-0 text-muted small">{{ selectedUserDetails.email || "N/A" }}</p>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-12 col-md-6">
              <div class="border rounded p-3 h-100">
                <p class="mb-1"><strong>User ID:</strong> #{{ selectedUserDetails.id }}</p>
                <p class="mb-1"><strong>Role:</strong> <span class="text-capitalize">{{ selectedUserDetails.role || "-" }}</span></p>
                <p class="mb-1"><strong>Phone:</strong> {{ selectedUserDetails.phone_number || "-" }}</p>
                <p class="mb-0">
                  <strong>Profile:</strong>
                  <span :class="selectedUserDetails.isComplete ? 'text-success' : 'text-danger'">
                    {{ selectedUserDetails.isComplete ? "Complete" : "Incomplete" }}
                  </span>
                </p>
                <p class="mb-0 mt-1">
                  <strong>Verification:</strong>
                  <span class="ms-1 badge-modern" :class="verificationBadgeClass(selectedUserDetails.user_verification_status)">
                    {{ verificationLabel(selectedUserDetails.user_verification_status) }}
                  </span>
                </p>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="border rounded p-3 h-100">
                <p class="mb-1">
                  <strong>Email Verified:</strong>
                  <span :class="selectedUserDetails.email_verified_at ? 'text-success' : 'text-danger'">
                    {{ selectedUserDetails.email_verified_at ? "Yes" : "No" }}
                  </span>
                </p>
                <p class="mb-1"><strong>Joined:</strong> {{ selectedUserDetails.created_at || "-" }}</p>
                <p class="mb-0"><strong>Last Updated:</strong> {{ selectedUserDetails.updated_at || "-" }}</p>
              </div>
            </div>

            <div class="col-12">
              <div class="border rounded p-3">
                <p class="mb-2"><strong>Address</strong></p>
                <p class="mb-1">{{ selectedUserDetails.streets || "-" }}</p>
                <p class="mb-1">{{ selectedUserDetails.village_name || "-" }}</p>
                <p class="mb-1">{{ selectedUserDetails.town_name || "-" }}</p>
                <p class="mb-0">{{ selectedUserDetails.state_name || "-" }}, {{ selectedUserDetails.region_name || "-" }}</p>
              </div>
            </div>

            <div class="col-12">
              <div class="border rounded p-3">
                <p class="mb-1"><strong>Coordinates</strong></p>
                <p class="mb-0">Lat: {{ selectedUserDetails.latitude ?? "-" }}, Lng: {{ selectedUserDetails.longitude ?? "-" }}</p>
              </div>
            </div>
            <div class="col-12" v-if="selectedUserDetails.user_valid_govt_id_url">
              <div class="id-review-card border rounded p-3" :class="{ fullscreen: isIdPreviewFullscreen }">
                <div class="id-review-header">
                  <div>
                    <p class="mb-0"><strong>Submitted Government ID</strong></p>
                    <small class="text-muted">Review the uploaded ID here before approving or rejecting.</small>
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
                    v-if="isUploadedIdImage"
                    :src="selectedUserDetails.user_valid_govt_id_url"
                    alt="Submitted government ID"
                    class="id-preview-image"
                    :style="{ width: idPreviewZoom + '%' }"
                  >
                  <iframe
                    v-else
                    :src="selectedUserDetails.user_valid_govt_id_url"
                    title="Submitted government ID preview"
                    class="id-preview-document"
                    :style="{ zoom: idPreviewScale }"
                  ></iframe>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="selectedUserDetails.user_verification_status === 'pending'">
              <div class="user-modal-actions d-flex flex-wrap gap-2">
                <button class="review-decision-btn approve" @click="openVerifyUserModal(selectedUserDetails)">
                  <span class="decision-icon"><i class="bi bi-check2-circle"></i></span>
                  <span>
                    <strong>Approve</strong>
                    <small>Mark this user as verified</small>
                  </span>
                </button>
                <button class="review-decision-btn reject" @click="openRejectUserModal(selectedUserDetails)">
                  <span class="decision-icon"><i class="bi bi-x-circle"></i></span>
                  <span>
                    <strong>Reject</strong>
                    <small>Request a better verification ID</small>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <confirmModal
      :show="showConfirmModal"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :confirm-text="confirmConfig.confirmText"
      :variant="confirmConfig.variant"
      :show-input="confirmConfig.showInput"
      :input-label="confirmConfig.inputLabel"
      :input-placeholder="confirmConfig.inputPlaceholder"
      :input-required="confirmConfig.inputRequired"
      :input-value="confirmInput"
      :loading="isActionLoading"
      @update:inputValue="confirmInput = $event"
      @confirm="handleConfirmAction"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script>
import {
  getUserVerifications,
  getUserVerificationDetails,
  updateUserVerification,
} from '@/api/Admin/AdminUser/AdminUser';
import confirmModal from "@/components/confirmModal.vue";

export default {
  name: "tenantsList",
  components: { confirmModal },
  data() {
    return {
      search: "",
      filterStatus: "all",
      users: [],
      showUserModal: false,
      selectedUserDetails: null,
      isUserDetailsLoading: false,
      userDetailsError: "",
      showConfirmModal: false,
      confirmConfig: {
        action: "",
        user: null,
        title: "Confirm Action",
        message: "",
        confirmText: "Confirm",
        variant: "success",
        showInput: false,
        inputLabel: "Reason",
        inputPlaceholder: "Type here...",
        inputRequired: false,
      },
      confirmInput: "",
      isActionLoading: false,
      idPreviewZoom: 100,
      isIdPreviewFullscreen: false,
    };
  },
  computed: {
    filteredUsers() {
      if (!this.users) return [];
      return this.users.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return (
          fullName.includes(this.search.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(this.search.toLowerCase()))
        );
      });
    },
    isUploadedIdImage() {
      const url = String(this.selectedUserDetails?.user_valid_govt_id_url || "").split("?")[0].toLowerCase();
      return /\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(url);
    },
    idPreviewScale() {
      return this.idPreviewZoom / 100;
    },
  },
  methods: {
    resetFilter() {
      this.search = "";
      this.filterStatus = "all";
      this.getUsers();
    },
    async getUsers() {
      try {
        const res = await getUserVerifications(this.filterStatus);
        this.users = res.data.data || res.data;
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    },
    async getToggleUserStatus(status) {
      try {
        const res = await getUserVerifications(status);
        this.users = res.data.data || res.data;
      } catch (error) {
        console.error("Filter Error:", error);
      }
    },
    verificationLabel(statusRaw) {
      const status = String(statusRaw || "unverified").toLowerCase().trim();
      if (status === "verified") return "Verified";
      if (status === "pending") return "Pending";
      if (status === "rejected") return "Rejected";
      return "Unverified";
    },
    verificationBadgeClass(statusRaw) {
      const status = String(statusRaw || "unverified").toLowerCase().trim();
      if (status === "verified") return "complete";
      if (status === "pending") return "pending";
      if (status === "rejected") return "incomplete";
      return "neutral";
    },
    openVerifyUserModal(user) {
      this.confirmInput = "";
      this.confirmConfig = {
        action: "verify",
        user,
        title: "Verify User",
        message: `Verify ${user.first_name} ${user.last_name}?`,
        confirmText: "Verify",
        variant: "success",
        showInput: false,
        inputLabel: "Reason",
        inputPlaceholder: "Type here...",
        inputRequired: false,
      };
      this.showConfirmModal = true;
    },
    openRejectUserModal(user) {
      this.confirmInput = "";
      this.confirmConfig = {
        action: "reject",
        user,
        title: "Reject Verification",
        message: `Reject verification for ${user.first_name} ${user.last_name}?`,
        confirmText: "Reject",
        variant: "danger",
        showInput: true,
        inputLabel: "Rejection Reason",
        inputPlaceholder: "Provide a reason for rejection...",
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
      const user = this.confirmConfig.user;
      if (!user || this.isActionLoading) return;

      this.isActionLoading = true;
      try {
        const status = this.confirmConfig.action === "verify" ? "verified" : "rejected";
        await updateUserVerification(user.id, status, this.confirmInput.trim());
        this.isActionLoading = false;
        this.closeConfirmModal();
        await this.getToggleUserStatus(this.filterStatus);
        if (this.showUserModal && this.selectedUserDetails?.id === user.id) {
          const detailsRes = await getUserVerificationDetails(user.id);
          this.selectedUserDetails = detailsRes?.data?.data || null;
        }
      } catch (error) {
        alert(error?.response?.data?.message || "Failed to update verification status.");
      } finally {
        this.isActionLoading = false;
      }
    },
    avatarFallback(user) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || "") + " " + (user?.last_name || ""))}`;
    },
    zoomIdPreview(amount) {
      this.idPreviewZoom = Math.min(200, Math.max(50, this.idPreviewZoom + amount));
    },
    toggleIdPreviewFullscreen() {
      this.isIdPreviewFullscreen = !this.isIdPreviewFullscreen;
    },
    async openUserModal(user) {
      this.showUserModal = true;
      this.selectedUserDetails = null;
      this.userDetailsError = "";
      this.isUserDetailsLoading = true;
      this.idPreviewZoom = 100;
      this.isIdPreviewFullscreen = false;

      try {
        const res = await getUserVerificationDetails(user.id);
        if (res && res.status >= 200 && res.status < 300) {
          this.selectedUserDetails = res.data?.data || null;
        } else {
          this.userDetailsError = res?.data?.message || "Failed to load user details.";
        }
      } catch (error) {
        this.userDetailsError = "Failed to load user details.";
      } finally {
        this.isUserDetailsLoading = false;
      }
    },
    closeUserModal() {
      this.showUserModal = false;
      this.selectedUserDetails = null;
      this.userDetailsError = "";
      this.idPreviewZoom = 100;
      this.isIdPreviewFullscreen = false;
    },
  },
  mounted() {
    this.getUsers();
  },
  watch: {
    filterStatus(newVal) {
      this.getToggleUserStatus(newVal);
    },
  }
};
</script>

<style scoped>
.admin-view-container {
  min-height: 100vh;
  background:
    radial-gradient(circle at 0 0, rgba(226, 240, 255, 0.7), transparent 40%),
    radial-gradient(circle at 100% 0, rgba(255, 244, 231, 0.45), transparent 35%),
    #f6f8fc;
}

.data-card { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #e4eaf4; }

.card {
  border-radius: 14px;
  border: 1px solid #e3e9f3 !important;
}

/* Desktop Table Styling */
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

/* Status Badges */
.badge-modern {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.badge-modern.complete { background: #e6fcf5; color: #0ca678; }
.badge-modern.incomplete { background: #fff5f5; color: #fa5252; }
.badge-modern.pending { background: #fff9db; color: #e67700; }
.badge-modern.neutral { background: #f1f3f5; color: #495057; }

/* Action Buttons */
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
.btn-action.review {
  width: auto;
  min-width: 88px;
  gap: 0.35rem;
  padding: 0 12px;
  background: #e7f5ff;
  color: #228be6;
  font-size: 0.8rem;
  font-weight: 700;
}
.btn-action:hover { transform: translateY(-1px); }

/* Mobile Card Styling */
.mobile-list-shell {
  padding-inline: 0.25rem;
}

.mobile-user-card {
  background: white;
  border-color: #e8edf5 !important;
  border-radius: 16px !important;
}

.user-img-sm { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

.mobile-user-top {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.mobile-user-identity {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
}

.mobile-user-copy {
  min-width: 0;
}

.user-email,
.detail-text {
  display: block;
  overflow-wrap: anywhere;
}

.mobile-profile-badge {
  align-self: flex-start;
}

.mobile-user-details {
  display: grid;
  gap: 0.6rem;
  margin-top: 0.9rem;
}

.mobile-detail-line {
  display: flex;
  align-items: flex-start;
}

.mobile-verification-badge {
  display: inline-flex;
  align-items: center;
}

.mobile-user-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eef2f7;
}

.mobile-user-actions {
  margin-top: 0.85rem;
}

.btn-mobile-icon {
  width: auto;
  min-width: 92px;
  height: 36px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0 12px;
  font-size: 0.85rem;
  font-weight: 700;
}
.btn-mobile-icon.review { background: #e7f5ff; color: #228be6; }

.modal-overlay-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-body-custom {
  background: #fff;
  width: 92%;
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-body-custom .border.rounded {
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

.user-modal-actions {
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

.review-decision-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
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

.user-img-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

@media (max-width: 991.98px) {
  .page-top {
    margin-bottom: 1rem !important;
  }

  .refresh-btn {
    width: 100%;
  }

  .filter-shell .card-body {
    padding: 1rem;
  }
}

@media (max-width: 767.98px) {
  .admin-view-container {
    padding-inline: 0.75rem !important;
  }

  .mobile-list-shell {
    padding: 0.75rem !important;
  }

  .mobile-user-card {
    padding: 1rem !important;
  }

  .btn-mobile-icon {
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

  .user-modal-actions {
    flex-direction: column;
  }

  .review-decision-btn {
    width: 100%;
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
