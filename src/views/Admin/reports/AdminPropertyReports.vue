<template>
  <div class="admin-reports-page p-3 p-md-4">
    <section class="hero-panel mb-4">
      <div>
        <h3 class="fw-bold mb-1">Property Reports</h3>
        <p class="mb-0 small text-muted">
          Review renter-submitted listing complaints and track how each report was handled.
        </p>
      </div>
      <button class="btn btn-refresh" :disabled="isListLoading" @click="loadReports">
        <i class="bi bi-arrow-repeat me-2"></i>{{ isListLoading ? "Refreshing..." : "Refresh" }}
      </button>
    </section>

    <section class="summary-grid mb-4">
      <article class="summary-card total">
        <small>Total</small>
        <h5>{{ reports.length }}</h5>
      </article>
      <article class="summary-card pending">
        <small>Pending</small>
        <h5>{{ pendingCount }}</h5>
      </article>
      <article class="summary-card review">
        <small>Under Review</small>
        <h5>{{ reviewCount }}</h5>
      </article>
      <article class="summary-card resolved">
        <small>Resolved</small>
        <h5>{{ resolvedCount }}</h5>
      </article>
    </section>

    <section class="filters-panel mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-lg-6">
          <label class="form-label small fw-semibold">Search</label>
          <div class="input-group search-control">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              placeholder="Property, owner, reporter..."
              @keyup.enter="applyFilters"
            />
          </div>
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label small fw-semibold">Status</label>
          <select v-model="filters.status" class="form-select">
            <option v-for="statusOption in statusOptions" :key="statusOption.value" :value="statusOption.value">
              {{ statusOption.label }}
            </option>
          </select>
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label small fw-semibold">Reason</label>
          <select v-model="filters.reason" class="form-select">
            <option value="all">All</option>
            <option v-for="reason in reasonOptions" :key="reason.value" :value="reason.value">
              {{ reason.label }}
            </option>
          </select>
        </div>
        <div class="col-lg-2 d-flex gap-2">
          <button class="btn btn-primary flex-grow-1" @click="applyFilters">Apply</button>
          <button class="btn btn-light border" title="Reset filters" @click="resetFilters">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>
    </section>

    <section class="table-panel">
      <div class="panel-head">
        <div class="d-flex flex-column">
          <span class="fw-bold">Moderation Queue</span>
          <span class="small text-muted">{{ reports.length }} results</span>
        </div>
      </div>

      <div v-if="listError" class="alert alert-danger m-3 mb-0">{{ listError }}</div>

      <div v-if="isListLoading" class="list-loading py-5 text-center">
        <div class="spinner-border text-primary mb-2" role="status"></div>
        <p class="text-muted small mb-0">Loading property reports...</p>
      </div>

      <div v-else class="table-responsive d-none d-lg-block">
        <table class="table align-middle mb-0 admin-table">
          <thead>
            <tr>
              <th class="ps-4">Property</th>
              <th>Reporter</th>
              <th>Owner</th>
              <th>Reason</th>
              <th>Submitted</th>
              <th>Status</th>
              <th class="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id">
              <td class="ps-4">
                <div class="fw-semibold">{{ report.property_title || `Property #${report.property_id}` }}</div>
                <div class="small text-muted">#{{ report.property_id }}</div>
              </td>
              <td>
                <div class="fw-semibold">{{ report.reporter_name || "-" }}</div>
                <div class="small text-muted">{{ report.reporter_email || "-" }}</div>
              </td>
              <td>
                <div class="fw-semibold">{{ report.owner_name || "-" }}</div>
                <div class="small text-muted">{{ report.owner_email || "-" }}</div>
              </td>
              <td class="small text-muted">{{ formatReason(report.reason) }}</td>
              <td class="small text-muted">{{ formatDateTime(report.created_at) }}</td>
              <td>
                <span class="status-pill" :class="report.status">{{ formatStatus(report.status) }}</span>
              </td>
              <td class="text-end pe-4">
                <button class="action-btn info" title="View report" @click="openDetails(report.id)">
                  <i class="bi bi-eye"></i>
                </button>
              </td>
            </tr>
            <tr v-if="reports.length === 0">
              <td colspan="7" class="text-center py-5">
                <i class="bi bi-inbox fs-2 text-muted opacity-50"></i>
                <p class="text-muted mt-2 mb-0">No property reports matched your filters.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isListLoading" class="d-lg-none p-3">
        <div v-if="reports.length === 0" class="text-center py-5 text-muted">
          No property reports matched your filters.
        </div>
        <article v-for="report in reports" :key="report.id" class="mobile-card mb-3">
          <div class="mobile-card-top">
            <div class="mobile-card-heading">
              <h6 class="fw-bold mb-1">{{ report.property_title || `Property #${report.property_id}` }}</h6>
              <div class="small text-muted">Property #{{ report.property_id }}</div>
            </div>
            <span class="status-pill" :class="report.status">{{ formatStatus(report.status) }}</span>
          </div>

          <div class="small text-muted mobile-card-details">
            <div><strong>Reporter:</strong> {{ report.reporter_name || "-" }}</div>
            <div><strong>Owner:</strong> {{ report.owner_name || "-" }}</div>
            <div><strong>Reason:</strong> {{ formatReason(report.reason) }}</div>
            <div><strong>Submitted:</strong> {{ formatDateTime(report.created_at) }}</div>
          </div>

          <div class="mobile-card-actions">
            <button class="mobile-action info" @click="openDetails(report.id)">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </article>
      </div>
    </section>

    <div v-if="showDetailsModal" class="modal-overlay-custom" @click.self="closeDetails">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Report Details</h5>
          <button class="btn-close" @click="closeDetails"></button>
        </div>

        <div v-if="isDetailsLoading" class="py-4 text-center text-muted">Loading report details...</div>
        <div v-else-if="detailsError" class="alert alert-danger mb-0">{{ detailsError }}</div>
        <div v-else-if="selectedReport" class="row g-3">
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Property</h6>
              <p><strong>Title:</strong> {{ selectedReport.property_title || "-" }}</p>
              <p><strong>Property ID:</strong> #{{ selectedReport.property_id }}</p>
              <p class="mb-0"><strong>Visibility:</strong> {{ selectedReport.property_status || "-" }}</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Report Status</h6>
              <p><strong>Status:</strong> {{ formatStatus(selectedReport.status) }}</p>
              <p><strong>Submitted:</strong> {{ formatDateTime(selectedReport.created_at) }}</p>
              <p class="mb-0"><strong>Reviewed:</strong> {{ selectedReport.reviewed_at ? formatDateTime(selectedReport.reviewed_at) : "-" }}</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Reporter</h6>
              <p><strong>Name:</strong> {{ selectedReport.reporter_name || "-" }}</p>
              <p class="mb-0 text-break"><strong>Email:</strong> {{ selectedReport.reporter_email || "-" }}</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Owner</h6>
              <p><strong>Name:</strong> {{ selectedReport.owner_name || "-" }}</p>
              <p class="mb-0 text-break"><strong>Email:</strong> {{ selectedReport.owner_email || "-" }}</p>
            </div>
          </div>
          <div class="col-12">
            <div class="detail-card">
              <h6>Complaint</h6>
              <p><strong>Reason:</strong> {{ formatReason(selectedReport.reason) }}</p>
              <p class="mb-0 report-copy"><strong>Details:</strong> {{ selectedReport.details || "No extra details provided." }}</p>
            </div>
          </div>
          <div class="col-12">
            <div class="detail-card">
              <h6>Admin Notes</h6>
              <textarea
                v-model="adminNotes"
                class="form-control"
                rows="4"
                maxlength="1000"
                placeholder="Add moderation notes for this report."
              ></textarea>
              <div class="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
                <small class="text-muted">
                  Last reviewed by {{ selectedReport.reviewed_by_name || "-" }}
                </small>
                <small class="text-muted">{{ adminNotes.length }}/1000</small>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="modal-actions">
              <button class="btn btn-outline-primary" :disabled="isActionLoading" @click="updateStatus('under_review')">
                Mark Under Review
              </button>
              <button class="btn btn-success" :disabled="isActionLoading" @click="updateStatus('resolved')">
                Resolve
              </button>
              <button class="btn btn-outline-danger" :disabled="isActionLoading" @click="updateStatus('dismissed')">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import {
  getAdminPropertyReportDetails,
  getAdminPropertyReports,
  updateAdminPropertyReport,
} from "@/api/Admin/AdminReports/AdminPropertyReports";

