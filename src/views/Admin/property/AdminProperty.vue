<template>
  <div class="container py-4">
    <h3 class="fw-bold mb-3">Property Management</h3>

    <!-- Filter Buttons -->
    <div class="d-flex gap-2 mb-4">
      <button 
        v-for="status in statuses" 
        :key="status.value"
        class="btn"
        :class="statusFilter === status.value ? 'btn-primary' : 'btn-outline-primary'"
        @click="setStatus(status.value)"
      >
        {{ status.label }}
      </button>
    </div>

    <!-- Property Table -->
    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-striped table-hover align-middle">
          <thead class="table-primary">
            <tr>
              <th>ID</th>
              <th>Property Name</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <!-- ✅ Display data when available -->
          <tbody v-if="hasProperties && properties.length > 0">
            <tr v-for="property in properties" :key="property.property_id">
              <td>{{ property.property_id }}</td>
              <td>{{ property.title }}</td>
              <td>{{ property.first_name }} {{ property.last_name }}</td>
              <td>{{ property.type_name }}</td>
              <td>{{ property.price }}</td>
              <td>
                <span :class="statusBadge(property.status)">
                  {{ property.status }}
                </span>
              </td>
              <td>
                <!-- Pending -->
                <template v-if="property.status === 'pending'" class="d-flex gap-3">
                  <button class="btn btn-sm btn-info me-1" @click="viewDetails(property)">
                    View
                  </button>
                  <button class="btn btn-sm btn-success me-1" @click="approveProperty(property.property_id)">
                    Approve
                  </button>
                  <button class="btn btn-sm btn-danger me-1" @click="rejectProperty(property.id)">
                    Reject
                  </button>
                </template>

                <!-- 🟢 Active Properties: View only -->
                <template v-else-if="property.status === 'active'">
                  <button class="btn btn-sm btn-info" @click="viewDetails(property)">
                    View
                  </button>
                </template>

                <!-- 🔴 Rejected Properties: View only -->
                <template v-else-if="property.status === 'rejected'">
                  <button class="btn btn-sm btn-secondary" @click="viewDetails(property)">
                    View
                  </button>
                </template>
              </td>
            </tr>
          </tbody>

          <!-- ⚠️ Show when no data -->
          <tbody v-else>
            <tr>
              <td colspan="7" class="text-center text-muted py-4">
                No Data Found
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div>
            Showing {{ pagination.from || 0 }} - {{ pagination.to || 0 }} of {{ pagination.total || 0 }}
          </div>
          <nav>
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
                <button class="page-link" @click="changePage(pagination.current_page - 1)">Prev</button>
              </li>
              <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
                <button class="page-link" @click="changePage(pagination.current_page + 1)">Next</button>
              </li>
            </ul>
          </nav>
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
      hasProperties: false,
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
    this.fetchActiveProperties();
  },
  methods: {
    async fetchActiveProperties(page = 1) {
      try {
        const res = await getActiveProperties(page);
        if (res) {
          this.hasProperties = true;
          this.properties = res.data.data.data;
          this.pagination = res.data;
        } else {
          this.hasProperties = false;
          this.properties = [];
        }
      } catch (error) {
        this.hasProperties = false;
        this.properties = [];
        console.error("Error fetching active properties:", error);
      }
    },

    async fetchPendingProperties(page = 1) {
      try {
        const res = await fetchPendingProperties(page);
        if (res.status === 200 && res.data.data.data.length > 0) {
          this.hasProperties = true;
          this.properties = res.data.data.data;
          this.pagination = res.data;
          console.log(this.properties)
        } else {
          this.hasProperties = false;
          this.properties = [];
        }
      } catch (error) {
        this.hasProperties = false;
        this.properties = [];
        console.error("Error fetching pending properties:", error);
      }
    },

    async fetchRejectedProperties(page = 1) {
      try {
        const res = await fetchRejectedProperties(page);
        if (res.status === 200 && res.data.data.length > 0) {
          this.hasProperties = true;
          this.properties = res.data.data;
          this.pagination = res.data;
        } else {
          this.hasProperties = false;
          this.properties = [];
        }
      } catch (error) {
        this.hasProperties = false;
        this.properties = [];
        console.error("Error fetching rejected properties:", error);
      }
    },

    setStatus(status) {
      this.statusFilter = status;
      if (status === "active") {
        this.fetchActiveProperties();
      } else if (status === "pending") {
        this.fetchPendingProperties();
      } else if (status === "rejected") {
        this.fetchRejectedProperties();
      }
    },

    changePage(page) {
      if (page > 0 && page <= this.pagination.last_page) {
        if (this.statusFilter === "active") {
          this.fetchActiveProperties(page);
        } else if (this.statusFilter === "pending") {
          this.fetchPendingProperties(page);
        } else if (this.statusFilter === "rejected") {
          this.fetchRejectedProperties(page);
        }
      }
    },

    statusBadge(status) {
      return {
        badge: true,
        "bg-success": status === "active",
        "bg-warning text-dark": status === "pending",
        "bg-danger": status === "rejected",
      };
    },

    viewDetails(property) {
      alert(`Viewing details for ${property.title}`);
    },

    // ✅ Approve function (sample implementation)
    async approveProperty(property) {
      try {
        console.log(property)
        const res = await approveProperty(property);
        alert(`${property} has been approved!`);
        this.fetchPendingProperties();
      } catch (error) {
        console.error("Error approving property:", error);
      }
    },

    // ✅ Reject function (sample implementation)
    async rejectProperty(property) {
      try {
        await axios.post(`/api/admin/property/reject/${property.id}`);
        alert(`${property.title} has been rejected.`);
        this.fetchPendingProperties();
      } catch (error) {
        console.error("Error rejecting property:", error);
      }
    },
  },
};
</script>

<style scoped>
.badge {
  padding: 0.4em 0.6em;
  border-radius: 0.5rem;
}
</style>
