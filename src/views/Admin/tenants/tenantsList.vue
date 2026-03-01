<template>
  <div class="admin-view-container p-3 p-md-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold text-dark mb-1">User Management</h3>
        <p class="text-muted small mb-0">Monitor tenant profiles and location data.</p>
      </div>
      <button class="btn btn-primary shadow-sm px-4">
        <i class="bi bi-download me-2"></i>Export List
      </button>
    </div>

    <div class="card shadow-sm border-0 mb-4 overflow-hidden">
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
              <option value="all">All Status</option>
              <option value="complete">Complete Profile</option>
              <option value="incomplete">Incomplete Profile</option>
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
                <td class="text-end px-4">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn-action view" title="View Details" @click="openUserModal(user)"><i class="bi bi-eye"></i></button>
                    <button 
                      class="btn-action" 
                      :class="user.isComplete ? 'approve' : 'reject'"
                      title="Profile Status"
                    >
                      <i :class="user.isComplete ? 'bi bi-patch-check' : 'bi bi-exclamation-circle'"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="7" class="text-center py-5">
                <i class="bi bi-person-x fs-1 text-muted opacity-25"></i>
                <p class="text-muted mt-2">No users found.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-lg-none p-3">
        <div v-if="filteredUsers.length > 0">
          <div v-for="user in filteredUsers" :key="user.id" class="mobile-user-card mb-3 p-3 border rounded shadow-sm">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center">
                <img :src="user.user_img_url || 'https://ui-avatars.com/api/?name=' + user.first_name" class="user-img-sm me-2">
                <h6 class="fw-bold mb-0 text-dark">{{ user.first_name }} {{ user.last_name }}</h6>
              </div>
              <span class="badge-modern" :class="user.isComplete ? 'complete' : 'incomplete'">
                {{ user.isComplete ? 'Done' : 'Pending' }}
              </span>
            </div>
            
            <div class="small text-muted mb-2">
              <div><i class="bi bi-envelope me-2"></i>{{ user.email }}</div>
              <div><i class="bi bi-geo-alt me-2"></i>{{ user.town_name }}, {{ user.state_name }}</div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <span class="small text-muted">ID: #{{ user.id }}</span>
              <div class="d-flex gap-2">
                <button class="btn-mobile-icon view" @click="openUserModal(user)"><i class="bi bi-eye"></i></button>
                <button class="btn-mobile-icon" :class="user.isComplete ? 'approve' : 'reject'"><i class="bi bi-shield-check"></i></button>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers, getUserByStatus, getUserDetails } from '@/api/Admin/AdminUser/AdminUser';

export default {
  name: "tenantsList",
  data() {
    return {
      search: "",
      filterStatus: "all",
      users: [],
      showUserModal: false,
      selectedUserDetails: null,
      isUserDetailsLoading: false,
      userDetailsError: "",
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
  },
  methods: {
    resetFilter() {
      this.search = "";
      this.filterStatus = "all";
      this.getUsers();
    },
    async getUsers() {
      try {
        const res = await getUsers();
        this.users = res.data.data || res.data;
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    },
    async getToggleUserStatus(status) {
      try {
        let res = status === "all" ? await getUsers() : await getUserByStatus(status);
        this.users = res.data.data || res.data;
      } catch (error) {
        console.error("Filter Error:", error);
      }
    },
    avatarFallback(user) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || "") + " " + (user?.last_name || ""))}`;
    },
    async openUserModal(user) {
      this.showUserModal = true;
      this.selectedUserDetails = null;
      this.userDetailsError = "";
      this.isUserDetailsLoading = true;

      try {
        const res = await getUserDetails(user.id);
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
.admin-view-container { background-color: #f8f9fa; min-height: 100vh; }
.data-card { background: white; border-radius: 12px; overflow: hidden; }

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
.btn-action.view { background: #e7f5ff; color: #228be6; }
.btn-action.approve { background: #ebfbee; color: #40c057; }
.btn-action.reject { background: #fff5f5; color: #fa5252; }

/* Mobile Card Styling */
.mobile-user-card { background: white; border-color: #eee !important; }
.user-img-sm { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

.btn-mobile-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-mobile-icon.view { background: #e7f5ff; color: #228be6; }
.btn-mobile-icon.approve { background: #40c057; color: white; }
.btn-mobile-icon.reject { background: #fa5252; color: white; }

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

.user-img-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
</style>
