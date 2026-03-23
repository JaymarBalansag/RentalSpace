<template>
  <div class="admin-inquiries-page p-3 p-md-4">
    <section class="hero-panel mb-4">
      <div>
        <h3 class="fw-bold mb-1">Inquiries</h3>
        <p class="mb-0 small text-muted">Track Contact Us submissions from users and resolve them from the admin panel.</p>
      </div>
      <button class="btn btn-refresh" :disabled="isListLoading" @click="loadInquiries">
        <i class="bi bi-arrow-repeat me-2"></i>{{ isListLoading ? "Refreshing..." : "Refresh" }}
      </button>
    </section>

    <section class="summary-grid mb-4">
      <article class="summary-card total">
        <small>Total</small>
        <h5>{{ inquiries.length }}</h5>
      </article>
      <article class="summary-card unread">
        <small>Unread</small>
        <h5>{{ unreadCount }}</h5>
      </article>
      <article class="summary-card resolved">
        <small>Resolved</small>
        <h5>{{ resolvedCount }}</h5>
      </article>
    </section>

    <section class="filters-panel mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-8">
          <label class="form-label small fw-semibold">Search</label>
          <div class="input-group search-control">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              v-model="filters.search"
              type="text"
              class="form-control"
              placeholder="Name, email, or message..."
              @keyup.enter="applyFilters"
            />
          </div>
        </div>
        <div class="col-md-2">
          <label class="form-label small fw-semibold">Status</label>
          <select v-model="filters.status" class="form-select">
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div class="col-md-2 d-flex gap-2">
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
          <span class="fw-bold">Inquiry Inbox</span>
          <span class="small text-muted">{{ inquiries.length }} results</span>
        </div>
        <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
          <span v-if="selectedCount" class="small text-muted">{{ selectedCount }} selected</span>
          <button
            class="btn btn-outline-danger btn-sm"
            :disabled="isActionLoading || !selectedCount"
            @click="openDeleteModal('selected')"
          >
            Delete Selected
          </button>
          <button
            class="btn btn-danger btn-sm"
            :disabled="isActionLoading || !inquiries.length"
            @click="openDeleteModal('all')"
          >
            Delete All
          </button>
        </div>
      </div>

      <div v-if="listError" class="alert alert-danger m-3 mb-0">{{ listError }}</div>

      <div v-if="isListLoading" class="list-loading py-5 text-center">
        <div class="spinner-border text-primary mb-2" role="status"></div>
        <p class="text-muted small mb-0">Loading inquiries...</p>
      </div>

      <div v-else class="table-responsive d-none d-lg-block">
        <table class="table align-middle mb-0 admin-table">
          <thead>
            <tr>
              <th class="ps-4 select-col">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="allVisibleSelected"
                  :indeterminate.prop="someVisibleSelected && !allVisibleSelected"
                  :disabled="!inquiries.length || isActionLoading"
                  @change="toggleSelectAll($event)"
                />
              </th>
              <th>Sender</th>
              <th>Email</th>
              <th>Message</th>
              <th>Submitted</th>
              <th>Status</th>
              <th class="text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inquiry in inquiries" :key="inquiry.id">
              <td class="ps-4 select-col">
                <input
                  type="checkbox"
                  class="form-check-input"
                  :checked="isSelected(inquiry.id)"
                  :disabled="isActionLoading"
                  @change="toggleSelection(inquiry.id, $event.target.checked)"
                />
              </td>
              <td class="fw-semibold">{{ inquiry.name }}</td>
              <td class="text-muted small">{{ inquiry.email }}</td>
              <td>
                <div class="message-preview">{{ inquiry.message_preview }}</div>
              </td>
              <td class="small text-muted">{{ formatDateTime(inquiry.created_at) }}</td>
              <td>
                <span class="status-pill" :class="inquiry.status">{{ inquiry.status }}</span>
              </td>
              <td class="text-end pe-4">
                <div class="d-flex justify-content-end gap-2">
                  <button class="action-btn info" title="View details" @click="openDetails(inquiry.id)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="action-btn success"
                    title="Resolve"
                    :disabled="isActionLoading || inquiry.status === 'resolved'"
                    @click="openResolveModal(inquiry)"
                  >
                    <i class="bi bi-check2-circle"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="inquiries.length === 0">
              <td colspan="7" class="text-center py-5">
                <i class="bi bi-inbox fs-2 text-muted opacity-50"></i>
                <p class="text-muted mt-2 mb-0">No inquiries matched your filters.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isListLoading" class="d-lg-none p-3">
        <div v-if="inquiries.length === 0" class="text-center py-5 text-muted">
          No inquiries matched your filters.
        </div>
        <article v-for="inquiry in inquiries" :key="inquiry.id" class="mobile-card mb-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="d-flex align-items-center gap-2 small text-muted">
              <input
                type="checkbox"
                class="form-check-input"
                :checked="isSelected(inquiry.id)"
                :disabled="isActionLoading"
                @change="toggleSelection(inquiry.id, $event.target.checked)"
              />
              Select
            </label>
            <span class="status-pill" :class="inquiry.status">{{ inquiry.status }}</span>
          </div>
          <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
            <div>
              <h6 class="fw-bold mb-0">{{ inquiry.name }}</h6>
              <small class="text-muted">{{ inquiry.email }}</small>
            </div>
          </div>
          <p class="small text-muted mb-2">{{ inquiry.message_preview }}</p>
          <small class="text-muted">{{ formatDateTime(inquiry.created_at) }}</small>
          <div class="d-flex gap-2 mt-3 pt-2 border-top">
            <button class="mobile-action info" @click="openDetails(inquiry.id)">
              <i class="bi bi-eye"></i>
            </button>
            <button
              class="mobile-action success"
              :disabled="isActionLoading || inquiry.status === 'resolved'"
              @click="openResolveModal(inquiry)"
            >
              <i class="bi bi-check2-circle"></i>
            </button>
          </div>
        </article>
      </div>
    </section>

    <div v-if="showDetailsModal" class="modal-overlay-custom" @click.self="closeDetails">
      <div class="modal-body-custom rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Inquiry Details</h5>
          <button class="btn-close" @click="closeDetails"></button>
        </div>

        <div v-if="isDetailsLoading" class="py-4 text-center text-muted">Loading inquiry details...</div>
        <div v-else-if="detailsError" class="alert alert-danger mb-0">{{ detailsError }}</div>
        <div v-else-if="selectedInquiry" class="row g-3">
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Sender</h6>
              <p><strong>Name:</strong> {{ selectedInquiry.name }}</p>
              <p class="mb-0"><strong>Email:</strong> {{ selectedInquiry.email }}</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Status</h6>
              <p><strong>Status:</strong> <span class="text-capitalize">{{ selectedInquiry.status }}</span></p>
              <p><strong>Submitted:</strong> {{ formatDateTime(selectedInquiry.created_at) }}</p>
              <p class="mb-0"><strong>Resolved:</strong> {{ selectedInquiry.resolved_at ? formatDateTime(selectedInquiry.resolved_at) : "-" }}</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="detail-card">
              <h6>Request Context</h6>
              <p><strong>IP Address:</strong> {{ selectedInquiry.ip_address || "-" }}</p>
              <p class="mb-0"><strong>User Agent:</strong> {{ selectedInquiry.user_agent || "-" }}</p>
            </div>
          </div>
          <div class="col-12">
            <div class="detail-card">
              <h6>Message</h6>
              <p class="mb-0 message-full">{{ selectedInquiry.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      :show="showResolveModal"
      :title="'Resolve Inquiry'"
      :message="resolveMessage"
      :confirm-text="'Resolve'"
      :variant="'success'"
      :loading="isActionLoading"
      @cancel="closeResolveModal"
      @confirm="confirmResolve"
    />

    <ConfirmModal
      :show="showDeleteModal"
      :title="'Delete Inquiries'"
      :message="deleteMessage"
      :confirm-text="'Delete'"
      :variant="'danger'"
      :loading="isActionLoading"
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import ConfirmModal from "@/components/confirmModal.vue";
import {
  deleteAdminInquiries,
  getAdminInquiryDetails,
  getAdminInquiries,
  resolveAdminInquiry,
} from "@/api/Admin/AdminInquiry/AdminInquiry";

export default {
  name: "AdminInquiries",
  components: {
    ConfirmModal,
  },
  data() {
    return {
      filters: {
        search: "",
        status: "all",
      },
      inquiries: [],
      isListLoading: false,
      listError: "",
      showDetailsModal: false,
      selectedInquiry: null,
      isDetailsLoading: false,
      detailsError: "",
      showResolveModal: false,
      resolveInquiryId: null,
      resolveMessage: "Mark this inquiry as resolved?",
      showDeleteModal: false,
      deleteMode: "selected",
      deleteMessage: "Delete the selected inquiries?",
      selectedIds: [],
      isActionLoading: false,
    };
  },
  computed: {
    unreadCount() {
      return this.inquiries.filter((item) => item.status === "unread").length;
    },
    resolvedCount() {
      return this.inquiries.filter((item) => item.status === "resolved").length;
    },
    selectedCount() {
      return this.selectedIds.length;
    },
    allVisibleSelected() {
      return this.inquiries.length > 0 && this.inquiries.every((item) => this.selectedIds.includes(item.id));
    },
    someVisibleSelected() {
      return this.inquiries.some((item) => this.selectedIds.includes(item.id));
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
    async loadInquiries() {
      this.isListLoading = true;
      this.listError = "";

      const res = await getAdminInquiries({
        status: this.filters.status,
        search: this.filters.search,
      });

      if (res && res.status >= 200 && res.status < 300) {
        this.inquiries = res.data?.data || [];
        const visibleIds = new Set(this.inquiries.map((item) => item.id));
        this.selectedIds = this.selectedIds.filter((id) => visibleIds.has(id));
      } else {
        this.inquiries = [];
        this.selectedIds = [];
        this.listError = res?.data?.message || "Failed to load inquiries.";
      }

      this.isListLoading = false;
    },
    applyFilters() {
      this.loadInquiries();
    },
    resetFilters() {
      this.filters = {
        search: "",
        status: "all",
      };
      this.selectedIds = [];
      this.loadInquiries();
    },
    isSelected(inquiryId) {
      return this.selectedIds.includes(inquiryId);
    },
    toggleSelection(inquiryId, checked) {
      if (checked) {
        if (!this.selectedIds.includes(inquiryId)) {
          this.selectedIds = [...this.selectedIds, inquiryId];
        }
        return;
      }

      this.selectedIds = this.selectedIds.filter((id) => id !== inquiryId);
    },
    toggleSelectAll(event) {
      const checked = !!event.target.checked;
      if (checked) {
        this.selectedIds = [...new Set([...this.selectedIds, ...this.inquiries.map((item) => item.id)])];
        return;
      }

      const visibleIds = new Set(this.inquiries.map((item) => item.id));
      this.selectedIds = this.selectedIds.filter((id) => !visibleIds.has(id));
    },
    async openDetails(inquiryId) {
      this.showDetailsModal = true;
      this.selectedInquiry = null;
      this.detailsError = "";
      this.isDetailsLoading = true;

      const res = await getAdminInquiryDetails(inquiryId);
      if (res && res.status >= 200 && res.status < 300) {
        this.selectedInquiry = res.data?.data || null;
      } else {
        this.detailsError = res?.data?.message || "Failed to load inquiry details.";
      }

      this.isDetailsLoading = false;
    },
    closeDetails() {
      this.showDetailsModal = false;
      this.selectedInquiry = null;
      this.detailsError = "";
    },
    openResolveModal(inquiry) {
      this.resolveInquiryId = inquiry.id;
      this.resolveMessage = `Mark inquiry from ${inquiry.name} as resolved?`;
      this.showResolveModal = true;
    },
    closeResolveModal() {
      if (this.isActionLoading) return;
      this.showResolveModal = false;
      this.resolveInquiryId = null;
      this.resolveMessage = "Mark this inquiry as resolved?";
    },
    openDeleteModal(mode) {
      this.deleteMode = mode;
      this.deleteMessage = mode === "all"
        ? `Delete all ${this.inquiries.length} inquiries in the current list? This cannot be undone.`
        : `Delete ${this.selectedCount} selected inquiries? This cannot be undone.`;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      if (this.isActionLoading) return;
      this.showDeleteModal = false;
      this.deleteMode = "selected";
      this.deleteMessage = "Delete the selected inquiries?";
    },
    async confirmResolve() {
      if (!this.resolveInquiryId || this.isActionLoading) return;

      this.isActionLoading = true;
      const targetId = this.resolveInquiryId;
      const res = await resolveAdminInquiry(targetId);
      this.isActionLoading = false;

      if (!res || res.status < 200 || res.status >= 300) {
        alert(res?.data?.message || "Failed to resolve inquiry.");
        return;
      }

      this.closeResolveModal();
      await this.loadInquiries();
      if (this.selectedInquiry?.id === targetId) {
        await this.openDetails(targetId);
      }
    },
    async confirmDelete() {
      const targetIds = this.deleteMode === "all"
        ? this.inquiries.map((item) => item.id)
        : [...this.selectedIds];

      if (!targetIds.length || this.isActionLoading) return;

      this.isActionLoading = true;
      const res = await deleteAdminInquiries(targetIds);
      this.isActionLoading = false;

      if (!res || res.status < 200 || res.status >= 300) {
        alert(res?.data?.message || "Failed to delete inquiries.");
        return;
      }

      const targetSet = new Set(targetIds);
      this.selectedIds = this.selectedIds.filter((id) => !targetSet.has(id));
      if (this.selectedInquiry?.id && targetSet.has(this.selectedInquiry.id)) {
        this.closeDetails();
      }

      this.closeDeleteModal();
      await this.loadInquiries();
    },
  },
  mounted() {
    this.loadInquiries();
  },
  watch: {
    "filters.status"() {
      this.loadInquiries();
    },
  },
};
</script>

<style scoped>
.admin-inquiries-page {
  background:
    radial-gradient(circle at 0 0, rgba(228, 242, 255, 0.65), transparent 40%),
    radial-gradient(circle at 100% 0, rgba(255, 238, 230, 0.45), transparent 35%),
    #f6f8fc;
  min-height: 100vh;
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1px solid #e5ebf5;
  background: rgba(255, 255, 255, 0.9);
}

.btn-refresh {
  border: 1px solid #d7dfec;
  background: #fff;
  color: #2f3a4f;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.summary-card {
  border-radius: 12px;
  padding: 0.8rem 1rem;
  border: 1px solid #e8edf5;
  background: #fff;
}

.summary-card small {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.68rem;
  color: #64748b;
}

.summary-card h5 {
  margin: 0.2rem 0 0;
  font-weight: 800;
}

.summary-card.unread { background: #fffbed; }
.summary-card.resolved { background: #effdf6; }

.filters-panel {
  border-radius: 14px;
  border: 1px solid #e5ebf5;
  background: #fff;
  padding: 1rem;
}

.search-control .input-group-text {
  background: #fff;
  border-right: none;
}

.search-control .form-control {
  border-left: none;
}

.table-panel {
  background: #fff;
  border: 1px solid #e5ebf5;
  border-radius: 14px;
  overflow: hidden;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #edf2f8;
}

.select-col {
  width: 48px;
}

.admin-table thead th {
  background: #f4f7fb;
  border: none;
  color: #5b687d;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.75rem 1rem;
}

.admin-table tbody td {
  border-bottom: 1px solid #eef2f8;
  padding: 0.8rem 1rem;
}

.message-preview {
  max-width: 34ch;
  color: #475467;
  font-size: 0.88rem;
}

.message-full {
  white-space: pre-wrap;
  line-height: 1.7;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  text-transform: capitalize;
  font-size: 0.72rem;
  font-weight: 700;
}

.status-pill.unread { background: #fff4ce; color: #956800; }
.status-pill.resolved { background: #d9f9e8; color: #0a7c4d; }

.action-btn {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn.info { background: #e8f3ff; color: #2d7dd2; }
.action-btn.success { background: #e6fbf0; color: #0f8b55; }

.mobile-card {
  border: 1px solid #e9eef6;
  border-radius: 12px;
  padding: 0.8rem;
  background: #fff;
}

.mobile-action {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 10px;
}

.mobile-action.info { background: #e8f3ff; color: #2d7dd2; }
.mobile-action.success { background: #e6fbf0; color: #0f8b55; }

.modal-overlay-custom {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-body-custom {
  background: #fff;
  width: min(94vw, 880px);
  max-height: 90vh;
  overflow-y: auto;
}

.detail-card {
  border: 1px solid #e8edf5;
  border-radius: 12px;
  padding: 0.85rem;
  height: 100%;
}

.detail-card h6 {
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 800;
  color: #667085;
  margin-bottom: 0.65rem;
}

.detail-card p {
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

@media (max-width: 991px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
