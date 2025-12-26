<template>
  <div class="p-4 bg-light" style="min-height: 100vh;">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-primary">Owner List</h3>
      <button class="btn btn-primary">
        <i class="bi bi-download me-2"></i>Export List
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Search owner by name or email"
            />
          </div>
          <div class="col-md-3">
            <select v-model="filterStatus" class="form-select">
              <option value="all">All Status</option>
              <option value="complete">Complete Profile</option>
              <option value="incomplete">Incomplete Profile</option>
            </select>
          </div>
          <div class="col-md-3 text-end">
            <button class="btn btn-outline-secondary" @click="resetFilter">
              <i class="bi bi-arrow-clockwise me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Owners Table -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
        <span>All Users</span>
        <small class="text-muted">result(s)</small>
      </div>

      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>User Image</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Province</th>
              <th>Municipal / City</th>
              <th>Barangay</th>
              <th>Street</th>
              <th>Date Joined</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>
                <img :src="user.user_img_url ? user.user_img_url : null " alt="User image" width="50" height="50" class="rounded-circle">
              </td>
              <td class="fw-semibold">{{ user.first_name }} {{ user.last_name }}</td>
              <td>{{ user.email ? user.email : 'N/A' }}</td>
              <td>{{ user.region_name ? user.region_name : 'N/A' }}</td>
              <td>{{ user.state_name ? user.state_name : 'N/A' }}</td>
              <td>{{ user.town_name ? user.town_name : 'N/A' }}</td>
              <td>{{ user.village_name ? user.village_name : 'N/A' }}</td>
              <td>{{ user.streets ? user.streets : 'N/A' }}</td>
              <td>{{ user.created_at }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="btn btn-sm"
                    :class="user.isComplete  ? 'btn-outline-success' : 'btn-outline-danger' "
                  >
                    <i :class="user.isComplete  ? 'bi bi-check-circle' : 'bi bi-x-circle' "></i>
                  </button>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers } from '@/api/Admin/AdminUser/AdminUser';
import { getUserByStatus } from '@/api/Admin/AdminUser/AdminUser';

export default {
  name: "tenantsList",

  data() {
    return {
      search: "",
      filterStatus: "",
      users: [],
    };
  },
  computed: {
    
  },
  methods: {
    resetFilter() {
      this.search = "";
      this.filterStatus = "";
    },
    async getUsers(){
      try {
        const res = await getUsers();
        this.users = [];
        this.users = res.data.data;
      } catch (error) {
        console.error(error)
      }
    },
    async getToggleUserStatus(status){
      try {
        console.log("Fetching users by:", status);

        let res;
        if (status === "all") {
          res = await getUsers();
        } else {
          res = await getUserByStatus(status);
        }

        console.log("API response:", res.data); // 🔍 check if this contains data
        this.users = [];
        this.users = res.data.data || res.data; // adjust if backend doesn’t wrap in .data.data
        console.log("Users updated:", this.users.length);
      } catch (error) {
        console.error(error)
      }
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
.table th,
.table td {
  vertical-align: middle;
}
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
.card {
  border-radius: 12px;
}
.btn-group .btn {
  padding: 5px 8px;
}
</style>
