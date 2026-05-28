<template>
  <div class="admin-view-container p-3 p-md-4">
    <div class="header-section mb-4">
      <h3 class="fw-bold text-dark mb-1">Property Management</h3>
      <p class="text-muted small mb-0">Review and manage property listings (Admin Portal)</p>
    </div>

    <div class="summary-grid mb-4">
      <article class="summary-card active">
        <p class="summary-label mb-1">Active Listings</p>
        <h5 class="mb-0">{{ summaryCards.active }}</h5>
      </article>
      <article class="summary-card pending">
        <p class="summary-label mb-1">Pending Review</p>
        <h5 class="mb-0">{{ summaryCards.pending }}</h5>
      </article>
      <article class="summary-card rejected">
        <p class="summary-label mb-1">Rejected Listings</p>
        <h5 class="mb-0">{{ summaryCards.rejected }}</h5>
      </article>
    </div>

    <div class="status-button-group mb-4" role="group" aria-label="Property status filter">
      <button 
        v-for="status in statuses" 
        :key="status.value"
        type="button"
        class="status-filter-btn"
        :class="{ active: statusFilter === status.value }"
        :aria-pressed="statusFilter === status.value"
        @click="setStatus(status.value)"
      >
        <span class="status-dot" :class="status.value"></span>
        {{ status.label }}
      </button>
    </div>

    <div class="data-card shadow-sm">
      <div v-if="listError" class="alert alert-danger m-3 mb-0">
        {{ listError }}
      </div>
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
                <td>
                  <p class="fw-bold text-dark mb-0">{{ property.title }}</p>
                  <small class="text-muted">
                    {{ property.agreement_type || "-" }} - {{ property.type_name || "-" }}
                  </small>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm me-2">{{ property.first_name[0] }}{{ property.last_name[0] }}</div>
                    <span class="small">{{ property.first_name }} {{ property.last_name }}</span>
                  </div>
                </td>
                <td><span class="type-label">{{ property.type_name }}</span></td>
                <td class="fw-bold">PHP {{ Number(property.price || 0).toLocaleString() }}</td>
                <td>
                  <span class="badge-modern" :class="property.status">
                    {{ property.status }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn-action review" @click="viewDetails(property.property_id)" title="Review Property">
                      <i class="bi bi-eye"></i>
                      <span>Review</span>
                    </button>
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
              <div>
                <h6 class="fw-bold mb-0">{{ property.title }}</h6>
                <small class="text-muted">
                  {{ property.agreement_type || "-" }} - {{ property.type_name || "-" }}
                </small>
              </div>
              <span class="badge-modern" :class="property.status">{{ property.status }}</span>
            </div>
            <div class="d-flex flex-column gap-1 mb-3">
              <small class="text-muted"><i class="bi bi-person me-1"></i> {{ property.first_name }} {{ property.last_name }}</small>
              <span class="fw-bold text-primary">PHP {{ Number(property.price || 0).toLocaleString() }}</span>
            </div>
            <div class="d-flex gap-2">
              <button class="btn-mobile-icon review" @click="viewDetails(property.property_id)">
                <i class="bi bi-eye"></i>
                <span>Review</span>
              </button>
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

        <div class="details-grid">
          <section class="details-block">
            <h6 class="details-title">Overview</h6>
            <p class="mb-1"><strong>Title:</strong> {{ selectedPropertyDetails.property?.title || "-" }}</p>
            <p class="mb-1"><strong>Owner:</strong> {{ selectedPropertyDetails.property?.first_name }} {{ selectedPropertyDetails.property?.last_name }}</p>
            <p class="mb-1"><strong>Type:</strong> {{ selectedPropertyDetails.property?.type_name || "-" }}</p>
            <p class="mb-0"><strong>Address:</strong> {{ fullAddress }}</p>
            <div class="mt-2">
              <span class="badge-modern" :class="selectedPropertyDetails.property?.status || 'pending'">
                {{ selectedPropertyDetails.property?.status || "-" }}
              </span>
            </div>
          </section>

          <section class="details-block">
            <h6 class="details-title">Pricing & Specs</h6>
            <div class="stats-grid">
              <div class="mini-stat">
                <small class="text-muted d-block">Price</small>
                <strong>PHP {{ Number(selectedPropertyDetails.property?.price || 0).toLocaleString() }}</strong>
              </div>
              <div class="mini-stat">
                <small class="text-muted d-block">Bedrooms</small>
                <strong>{{ selectedPropertyDetails.property?.bedrooms ?? selectedPropertyDetails.property?.bedroom ?? "-" }}</strong>
              </div>
              <div class="mini-stat">
                <small class="text-muted d-block">Public Bath</small>
                <strong>{{ selectedPropertyDetails.property?.public_bath ?? "-" }}</strong>
              </div>
              <div class="mini-stat">
                <small class="text-muted d-block">Private Bath</small>
                <strong>{{ selectedPropertyDetails.property?.private_bath ?? "-" }}</strong>
              </div>
            </div>
          </section>

          <section class="details-block">
            <h6 class="details-title">Features</h6>
            <p class="fw-semibold small mb-2">Amenities</p>
            <div class="d-flex flex-wrap gap-2 mb-3">
              <span v-for="(item, index) in selectedPropertyDetails.amenities" :key="`amenity-${index}`" class="chip">{{ item.name }}</span>
              <small v-if="!selectedPropertyDetails.amenities?.length" class="text-muted">No amenities listed.</small>
            </div>
            <p class="fw-semibold small mb-2">Facilities</p>
            <div class="d-flex flex-wrap gap-2 mb-3">
              <span v-for="(item, index) in selectedPropertyDetails.facilities" :key="`facility-${index}`" class="chip">{{ item.name }}</span>
              <small v-if="!selectedPropertyDetails.facilities?.length" class="text-muted">No facilities listed.</small>
            </div>
            <p class="fw-semibold small mb-2">Utilities</p>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="(item, index) in selectedPropertyDetails.utilities" :key="`utility-${index}`" class="chip">{{ item.name }}</span>
              <small v-if="!selectedPropertyDetails.utilities?.length" class="text-muted">No utilities listed.</small>
            </div>
          </section>

          <section class="details-block details-block-wide">
            <h6 class="details-title">Compliance</h6>
            <div v-if="selectedPropertyDetails.property?.business_permit_url" class="permit-review-card" :class="{ fullscreen: isPermitPreviewFullscreen }">
              <div class="permit-review-header">
                <div>
                  <p class="fw-semibold small mb-0">Business Permit</p>
                  <small class="text-muted">Review the uploaded permit before approving or rejecting.</small>
                </div>
                <div class="permit-review-controls">
                  <button type="button" class="btn btn-sm btn-light border" @click="zoomPermitPreview(-25)" title="Zoom out">
                    <i class="bi bi-zoom-out"></i>
                  </button>
                  <span class="permit-zoom-label">{{ permitPreviewZoom }}%</span>
                  <button type="button" class="btn btn-sm btn-light border" @click="zoomPermitPreview(25)" title="Zoom in">
                    <i class="bi bi-zoom-in"></i>
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-primary" @click="togglePermitPreviewFullscreen">
                    <i :class="isPermitPreviewFullscreen ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'"></i>
                    {{ isPermitPreviewFullscreen ? "Exit" : "Full Screen" }}
                  </button>
                </div>
              </div>

              <div class="permit-preview-frame">
                <img
                  v-if="isPermitImage(selectedPropertyDetails.property?.business_permit_url)"
                  :src="selectedPropertyDetails.property?.business_permit_url"
                  alt="Business permit"
                  class="permit-preview-image"
                  :style="{ width: permitPreviewZoom + '%' }"
                >
                <iframe
                  v-else
                  :src="selectedPropertyDetails.property?.business_permit_url"
                  title="Business permit preview"
                  class="permit-preview-document"
                  :style="{ zoom: permitPreviewScale }"
                ></iframe>
              </div>
            </div>
            <small v-else class="text-muted">No permit uploaded.</small>
          </section>

          <section class="details-block details-block-wide">
            <h6 class="details-title">Media</h6>
            <div class="row g-2">
              <div v-for="(img, index) in selectedPropertyDetails.images" :key="`image-${index}`" class="col-6 col-md-4">
                <img :src="img.images_url" alt="Property image" class="img-fluid rounded border w-100 property-image-preview">
              </div>
              <small v-if="!selectedPropertyDetails.images?.length" class="text-muted">No images uploaded.</small>
            </div>
          </section>
        </div>

        <div
          v-if="selectedPropertyDetails.property?.status === 'pending'"
          class="property-review-actions mt-3 d-flex flex-wrap gap-2"
        >
          <button class="review-decision-btn approve" :disabled="isActionLoading" @click="openApproveModal(selectedPropertyDetails.property)">
            <span class="decision-icon"><i class="bi bi-check2-circle"></i></span>
            <span>
              <strong>Approve</strong>
              <small>Publish this property listing</small>
            </span>
          </button>
          <button class="review-decision-btn reject" :disabled="isActionLoading" @click="openRejectModal(selectedPropertyDetails.property)">
            <span class="decision-icon"><i class="bi bi-x-circle"></i></span>
            <span>
              <strong>Reject</strong>
              <small>Decline this listing with a reason</small>
            </span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {
  fetchPendingProperties,
  getActiveProperties,
  fetchRejectedProperties,
  getPropertyCounts,
  getPropertyDetails,
  notifyPropertyOwner as notifyPropertyOwnerApi,
  approveProperty as approvePropertyApi,
  rejectProperty as rejectPropertyApi,
} from "@/api/Admin/AdminProperty/AdminProperty";
import Swal from "sweetalert2";

export default {
  name: "AdminPropertyTable",
  data() {
    return {
      properties: [],
      showDetailsModal: false,
      selectedPropertyDetails: null,
      selectedReviewPropertyId: null,
      permitPreviewZoom: 100,
      isPermitPreviewFullscreen: false,
      statusFilter: "active",
      listError: "",
      summaryCounts: {
        active: null,
        pending: null,
        rejected: null,
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
  async mounted() {
    await Promise.all([this.fetchSummaryCounts(), this.fetchData()]);
  },
  computed: {
    summaryCards() {
      return {
        active: this.summaryCounts.active ?? "-",
        pending: this.summaryCounts.pending ?? "-",
        rejected: this.summaryCounts.rejected ?? "-",
      };
    },
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
    permitPreviewScale() {
      return this.permitPreviewZoom / 100;
    },
  },
  methods: {
    async fetchSummaryCounts() {
      try {
        const res = await getPropertyCounts();
        if (res && res.status >= 200 && res.status < 300) {
          const payload = res.data?.data || {};
          this.summaryCounts = {
            active: Number(payload.active || 0),
            pending: Number(payload.pending || 0),
            rejected: Number(payload.rejected || 0),
          };
        }
      } catch (error) {
        console.error("Failed to load property counts:", error);
      }
    },
    async fetchData(page = 1) {
      try {
        this.listError = "";
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
          this.summaryCounts[this.statusFilter] = paginator.total || 0;
        } else {
          this.properties = [];
        }
      } catch (error) {
        console.error("Fetch error:", error);
        this.properties = [];
        this.listError = error?.response?.data?.message || "Failed to load properties.";
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
        this.selectedReviewPropertyId = propertyId;
        const res = await getPropertyDetails(propertyId);
        if (res && res.status >= 200 && res.status < 300) {
          this.selectedPropertyDetails = res.data?.data || null;
          this.permitPreviewZoom = 100;
          this.isPermitPreviewFullscreen = false;
          this.showDetailsModal = !!this.selectedPropertyDetails;
          return;
        }
        await Swal.fire({
          icon: "error",
          title: "Failed to load details",
          text: res?.data?.message || "Failed to load property details.",
        });
      } catch (error) {
        console.error(error);
        await Swal.fire({
          icon: "error",
          title: "Failed to load details",
          text: error?.response?.data?.message || "Failed to load property details.",
        });
      }
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedPropertyDetails = null;
      this.selectedReviewPropertyId = null;
      this.permitPreviewZoom = 100;
      this.isPermitPreviewFullscreen = false;
    },
    isPermitImage(url) {
      const lower = String(url || "").toLowerCase();
      return /\.(jpg|jpeg|png|webp|gif)(\?|#|$)/.test(lower);
    },
    zoomPermitPreview(amount) {
      this.permitPreviewZoom = Math.min(200, Math.max(50, this.permitPreviewZoom + amount));
    },
    togglePermitPreviewFullscreen() {
      this.isPermitPreviewFullscreen = !this.isPermitPreviewFullscreen;
    },
    propertyIdentifier(property) {
      return property?.property_id ?? property?.propertyId ?? this.selectedReviewPropertyId ?? property?.id ?? null;
    },
    propertyTitle(property) {
      return property?.title || property?.property_title || "this property";
    },
    async openApproveModal(property) {
      if (this.isActionLoading) return;
      const propertyId = this.propertyIdentifier(property);
      const title = this.propertyTitle(property);
      const shouldRestoreReview = this.showDetailsModal;
      this.showDetailsModal = false;
      const result = await Swal.fire({
        title: "Approve Property",
        text: `Approve "${title}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Approve",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#198754",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        allowEscapeKey: () => !Swal.isLoading(),
        preConfirm: async () => {
          if (!propertyId) {
            Swal.showValidationMessage("Unable to find this property ID.");
            return false;
          }
          const outcome = await this.runModerationAction("approve", propertyId, title, "");
          if (!outcome.ok) {
            Swal.showValidationMessage(outcome.message || "Unable to approve this property.");
            return false;
          }
          return outcome;
        },
        didOpen: () => {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton) confirmButton.dataset.defaultText = "Approve";
        },
        didRender: () => {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton && Swal.isLoading()) {
            confirmButton.textContent = "Approving...";
          }
        },
      });
      if (!result.isConfirmed) {
        if (shouldRestoreReview && this.selectedPropertyDetails) {
          this.showDetailsModal = true;
        }
        return;
      }
      await this.showModerationSuccess(result.value);
    },
    async openRejectModal(property) {
      if (this.isActionLoading) return;
      const propertyId = this.propertyIdentifier(property);
      const title = this.propertyTitle(property);
      const shouldRestoreReview = this.showDetailsModal;
      this.showDetailsModal = false;
      const result = await Swal.fire({
        title: "Reject Property",
        text: `Reject "${title}"?`,
        input: "textarea",
        inputLabel: "Rejection reason",
        inputPlaceholder: "State why this property was rejected...",
        inputAttributes: { "aria-label": "Rejection reason" },
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Reject",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc3545",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        allowEscapeKey: () => !Swal.isLoading(),
        preConfirm: (value) => {
          if (!String(value || "").trim()) {
            Swal.showValidationMessage("Rejection reason is required.");
            return false;
          }
          if (!propertyId) {
            Swal.showValidationMessage("Unable to find this property ID.");
            return false;
          }
          return this.runModerationAction("reject", propertyId, title, value.trim())
            .then((outcome) => {
              if (!outcome.ok) {
                Swal.showValidationMessage(outcome.message || "Unable to reject this property.");
                return false;
              }
              return outcome;
            });
        },
        didOpen: () => {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton) confirmButton.dataset.defaultText = "Reject";
        },
        didRender: () => {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton && Swal.isLoading()) {
            confirmButton.textContent = "Rejecting...";
          }
        },
      });
      if (!result.isConfirmed) {
        if (shouldRestoreReview && this.selectedPropertyDetails) {
          this.showDetailsModal = true;
        }
        return;
      }
      await this.showModerationSuccess(result.value);
    },
    async openNotifyOwnerModal(property) {
      if (this.isActionLoading) return;
      this.showDetailsModal = false;
      const result = await Swal.fire({
        title: "Notify Owner",
        text: `Send update request to owner for "${property.title}"?`,
        input: "textarea",
        inputLabel: "Message",
        inputPlaceholder: "Tell the owner what should be updated...",
        inputAttributes: { "aria-label": "Notification message" },
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Send",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#0d6efd",
        preConfirm: (value) => {
          if (!String(value || "").trim()) {
            Swal.showValidationMessage("Please enter a message for the owner.");
            return false;
          }
          return value.trim();
        },
      });

      if (!result.isConfirmed) return;

      this.isActionLoading = true;
      try {
        const res = await notifyPropertyOwnerApi(property.property_id, result.value);
        if (!res || res.status < 200 || res.status >= 300) {
          await Swal.fire({
            icon: "error",
            title: "Failed to notify owner",
            text: res?.data?.message || "Unable to send notification right now.",
          });
          return;
        }

        await Swal.fire({
          icon: "success",
          title: "Notification Sent",
          text: `Owner of "${property.title}" has been notified.`,
          timer: 1300,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        await Swal.fire({
          icon: "error",
          title: "Failed to notify owner",
          text: error?.response?.data?.message || "Unable to send notification right now.",
        });
      } finally {
        this.isActionLoading = false;
      }
    },

    async showModerationSuccess(outcome) {
      await Swal.fire({
        icon: "success",
        title: outcome?.action === "approve" ? "Property Approved" : "Property Rejected",
        text: `"${outcome?.title}" has been ${outcome?.action === "approve" ? "approved" : "rejected"}.`,
        timer: 1300,
        showConfirmButton: false,
      });
    },
    async runModerationAction(action, propertyId, title, reason = "") {
      this.isActionLoading = true;
      try {
        let res;
        if (action === "approve") {
          res = await approvePropertyApi(propertyId);
        } else {
          res = await rejectPropertyApi(propertyId, reason);
        }

        if (!res || res.status < 200 || res.status >= 300) {
          return {
            ok: false,
            message: res?.data?.message || "Unable to process this request.",
          };
        }

        if (this.propertyIdentifier(this.selectedPropertyDetails?.property) === propertyId) {
          this.selectedPropertyDetails.property.status = action === "approve" ? "active" : "rejected";
        }
        await Promise.all([
          this.fetchData(this.pagination.current_page || 1),
          this.fetchSummaryCounts(),
        ]);
        return {
          ok: true,
          action,
          title,
        };
      } catch (error) {
        console.error(error);
        return {
          ok: false,
          message: error?.response?.data?.message || "Unable to process this request.",
        };
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
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.summary-card {
  border-radius: 14px;
  border: 1px solid #e1e7f0;
  background: rgba(255, 255, 255, 0.92);
  padding: 0.95rem 1rem;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
}

.summary-card h5 {
  font-weight: 700;
  color: #172133;
}

.summary-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #62708a;
  font-weight: 700;
}

.summary-card.active {
  border-left: 4px solid #0ca678;
}

.summary-card.pending {
  border-left: 4px solid #f08c00;
}

.summary-card.rejected {
  border-left: 4px solid #fa5252;
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

/* Status Button Group */
.status-button-group {
  display: inline-flex;
  flex-wrap: wrap;
  overflow: hidden;
  border: 1px solid #d8dfeb;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.status-filter-btn {
  border: 0;
  border-right: 1px solid #d8dfeb;
  background: transparent;
  color: #4f5d75;
  padding: 9px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.2s;
}

.status-filter-btn:last-child {
  border-right: 0;
}

.status-filter-btn:hover {
  background: #f1f4f9;
}

.status-filter-btn.active {
  background: #2563eb;
  color: #ffffff;
}

.status-filter-btn:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.25);
  outline-offset: -3px;
}

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
.btn-action {
  min-width: 88px;
  height: 32px;
  border-radius: 9px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0 12px;
  font-size: 0.8rem;
  font-weight: 700;
  transition: 0.2s;
}
.btn-action.review { background: #e7f5ff; color: #228be6; }
.btn-action:hover { transform: translateY(-1px); filter: brightness(0.98); }

/* Mobile Cards */
.mobile-data-card { background: white; border: 1px solid #ebedef; border-radius: 10px; }
.btn-mobile-icon {
  min-width: 92px;
  height: 40px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0 12px;
  font-size: 0.9rem;
  font-weight: 700;
}
.btn-mobile-icon.review { background: #0d6efd; color: white; }

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


.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.details-block {
  border: 1px solid #e5eaf2;
  border-radius: 12px;
  padding: 0.9rem;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.details-block-wide {
  grid-column: 1 / -1;
}

.details-title {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #4f5d75;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
}

.mini-stat {
  border: 1px solid #e8edf4;
  border-radius: 10px;
  background: #ffffff;
  padding: 0.55rem 0.65rem;
}

.permit-review-card {
  background: #ffffff;
}

.permit-review-card.fullscreen {
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

.permit-review-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 0.85rem;
}

.permit-review-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.45rem;
}

.permit-zoom-label {
  min-width: 48px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4f5d75;
}

.permit-preview-frame {
  height: 360px;
  overflow: auto;
  border: 1px solid #e4eaf4;
  border-radius: 10px;
  background: #f8fafc;
}

.permit-review-card.fullscreen .permit-preview-frame {
  flex: 1;
  height: auto;
}

.permit-preview-image {
  display: block;
  max-width: none;
  margin: 0 auto;
  transform-origin: top center;
}

.permit-preview-document {
  width: 100%;
  height: 620px;
  border: 0;
  transform-origin: top left;
}

.permit-review-card.fullscreen .permit-preview-document {
  height: 100%;
  min-height: 720px;
}

.property-review-actions {
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

@media (max-width: 991.98px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .status-button-group {
    display: flex;
    width: 100%;
  }

  .status-filter-btn {
    flex: 1 1 0;
    padding-inline: 10px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .permit-review-card.fullscreen {
    inset: 0.5rem;
  }

  .permit-review-header {
    flex-direction: column;
  }

  .permit-review-controls,
  .permit-review-controls .btn {
    width: 100%;
  }

  .permit-preview-frame {
    height: 300px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-filter-btn,
  .btn-action,
  .summary-card {
    transition: none !important;
  }
}
</style>

