<template>
  <div class="admin-view-container p-3 p-md-4">
    <div class="header-section mb-4">
      <h3 class="fw-bold text-dark mb-1">Property Management</h3>
      <p class="text-muted small mb-0">Review and manage property listings (Admin Portal)</p>
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
                    <button class="btn-action view" @click="viewDetails(property.property_id)" title="View Details">
                      <i class="bi bi-eye"></i>
                    </button>
                    <template v-if="property.status === 'pending'">
                      <button class="btn-action approve" @click="openApproveModal(property)" title="Approve">
                        <i class="bi bi-check-lg"></i>
                      </button>
                      <button class="btn-action reject" @click="openRejectModal(property)" title="Reject">
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
              <button class="btn-mobile-icon view" @click="viewDetails(property.property_id)"><i class="bi bi-eye"></i></button>
              <template v-if="property.status === 'pending'">
                <button class="btn-mobile-icon approve" @click="openApproveModal(property)"><i class="bi bi-check-lg"></i></button>
                <button class="btn-mobile-icon reject" @click="openRejectModal(property)"><i class="bi bi-x"></i></button>
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

    <div v-if="showDetailsModal && selectedPropertyDetails" class="modal-overlay-custom" @click.self="closeDetailsModal">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Property Details</h5>
          <button class="btn-close" @click="closeDetailsModal"></button>
        </div>

        <div class="mb-3">
          <p class="mb-1"><strong>Title:</strong> {{ selectedPropertyDetails.property?.title || "-" }}</p>
          <p class="mb-1"><strong>Owner:</strong> {{ selectedPropertyDetails.property?.first_name }} {{ selectedPropertyDetails.property?.last_name }}</p>
          <p class="mb-1"><strong>Type:</strong> {{ selectedPropertyDetails.property?.type_name || "-" }}</p>
          <p class="mb-0"><strong>Address:</strong> {{ fullAddress }}</p>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-6 col-md-3">
            <div class="border rounded p-2 text-center">
              <small class="text-muted d-block">Price</small>
              <strong>{{ selectedPropertyDetails.property?.price ?? "-" }}</strong>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="border rounded p-2 text-center">
              <small class="text-muted d-block">Bedrooms</small>
              <strong>{{ selectedPropertyDetails.property?.bedrooms ?? selectedPropertyDetails.property?.bedroom ?? "-" }}</strong>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="border rounded p-2 text-center">
              <small class="text-muted d-block">Public Bath</small>
              <strong>{{ selectedPropertyDetails.property?.public_bath ?? "-" }}</strong>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="border rounded p-2 text-center">
              <small class="text-muted d-block">Private Bath</small>
              <strong>{{ selectedPropertyDetails.property?.private_bath ?? "-" }}</strong>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <div class="border rounded p-2 text-center">
            <small class="text-muted d-block">Status</small>
            <strong class="text-capitalize">{{ selectedPropertyDetails.property?.status || "-" }}</strong>
          </div>
        </div>

        <div class="mb-3">
          <p class="fw-semibold small mb-2">Amenities</p>
          <div class="d-flex flex-wrap gap-2">
            <span v-for="(item, index) in selectedPropertyDetails.amenities" :key="`amenity-${index}`" class="chip">{{ item.name }}</span>
            <small v-if="!selectedPropertyDetails.amenities?.length" class="text-muted">No amenities listed.</small>
          </div>
        </div>

        <div class="mb-3">
          <p class="fw-semibold small mb-2">Facilities</p>
          <div class="d-flex flex-wrap gap-2">
            <span v-for="(item, index) in selectedPropertyDetails.facilities" :key="`facility-${index}`" class="chip">{{ item.name }}</span>
            <small v-if="!selectedPropertyDetails.facilities?.length" class="text-muted">No facilities listed.</small>
          </div>
        </div>

        <div class="mb-3">
          <p class="fw-semibold small mb-2">Utilities</p>
          <div class="d-flex flex-wrap gap-2">
            <span v-for="(item, index) in selectedPropertyDetails.utilities" :key="`utility-${index}`" class="chip">{{ item.name }}</span>
            <small v-if="!selectedPropertyDetails.utilities?.length" class="text-muted">No utilities listed.</small>
          </div>
        </div>

        <div class="mb-3">
          <p class="fw-semibold small mb-2">Business Permit</p>
          <div class="d-flex align-items-center gap-2">
            <template v-if="selectedPropertyDetails.property?.business_permit_url">
              <button
                v-if="isPermitImage(selectedPropertyDetails.property?.business_permit_url)"
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openPermitPreview(selectedPropertyDetails.property?.business_permit_url)"
              >
                View Permit
              </button>
              <a
                v-else
                :href="selectedPropertyDetails.property?.business_permit_url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline-primary btn-sm"
              >
                Open Permit
              </a>
            </template>
            <small v-else class="text-muted">No permit uploaded.</small>
          </div>
        </div>

        <div>
          <p class="fw-semibold small mb-2">Images</p>
          <div class="row g-2">
            <div v-for="(img, index) in selectedPropertyDetails.images" :key="`image-${index}`" class="col-6 col-md-4">
              <img :src="img.images_url" alt="Property image" class="img-fluid rounded border w-100 property-image-preview">
            </div>
            <small v-if="!selectedPropertyDetails.images?.length" class="text-muted">No images uploaded.</small>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPermitPreviewModal" class="modal-overlay-custom" @click.self="closePermitPreview">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Business Permit Preview</h5>
          <button class="btn-close" @click="closePermitPreview"></button>
        </div>
        <img :src="permitPreviewUrl" alt="Business Permit" class="img-fluid rounded border w-100">
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
  fetchPendingProperties,
  getActiveProperties,
  fetchRejectedProperties,
  getPropertyDetails,
  approveProperty as approvePropertyApi,
  rejectProperty as rejectPropertyApi,
} from "@/api/Admin/AdminProperty/AdminProperty";