export default {
  name: "AdminPropertyReports",
  data() {
    return {
      filters: {
        search: "",
        status: "all",
        reason: "all",
      },
      reports: [],
      isListLoading: false,
      listError: "",
      showDetailsModal: false,
      selectedReport: null,
      isDetailsLoading: false,
      detailsError: "",
      isActionLoading: false,
      adminNotes: "",
      reasonOptions: [
        { value: "misleading_information", label: "Misleading information" },
        { value: "fake_or_scam_listing", label: "Fake or scam listing" },
        { value: "incorrect_price_or_details", label: "Incorrect price or details" },
        { value: "inappropriate_photos_or_content", label: "Inappropriate photos or content" },
        { value: "unavailable_but_still_advertised", label: "Unavailable but still advertised" },
        { value: "safety_concern", label: "Safety concern" },
        { value: "other", label: "Other" },
      ],
      statusOptions: [
        { value: "all", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "under_review", label: "Under Review" },
        { value: "resolved", label: "Resolved" },
        { value: "dismissed", label: "Dismissed" },
      ],
      suppressStatusAutoApply: false,
      suppressReasonAutoApply: false,
    };
  },
  computed: {
    pendingCount() {
      return this.reports.filter((item) => item.status === "pending").length;
    },
    reviewCount() {
      return this.reports.filter((item) => item.status === "under_review").length;
    },
    resolvedCount() {
      return this.reports.filter((item) => item.status === "resolved").length;
    },
  },
  methods: {
    formatDateTime(value) {
      if (!value) return "-";
      return new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value));
    },
    formatReason(value) {
      const found = this.reasonOptions.find((option) => option.value === value);
      if (found) return found.label;
      return String(value || "-")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    formatStatus(value) {
      if (!value) return "-";
      return String(value).replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    },
    normalizeStatusFilter(value) {
      const normalized = String(value || "all").trim().toLowerCase();
      const allowed = this.statusOptions.map((option) => option.value);
      return allowed.includes(normalized) ? normalized : "all";
    },
    normalizeReasonFilter(value) {
      const normalized = String(value || "all").trim().toLowerCase();
      const allowed = ["all", ...this.reasonOptions.map((option) => option.value)];
      return allowed.includes(normalized) ? normalized : "all";
    },
    async loadReports() {
      this.isListLoading = true;
      this.listError = "";
      const normalizedStatus = this.normalizeStatusFilter(this.filters.status);
      const normalizedReason = this.normalizeReasonFilter(this.filters.reason);

      if (normalizedStatus !== this.filters.status) {
        this.suppressStatusAutoApply = true;
        this.filters.status = normalizedStatus;
      }

      if (normalizedReason !== this.filters.reason) {
        this.suppressReasonAutoApply = true;
        this.filters.reason = normalizedReason;
      }

      const res = await getAdminPropertyReports({
        search: this.filters.search,
        status: normalizedStatus,
        reason: normalizedReason,
      });

      if (res && res.status >= 200 && res.status < 300) {
        this.reports = res.data?.data || [];
      } else {
        this.reports = [];
        this.listError = res?.data?.message || "Failed to load property reports.";
      }

      this.isListLoading = false;
    },
    applyFilters() {
      this.loadReports();
    },
    resetFilters() {
      this.suppressStatusAutoApply = true;
      this.suppressReasonAutoApply = true;
      this.filters = {
        search: "",
        status: "all",
        reason: "all",
      };
      this.loadReports();
    },
    async openDetails(reportId) {
      this.showDetailsModal = true;
      this.isDetailsLoading = true;
      this.detailsError = "";
      this.selectedReport = null;
      this.adminNotes = "";

      const res = await getAdminPropertyReportDetails(reportId);

      if (res && res.status >= 200 && res.status < 300) {
        this.selectedReport = res.data?.data || null;
        this.adminNotes = this.selectedReport?.admin_notes || "";
      } else {
        this.detailsError = res?.data?.message || "Failed to load report details.";
      }

      this.isDetailsLoading = false;
    },
    closeDetails() {
      if (this.isActionLoading) return;
      this.showDetailsModal = false;
      this.selectedReport = null;
      this.adminNotes = "";
      this.detailsError = "";
    },
    async updateStatus(status) {
      if (!this.selectedReport?.id || this.isActionLoading) return;

      this.isActionLoading = true;
      const res = await updateAdminPropertyReport(this.selectedReport.id, {
        status,
        admin_notes: this.adminNotes?.trim() || "",
      });

      if (res && res.status >= 200 && res.status < 300) {
        this.isActionLoading = false;
        this.closeDetails();

        await Swal.fire({
          icon: "success",
          title: "Report updated",
          text: res.data?.message || "The property report was updated successfully.",
        });
        await this.loadReports();
      } else {
        this.isActionLoading = false;
        this.closeDetails();

        await Swal.fire({
          icon: "error",
          title: "Update failed",
          text: res?.data?.message || "Failed to update the property report.",
        });
      }

      this.isActionLoading = false;
    },
  },
  mounted() {
    this.loadReports();
  },
  watch: {
    "filters.status"(value) {
      const normalizedStatus = this.normalizeStatusFilter(value);

      if (normalizedStatus !== value) {
        this.suppressStatusAutoApply = true;
        this.filters.status = normalizedStatus;
        return;
      }

      if (this.suppressStatusAutoApply) {
        this.suppressStatusAutoApply = false;
        return;
      }

      this.loadReports();
    },
    "filters.reason"(value) {
      const normalizedReason = this.normalizeReasonFilter(value);

      if (normalizedReason !== value) {
        this.suppressReasonAutoApply = true;
        this.filters.reason = normalizedReason;
        return;
      }

      if (this.suppressReasonAutoApply) {
        this.suppressReasonAutoApply = false;
        return;
      }

      this.loadReports();
    },
  },
};
</script>

