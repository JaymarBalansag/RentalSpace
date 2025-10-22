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
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
        <span>All Owners</span>
        <small class="text-muted">result(s)</small>
      </div>

      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Owner Name</th>
              <th>Email</th>
              <th>Properties</th>
              <th>Status</th>
              <th>Date Joined</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody >
            <tr v-for="(owner, index) in owners" :key="owner.id">
              <td>{{ owner.id }}</td>
              <td class="fw-semibold">{{ owner.first_name }} {{ owner.last_name }}</td>
              <td>{{ owner.email }}</td>
              <td>not yet implemented</td>
              <td>
                <span :class="`badge bg-${owner.status === 'Active' ? 'success' : 'secondary'}`">
                  {{ owner.status }}
                </span>
              </td>
              <td>{{ owner.created_at }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="btn btn-sm"
                    :class="owner.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'"
                  >
                    <i :class="owner.status === 'Active' ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- <tbody v-else>
            <tr>
              <td colspan="7" class="text-center text-muted py-4">
                No owner found
              </td>
            </tr>
          </tbody> -->
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getOwner } from '@/api/Admin/AdminOwner/AdminOwner';

export default {
  name: "ownerList",

  data() {
    return {
      search: "",
      filterStatus: "",
      owners: [],
      hasOwners: null
    };
  },

  computed: {
    filteredOwners() {
      return this.owners.filter((owner) => {
        const matchSearch =
          owner.name.toLowerCase().includes(this.search.toLowerCase()) ||
          owner.email.toLowerCase().includes(this.search.toLowerCase());

        const matchStatus =
          this.filterStatus === "" ||
          owner.status.toLowerCase() === this.filterStatus.toLowerCase();

        return matchSearch && matchStatus;
      });
    },
  },

  methods: {
    resetFilter() {
      this.search = "";
      this.filterStatus = "";
    },
    async fetchOwners() {
      try {
        const res = await getOwner();
        
        if(res){
          this.owners = res.data.data;
          this.hasOwners = true;
        } else {
          this.hasOwner = false;
          this.owners = [];
        }
      } catch (error) {
        
        console.error("Error fetching owners:", error);
      }
    }
  },
  mounted() {
    this.fetchOwners();
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