export default {
  name: "AdminPropertyTable",
  components: {
    ConfirmModal,
  },
  data() {
    return {
      properties: [],
      showDetailsModal: false,
      selectedPropertyDetails: null,
      showPermitPreviewModal: false,
      permitPreviewUrl: "",
      statusFilter: "active",
      showConfirmModal: false,
      confirmInput: "",
      confirmConfig: {
        action: null,
        propertyId: null,
        title: "Confirm Action",
        message: "Are you sure you want to proceed?",
        confirmText: "Yes",
        variant: "success",
        showInput: false,
        inputLabel: "Reason",
        inputPlaceholder: "Type here...",
        inputRequired: false,
      },
      isActionLoading: false,
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
  computed: {
    fullAddress() {
      const property = this.selectedPropertyDetails?.property || {};
      return [
        property.brgyDesc,
        property.muncityDesc,
        property.provDesc,
        property.regDesc,
      ]
        .filter(Boolean)
        .join(", ") || "-";
    },
  },
  methods: {
    async fetchData(page = 1) {
      try {
        let res;
        if (this.statusFilter === "active") res = await getActiveProperties(page);
        else if (this.statusFilter === "pending") res = await fetchPendingProperties(page);
        else if (this.statusFilter === "rejected") res = await fetchRejectedProperties(page);

        if (res && res.status >= 200 && res.status < 300 && res.data) {
          const paginator = res.data.data || {};
          this.properties = paginator.data || [];
          this.pagination = {
            current_page: paginator.current_page || 1,
            total: paginator.total || 0,
            from: paginator.from || 0,
            to: paginator.to || 0,
            next_page_url: paginator.next_page_url || null,
            prev_page_url: paginator.prev_page_url || null,
            last_page: paginator.last_page || 1,
          };
        } else {
          this.properties = [];
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
    async viewDetails(propertyId) {
      try {
        const res = await getPropertyDetails(propertyId);
        if (res && res.status >= 200 && res.status < 300) {
          this.selectedPropertyDetails = res.data?.data || null;
          this.showDetailsModal = !!this.selectedPropertyDetails;
          return;
        }
        alert(res?.data?.message || "Failed to load property details.");
      } catch (error) {
        console.error(error);
        alert("Failed to load property details.");
      }
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedPropertyDetails = null;
      this.closePermitPreview();
    },
    isPermitImage(url) {
      const lower = String(url || "").toLowerCase();
      return /\.(jpg|jpeg|png|webp|gif)(\?|#|$)/.test(lower);
    },
    openPermitPreview(url) {
      if (!url) return;
      this.permitPreviewUrl = url;
      this.showPermitPreviewModal = true;
    },
    closePermitPreview() {
      this.showPermitPreviewModal = false;
      this.permitPreviewUrl = "";
    },
    openApproveModal(property) {
      this.confirmInput = "";
      this.confirmConfig = {
        action: "approve",
        propertyId: property.property_id,
        title: "Approve Property",
        message: `Approve "${property.title}"?`,
        confirmText: "Approve",
        variant: "success",
        showInput: false,
        inputLabel: "Reason",
        inputPlaceholder: "Type here...",
        inputRequired: false,
      };
      this.showConfirmModal = true;
    },
    openRejectModal(property) {
      this.confirmInput = "";
      this.confirmConfig = {
        action: "reject",
        propertyId: property.property_id,
        title: "Reject Property",
        message: `Reject "${property.title}"?`,
        confirmText: "Reject",
        variant: "danger",
        showInput: true,
        inputLabel: "Rejection Reason",
        inputPlaceholder: "State why this property was rejected...",
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
      if (this.isActionLoading) return;

      const { action, propertyId } = this.confirmConfig;
      if (!action || !propertyId) return;

      this.isActionLoading = true;
      try {
        let res;
        if (action === "approve") {
          res = await approvePropertyApi(propertyId);
        } else {
          res = await rejectPropertyApi(propertyId, this.confirmInput.trim());
        }

        if (!res || res.status < 200 || res.status >= 300) {
          alert(res?.data?.message || "Action failed.");
          return;
        }

        this.closeConfirmModal();
        await this.fetchData(this.pagination.current_page || 1);
      } catch (error) {
        console.error(error);
        alert("Action failed.");
      } finally {
        this.isActionLoading = false;
      }
    },
  }
};
</script>

<style scoped>
.admin-view-container {
  min-height: 100vh;
  background:
    radial-gradient(circle at 0 0, rgba(226, 240, 255, 0.7), transparent 40%),
    radial-gradient(circle at 100% 0, rgba(255, 245, 230, 0.5), transparent 35%),
    #f6f8fc;
}

.header-section {
  padding: 1rem 1.1rem;
  border-radius: 14px;
  border: 1px solid #e3e9f3;
  background: rgba(255, 255, 255, 0.9);
}

.data-card { background: white; border-radius: 14px; border: 1px solid #e4eaf4; overflow: hidden; }

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
  border: 1px solid #d8dfeb;
  background: white;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.filter-pill:hover { transform: translateY(-1px); }
.filter-pill.active { background: #2563eb; color: white; border-color: #2563eb; }
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
.btn-action { width: 32px; height: 32px; border-radius: 9px; border: none; transition: 0.2s; }
.btn-action.view { background: #e7f5ff; color: #228be6; }
.btn-action.approve { background: #ebfbee; color: #40c057; }
.btn-action.reject { background: #fff5f5; color: #fa5252; }
.btn-action:hover { transform: translateY(-1px); filter: brightness(0.98); }

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
  background: white;
  width: 92%;
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
}

.chip {
  padding: 4px 10px;
  border-radius: 999px;
  background: #f1f4f9;
  color: #495057;
  font-size: 0.8rem;
}

.property-image-preview {
  object-fit: cover;
  height: 120px;
}
</style>
