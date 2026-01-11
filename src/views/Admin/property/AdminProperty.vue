<template>
  <div class="admin-view-container p-3 p-md-4">
    <div class="header-section mb-4">
      <h3 class="fw-bold text-dark">Property Management</h3>
      <p class="text-muted small">Review and manage property listings (Admin Portal)</p>
    </div>

    <div class="d-flex flex-wrap gap-2 mb-4">
      <button 
        v-for="status in statuses" 
        :key="status.value"
        class="filter-pill"
        :class="{ active: statusFilter === status.value }"
        @click="setStatus(status.value)"
      >
        <span class="status-dot" :class="status.value"></span>
        {{ status.label }}
      </button>
    </div>

    <div class="data-card shadow-sm">
      <div class="table-responsive d-none d-lg-block">
        <table class="table align-middle custom-admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Property Name</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="properties && properties.length > 0">
              <tr v-for="property in properties" :key="property.property_id">
                <td class="text-muted fw-bold small">#{{ property.property_id }}</td>
                <td class="fw-bold text-dark">{{ property.title }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-2">{{ property.first_name[0] }}{{ property.last_name[0] }}</div>
                    <span class="small">{{ property.first_name }} {{ property.last_name }}</span>
                  </div>
                </td>
                <td><span class="type-label">{{ property.type_name }}</span></td>
                <td class="fw-bold">₱{{ property.price }}</td>
                <td>
                  <span class="badge-modern" :class="property.status">
                    {{ property.status }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn-action view" @click="viewDetails(property)" title="View Details">
                      <i class="bi bi-eye"></i>
                    </button>
                    <template v-if="property.status === 'pending'">
                      <button class="btn-action approve" @click="approveProperty(property.property_id)" title="Approve">
                        <i class="bi bi-check-lg"></i>
                      </button>
                      <button class="btn-action reject" @click="rejectProperty(property.property_id)" title="Reject">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-else>
              <td colspan="7" class="text-center py-5">
                <div class="py-4">
                  <i class="bi bi-inbox fs-1 text-muted opacity-25"></i>
                  <p class="mt-2 text-muted fw-semibold">No {{ statusFilter }} properties found.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-lg-none p-2">
        <div v-if="properties && properties.length > 0">
          <div v-for="property in properties" :key="property.property_id" class="mobile-data-card mb-3 p-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="fw-bold mb-0">{{ property.title }}</h6>
              <span class="badge-modern" :class="property.status">{{ property.status }}</span>
            </div>
            <div class="d-flex flex-column gap-1 mb-3">
              <small class="text-muted"><i class="bi bi-person me-1"></i> {{ property.first_name }} {{ property.last_name }}</small>
              <span class="fw-bold text-primary">₱{{ property.price }}</span>
            </div>
            <div class="d-flex gap-2">
              <button class="btn-mobile-icon view" @click="viewDetails(property)"><i class="bi bi-eye"></i></button>
              <template v-if="property.status === 'pending'">
                <button class="btn-mobile-icon approve" @click="approveProperty(property.property_id)"><i class="bi bi-check-lg"></i></button>
                <button class="btn-mobile-icon reject" @click="rejectProperty(property.property_id)"><i class="bi bi-x"></i></button>
              </template>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5">
          <p class="text-muted">No data found</p>
        </div>
      </div>

      <div class="card-footer bg-white border-0 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
        <small class="text-muted mb-3 mb-md-0">
          Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }} results
        </small>
        <div class="pagination-controls">
          <button class="page-nav-btn" :disabled="!pagination.prev_page_url" @click="changePage(pagination.current_page - 1)">
            <i class="bi bi-chevron-left"></i>
          </button>
          <span class="mx-3 fw-bold small">Page {{ pagination.current_page }}</span>
          <button class="page-nav-btn" :disabled="!pagination.next_page_url" @click="changePage(pagination.current_page + 1)">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPendingProperties, getActiveProperties, fetchRejectedProperties, approveProperty } from "@/api/Admin/AdminProperty/AdminProperty";
import axios from "axios";

export default {
  name: "AdminPropertyTable",
  data() {
    return {
      properties: [],
      statusFilter: "active",
      statuses: [
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
      pagination: {
        current_page: 1,
        total: 0,
        from: 0,
        to: 0,
        next_page_url: null,
        prev_page_url: null,
        last_page: 1,
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData(page = 1) {
      try {
        let res;
        if (this.statusFilter === "active") res = await getActiveProperties(page);
        else if (this.statusFilter === "pending") res = await fetchPendingProperties(page);
        else if (this.statusFilter === "rejected") res = await fetchRejectedProperties(page);

        // Standardizing the response handling based on your API structure
        if (res && res.data) {
          // Note: Adjusting based on your provided fetch snippets
          const rawData = res.data.data;
          this.properties = rawData.data || rawData; // Handles nested data.data.data vs data.data
          this.pagination = res.data;
        }
      } catch (error) {
        console.error("Fetch error:", error);
        this.properties = [];
      }
    },
    setStatus(status) {
      this.statusFilter = status;
      this.fetchData(1);
    },
    changePage(page) {
      if (page > 0 && page <= this.pagination.last_page) {
        this.fetchData(page);
      }
    },
    viewDetails(property) {
      alert(`Viewing: ${property.title}`);
    },
    async approveProperty(id) {
      try {
        await approveProperty(id);
        alert("Approved Successfully");
        this.fetchData(this.pagination.current_page);
      } catch (error) {
        console.error(error);
      }
    },
    async rejectProperty(id) {
      if (confirm("Reject this property?")) {
        try {
          // Using your existing axios logic for rejection
          await axios.post(`/api/admin/property/reject/${id}`);
          this.fetchData(this.pagination.current_page);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
};
</script>

<style scoped>
.admin-view-container { background-color: #f8f9fa; min-height: 100vh; }
.data-card { background: white; border-radius: 12px; border: 1px solid #ebedef; overflow: hidden; }

/* Desktop Table */
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

/* Filter Pills */
.filter-pill {
  border: 1px solid #dee2e6;
  background: white;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}
.filter-pill.active { background: #0d6efd; color: white; border-color: #0d6efd; }
.status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }
.status-dot.active { background: #28a745; }
.status-dot.pending { background: #ffc107; }
.status-dot.rejected { background: #dc3545; }

/* Modern Badges */
.badge-modern { padding: 5px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.badge-modern.active { background: #e6fcf5; color: #0ca678; }
.badge-modern.pending { background: #fff9db; color: #f08c00; }
.badge-modern.rejected { background: #fff5f5; color: #fa5252; }

/* Actions */
.btn-action { width: 32px; height: 32px; border-radius: 8px; border: none; transition: 0.2s; }
.btn-action.view { background: #e7f5ff; color: #228be6; }
.btn-action.approve { background: #ebfbee; color: #40c057; }
.btn-action.reject { background: #fff5f5; color: #fa5252; }

/* Mobile Cards */
.mobile-data-card { background: white; border: 1px solid #ebedef; border-radius: 10px; }
.btn-mobile-icon { width: 40px; height: 40px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.btn-mobile-icon.view { background: #0d6efd; color: white; }
.btn-mobile-icon.approve { background: #198754; color: white; }
.btn-mobile-icon.reject { background: #dc3545; color: white; }

/* Utils */
.avatar-sm { width: 28px; height: 28px; background: #eee; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; }
.type-label { background: #f8f9fa; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; color: #6c757d; }
.page-nav-btn { background: #f1f4f9; border: none; width: 34px; height: 34px; border-radius: 8px; }
.page-nav-btn:disabled { opacity: 0.5; }
</style>