<style scoped>
.admin-reports-page {
  min-height: 100%;
  background: #f7f9fc;
}

.hero-panel,
.filters-panel,
.table-panel {
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 1.25rem;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.05);
}

.hero-panel {
  padding: 1.25rem 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.btn-refresh {
  border-radius: 999px;
  border: 1px solid #d7dfec;
  background: #f8fbff;
  color: #224379;
  font-weight: 600;
  padding: 0.7rem 1.1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.summary-card {
  border-radius: 1.15rem;
  padding: 1rem 1.1rem;
  border: 1px solid transparent;
}

.summary-card small {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.summary-card h5 {
  margin: 0;
  font-weight: 800;
  color: #0f172a;
}

.summary-card.total { background: #eef5ff; border-color: #d9e7ff; }
.summary-card.pending { background: #fff8e8; border-color: #ffe7aa; }
.summary-card.review { background: #f4f1ff; border-color: #ddd1ff; }
.summary-card.resolved { background: #effdf6; border-color: #c9f3dc; }

.filters-panel {
  padding: 1.15rem 1.2rem;
}

.search-control .input-group-text {
  background: #f8fafc;
  border-color: #dbe4ee;
}

.search-control .form-control,
.filters-panel .form-select {
  border-color: #dbe4ee;
}

.table-panel {
  overflow: hidden;
}

.panel-head {
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.admin-table thead th {
  background: #f8fafc;
  color: #64748b;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  border-bottom: 1px solid #edf2f7;
}

.admin-table tbody td {
  border-color: #edf2f7;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-pill.pending {
  background: #fff8dd;
  color: #946200;
}

.status-pill.under_review {
  background: #efe8ff;
  color: #5f3dc4;
}

.status-pill.resolved {
  background: #e7f9ef;
  color: #137a43;
}

.status-pill.dismissed {
  background: #f1f5f9;
  color: #475569;
}

.action-btn,
.mobile-action {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.action-btn.info,
.mobile-action.info {
  background: #2563eb;
}

.mobile-card {
  border: 1px solid #e7edf6;
  border-radius: 1.15rem;
  background: #fff;
  padding: 1rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.mobile-card-top {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 0.9rem;
}

.mobile-card-heading {
  min-width: 0;
}

.mobile-card-heading h6 {
  word-break: break-word;
}

.mobile-card-details {
  display: grid;
  gap: 0.35rem;
}

.mobile-card-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.85rem;
  margin-top: 0.85rem;
  border-top: 1px solid #eef2f7;
}

.modal-overlay-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.56);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-body-custom {
  background: #fff;
  width: min(920px, 100%);
  max-height: 92vh;
  overflow-y: auto;
}

.detail-card {
  border: 1px solid #e7edf6;
  border-radius: 1rem;
  background: #f8fafc;
  padding: 1rem;
  height: 100%;
}

.detail-card h6 {
  font-weight: 700;
  margin-bottom: 0.85rem;
  color: #0f172a;
}

.detail-card p {
  margin-bottom: 0.6rem;
  color: #334155;
}

.report-copy {
  white-space: pre-wrap;
  word-break: break-word;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.modal-actions .btn {
  min-width: 170px;
  border-radius: 999px;
  font-weight: 600;
}

@media (max-width: 991.98px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filters-panel .row > div:last-child {
    margin-top: 0.1rem;
  }
}

@media (max-width: 575.98px) {
  .hero-panel {
    padding: 1rem;
    flex-direction: column;
    align-items: stretch;
  }

  .btn-refresh {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .filters-panel {
    padding: 1rem;
  }

  .modal-body-custom {
    max-height: 96vh;
    padding: 1rem !important;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
    min-width: 0;
  }
}
</style>
