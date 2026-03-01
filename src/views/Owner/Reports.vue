<template>
  <div class="p-3 p-md-4">
    <h4 class="fw-bold mb-3">Owner Reports</h4>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: tab === 'tenants' }" @click="tab = 'tenants'">Tenant Summary</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: tab === 'bookings' }" @click="tab = 'bookings'">Booking Logs</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: tab === 'payments' }" @click="tab = 'payments'">Payment Analytics</button>
      </li>
    </ul>

    <div v-if="loading" class="text-muted">Loading report data...</div>

    <div v-else>
      <div v-if="tab === 'tenants'">
        <div class="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-2 mb-3">
          <div>
            <label class="form-label small text-muted mb-1">Tenant Status Scope</label>
            <select class="form-select" style="min-width: 220px;" v-model="tenantStatusFilter" @change="onTenantStatusChange">
              <option value="all">All Tenants</option>
              <option value="active">Active Tenants</option>
              <option value="inactive">Inactive Tenants</option>
            </select>
          </div>
          <button class="btn btn-outline-primary" :disabled="printingTenantPdf" @click="printTenantSummary">
            <i class="bi bi-printer me-2"></i>
            {{ printingTenantPdf ? 'Generating PDF...' : 'Print Tenant Summary' }}
          </button>
        </div>

        <div ref="tenantPrintSection" class="tenant-print-sheet">
          <div class="tenant-print-header mb-3">
            <h5 class="fw-bold mb-1">Tenant Summary Report</h5>
            <div class="small text-muted">
              Scope: {{ tenantStatusLabel }} | Generated: {{ formatDateTime(tenantPrintAt) }}
            </div>
          </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3">
              <small class="text-muted">Total Tenants</small>
              <h4 class="mb-0">{{ tenantSummary.counts.total }}</h4>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3">
              <small class="text-muted">Active</small>
              <h4 class="mb-0 text-success">{{ tenantSummary.counts.active }}</h4>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3">
              <small class="text-muted">Inactive</small>
              <h4 class="mb-0 text-secondary">{{ tenantSummary.counts.inactive }}</h4>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="table-responsive">
            <table class="table mb-0">
              <thead class="table-light">
                <tr>
                  <th>Tenant</th>
                  <th>Email</th>
                  <th>Property</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="tenantSummary.tenants.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">No tenant records.</td>
                </tr>
                <tr v-for="tenant in tenantSummary.tenants" :key="tenant.id">
                  <td>{{ tenant.first_name }} {{ tenant.last_name }}</td>
                  <td>{{ tenant.email }}</td>
                  <td>{{ tenant.property_title }}</td>
                  <td>{{ tenant.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>

      <div v-if="tab === 'bookings'">
        <div class="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-2 mb-3">
          <div>
            <label class="form-label small text-muted mb-1">Booking Status Scope</label>
            <select class="form-select" style="min-width: 220px;" v-model="bookingStatusFilter" @change="onBookingStatusChange">
              <option value="all">All Bookings</option>
              <option value="pending">Pending Bookings</option>
              <option value="approved">Approved Bookings</option>
              <option value="rejected">Rejected Bookings</option>
            </select>
          </div>
          <button class="btn btn-outline-primary" :disabled="printingBookingPdf" @click="printBookingLogs">
            <i class="bi bi-printer me-2"></i>
            {{ printingBookingPdf ? 'Generating PDF...' : 'Print Booking Logs' }}
          </button>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="table-responsive">
            <table class="table mb-0">
              <thead class="table-light">
                <tr>
                  <th>Date</th>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="bookingLogs.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">No booking logs.</td>
                </tr>
                <tr v-for="log in bookingLogs" :key="log.id">
                  <td>{{ formatDate(log.created_at) }}</td>
                  <td>{{ log.first_name }} {{ log.last_name }}</td>
                  <td>{{ log.property_title }}</td>
                  <td>{{ log.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="tab === 'payments'">
        <div class="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-2 mb-3">
          <div>
            <label class="form-label small text-muted mb-1">Monthly Scope</label>
            <select class="form-select" style="min-width: 220px;" v-model="paymentMonthScope">
              <option value="all">All Months</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
            </select>
          </div>
          <button class="btn btn-outline-primary" :disabled="printingPaymentPdf" @click="printPaymentAnalytics">
            <i class="bi bi-printer me-2"></i>
            {{ printingPaymentPdf ? 'Generating PDF...' : 'Print Payment Analytics' }}
          </button>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3">
              <small class="text-muted">Verified Total</small>
              <h4 class="mb-0">PHP {{ formatAmount(paymentAnalytics.totals.verified_amount_total) }}</h4>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3">
              <small class="text-muted">Verified This Month</small>
              <h4 class="mb-0 text-success">PHP {{ formatAmount(paymentAnalytics.totals.verified_amount_this_month) }}</h4>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3">
              <small class="text-muted">Pending Payments</small>
              <h4 class="mb-0 text-warning">{{ paymentAnalytics.totals.pending_count }}</h4>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm">
          <div class="table-responsive">
            <table class="table mb-0">
              <thead class="table-light">
                <tr>
                  <th>Month</th>
                  <th>Verified Amount</th>
                  <th>Total Payments</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredPaymentMonthly.length === 0">
                  <td colspan="3" class="text-center text-muted py-4">No payment analytics yet.</td>
                </tr>
                <tr v-for="row in filteredPaymentMonthly" :key="row.month">
                  <td>{{ row.month }}</td>
                  <td>PHP {{ formatAmount(row.verified_amount) }}</td>
                  <td>{{ row.total_payments }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import { getBookingLogs, getPaymentAnalytics, getTenantSummary } from '@/api/Owner/reports';

export default {
  data() {
    return {
      tab: 'tenants',
      loading: false,
      printingTenantPdf: false,
      printingBookingPdf: false,
      printingPaymentPdf: false,
      tenantStatusFilter: 'all',
      bookingStatusFilter: 'all',
      paymentMonthScope: 'all',
      tenantPrintAt: null,
      bookingPrintAt: null,
      paymentPrintAt: null,
      tenantSummary: {
        counts: { total: 0, active: 0, inactive: 0 },
        tenants: [],
      },
      bookingLogs: [],
      paymentAnalytics: {
        totals: {
          verified_amount_total: 0,
          verified_amount_this_month: 0,
          pending_count: 0,
          verified_count: 0,
          rejected_count: 0,
        },
        monthly: [],
      },
    };
  },
  async mounted() {
    await this.loadReports();
  },
  methods: {
    async loadReports() {
      this.loading = true;
      try {
        const statusParam = this.tenantStatusFilter === 'all' ? undefined : this.tenantStatusFilter;
        const bookingStatusParam = this.bookingStatusFilter === 'all' ? undefined : this.bookingStatusFilter;
        const [tenantRes, bookingRes, paymentRes] = await Promise.all([
          getTenantSummary({ status: statusParam }),
          getBookingLogs({ per_page: 20, status: bookingStatusParam }),
          getPaymentAnalytics(),
        ]);

        this.tenantSummary = tenantRes?.data?.data || this.tenantSummary;
        this.bookingLogs = bookingRes?.data?.data?.data || [];
        this.paymentAnalytics = paymentRes?.data?.data || this.paymentAnalytics;
      } catch (error) {
        console.error("Failed to load reports:", error);
        alert(error?.response?.data?.message || "Failed to load reports.");
      } finally {
        this.loading = false;
      }
    },
    async onTenantStatusChange() {
      await this.loadReports();
    },
    async onBookingStatusChange() {
      await this.loadReports();
    },
    async printTenantSummary() {
      if (this.printingTenantPdf) return;

      this.printingTenantPdf = true;
      this.tenantPrintAt = new Date();

      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const marginX = 10;
        const marginTop = 12;
        const marginBottom = 12;
        const rowsPerPage = 25;
        const rows = this.tenantSummary?.tenants || [];
        const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
        const generatedAt = new Date();

        const columns = [
          { key: 'tenant', label: 'Tenant', width: 52 },
          { key: 'email', label: 'Email', width: 58 },
          { key: 'property', label: 'Property', width: 50 },
          { key: 'status', label: 'Status', width: 30 },
        ];

        const fitText = (value, maxWidth) => {
          const text = String(value ?? '-');
          const lines = pdf.splitTextToSize(text, Math.max(4, maxWidth - 2));
          return lines?.[0] || '-';
        };

        const drawPageHeader = (pageNumber) => {
          let y = marginTop;

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(14);
          pdf.text('Tenant Summary Report', marginX, y);

          y += 6;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.text(`Scope: ${this.tenantStatusLabel}`, marginX, y);
          pdf.text(`Generated: ${this.formatDateTime(generatedAt)}`, pageWidth - marginX, y, { align: 'right' });

          y += 5;
          pdf.text(
            `Counts - Total: ${this.tenantSummary?.counts?.total ?? 0}, Active: ${this.tenantSummary?.counts?.active ?? 0}, Inactive: ${this.tenantSummary?.counts?.inactive ?? 0}`,
            marginX,
            y
          );

          y += 4;
          pdf.setDrawColor(220, 225, 235);
          pdf.line(marginX, y, pageWidth - marginX, y);

          return y + 4;
        };

        const drawTableHeader = (startY) => {
          const headerHeight = 8;
          let x = marginX;

          pdf.setFillColor(244, 247, 252);
          pdf.rect(marginX, startY, pageWidth - marginX * 2, headerHeight, 'F');

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          for (const column of columns) {
            pdf.text(column.label, x + 1.5, startY + 5.3);
            x += column.width;
          }

          return startY + headerHeight;
        };

        const drawFooter = (pageNumber) => {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(100);
          pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - marginX, pageHeight - 6, { align: 'right' });
          pdf.setTextColor(0);
        };

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
          if (pageIndex > 0) {
            pdf.addPage();
          }

          const pageNumber = pageIndex + 1;
          const pageRows = rows.slice(pageIndex * rowsPerPage, pageIndex * rowsPerPage + rowsPerPage);

          let y = drawPageHeader(pageNumber);
          y = drawTableHeader(y);

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);

          const rowHeight = 8;
          if (pageRows.length === 0) {
            pdf.text('No tenant records.', marginX + 1.5, y + 5.3);
          } else {
            for (const tenant of pageRows) {
              let x = marginX;
              const values = {
                tenant: `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim() || '-',
                email: tenant.email || '-',
                property: tenant.property_title || '-',
                status: tenant.status || '-',
              };

              for (const column of columns) {
                const text = fitText(values[column.key], column.width);
                pdf.text(text, x + 1.5, y + 5.3);
                x += column.width;
              }

              pdf.setDrawColor(236, 240, 246);
              pdf.line(marginX, y + rowHeight, pageWidth - marginX, y + rowHeight);
              y += rowHeight;
            }
          }

          drawFooter(pageNumber);
        }

        const now = new Date();
        const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        pdf.save(`tenant-summary-${this.tenantStatusFilter}-${stamp}.pdf`);
      } catch (error) {
        console.error('Failed to generate tenant summary PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        this.printingTenantPdf = false;
      }
    },
    async printBookingLogs() {
      if (this.printingBookingPdf) return;

      this.printingBookingPdf = true;
      this.bookingPrintAt = new Date();

      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const marginX = 10;
        const marginTop = 12;
        const rowsPerPage = 28;
        const rows = this.bookingLogs || [];
        const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
        const generatedAt = new Date();

        const columns = [
          { key: 'date', label: 'Date', width: 35 },
          { key: 'tenant', label: 'Tenant', width: 58 },
          { key: 'property', label: 'Property', width: 62 },
          { key: 'status', label: 'Status', width: 35 },
        ];

        const fitText = (value, maxWidth) => {
          const text = String(value ?? '-');
          const lines = pdf.splitTextToSize(text, Math.max(4, maxWidth - 2));
          return lines?.[0] || '-';
        };

        const drawPageHeader = (pageNumber) => {
          let y = marginTop;

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(14);
          pdf.text('Booking Logs Report', marginX, y);

          y += 6;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.text(`Scope: ${this.bookingStatusLabel}`, marginX, y);
          pdf.text(`Generated: ${this.formatDateTime(generatedAt)}`, pageWidth - marginX, y, { align: 'right' });

          y += 4;
          pdf.text(`Total Rows: ${rows.length}`, marginX, y);

          y += 4;
          pdf.setDrawColor(220, 225, 235);
          pdf.line(marginX, y, pageWidth - marginX, y);

          return y + 4;
        };

        const drawTableHeader = (startY) => {
          const headerHeight = 8;
          let x = marginX;

          pdf.setFillColor(244, 247, 252);
          pdf.rect(marginX, startY, pageWidth - marginX * 2, headerHeight, 'F');

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          for (const column of columns) {
            pdf.text(column.label, x + 1.5, startY + 5.3);
            x += column.width;
          }

          return startY + headerHeight;
        };

        const drawFooter = (pageNumber) => {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(100);
          pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - marginX, pageHeight - 6, { align: 'right' });
          pdf.setTextColor(0);
        };

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
          if (pageIndex > 0) {
            pdf.addPage();
          }

          const pageNumber = pageIndex + 1;
          const pageRows = rows.slice(pageIndex * rowsPerPage, pageIndex * rowsPerPage + rowsPerPage);

          let y = drawPageHeader(pageNumber);
          y = drawTableHeader(y);

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);

          const rowHeight = 8;
          if (pageRows.length === 0) {
            pdf.text('No booking logs.', marginX + 1.5, y + 5.3);
          } else {
            for (const row of pageRows) {
              let x = marginX;
              const values = {
                date: this.formatDate(row.created_at),
                tenant: `${row.first_name || ''} ${row.last_name || ''}`.trim() || '-',
                property: row.property_title || '-',
                status: row.status || '-',
              };

              for (const column of columns) {
                const text = fitText(values[column.key], column.width);
                pdf.text(text, x + 1.5, y + 5.3);
                x += column.width;
              }

              pdf.setDrawColor(236, 240, 246);
              pdf.line(marginX, y + rowHeight, pageWidth - marginX, y + rowHeight);
              y += rowHeight;
            }
          }

          drawFooter(pageNumber);
        }

        const now = new Date();
        const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        pdf.save(`booking-logs-${this.bookingStatusFilter}-${stamp}.pdf`);
      } catch (error) {
        console.error('Failed to generate booking logs PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        this.printingBookingPdf = false;
      }
    },
    async printPaymentAnalytics() {
      if (this.printingPaymentPdf) return;

      this.printingPaymentPdf = true;
      this.paymentPrintAt = new Date();

      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const marginX = 10;
        const marginTop = 12;
        const rowsPerPage = 30;
        const rows = this.filteredPaymentMonthly || [];
        const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
        const generatedAt = new Date();

        const columns = [
          { key: 'month', label: 'Month', width: 55 },
          { key: 'verified_amount', label: 'Verified Amount', width: 65 },
          { key: 'total_payments', label: 'Total Payments', width: 60 },
        ];

        const fitText = (value, maxWidth) => {
          const text = String(value ?? '-');
          const lines = pdf.splitTextToSize(text, Math.max(4, maxWidth - 2));
          return lines?.[0] || '-';
        };

        const drawPageHeader = () => {
          let y = marginTop;

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(14);
          pdf.text('Payment Analytics Report', marginX, y);

          y += 6;
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.text(`Scope: ${this.paymentScopeLabel}`, marginX, y);
          pdf.text(`Generated: ${this.formatDateTime(generatedAt)}`, pageWidth - marginX, y, { align: 'right' });

          y += 5;
          pdf.text(
            `Verified Total: PHP ${this.formatAmount(this.paymentAnalytics?.totals?.verified_amount_total)} | Verified This Month: PHP ${this.formatAmount(this.paymentAnalytics?.totals?.verified_amount_this_month)}`,
            marginX,
            y
          );

          y += 5;
          pdf.text(
            `Pending: ${this.paymentAnalytics?.totals?.pending_count ?? 0} | Verified: ${this.paymentAnalytics?.totals?.verified_count ?? 0} | Rejected: ${this.paymentAnalytics?.totals?.rejected_count ?? 0}`,
            marginX,
            y
          );

          y += 4;
          pdf.setDrawColor(220, 225, 235);
          pdf.line(marginX, y, pageWidth - marginX, y);

          return y + 4;
        };

        const drawTableHeader = (startY) => {
          const headerHeight = 8;
          let x = marginX;

          pdf.setFillColor(244, 247, 252);
          pdf.rect(marginX, startY, pageWidth - marginX * 2, headerHeight, 'F');

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          for (const column of columns) {
            pdf.text(column.label, x + 1.5, startY + 5.3);
            x += column.width;
          }

          return startY + headerHeight;
        };

        const drawFooter = (pageNumber) => {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(100);
          pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - marginX, pageHeight - 6, { align: 'right' });
          pdf.setTextColor(0);
        };

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
          if (pageIndex > 0) {
            pdf.addPage();
          }

          const pageNumber = pageIndex + 1;
          const pageRows = rows.slice(pageIndex * rowsPerPage, pageIndex * rowsPerPage + rowsPerPage);

          let y = drawPageHeader();
          y = drawTableHeader(y);

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);

          const rowHeight = 8;
          if (pageRows.length === 0) {
            pdf.text('No payment analytics rows.', marginX + 1.5, y + 5.3);
          } else {
            for (const row of pageRows) {
              let x = marginX;
              const values = {
                month: row.month || '-',
                verified_amount: `PHP ${this.formatAmount(row.verified_amount)}`,
                total_payments: row.total_payments ?? 0,
              };

              for (const column of columns) {
                const text = fitText(values[column.key], column.width);
                pdf.text(text, x + 1.5, y + 5.3);
                x += column.width;
              }

              pdf.setDrawColor(236, 240, 246);
              pdf.line(marginX, y + rowHeight, pageWidth - marginX, y + rowHeight);
              y += rowHeight;
            }
          }

          drawFooter(pageNumber);
        }

        const now = new Date();
        const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        pdf.save(`payment-analytics-${this.paymentMonthScope}-${stamp}.pdf`);
      } catch (error) {
        console.error('Failed to generate payment analytics PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        this.printingPaymentPdf = false;
      }
    },
    formatAmount(value) {
      return Number(value || 0).toLocaleString();
    },
    formatDate(value) {
      if (!value) return '-';
      return new Date(value).toLocaleDateString();
    },
    formatDateTime(value) {
      if (!value) return '-';
      return new Date(value).toLocaleString();
    },
  },
  computed: {
    tenantStatusLabel() {
      if (this.tenantStatusFilter === 'active') return 'Active Tenants';
      if (this.tenantStatusFilter === 'inactive') return 'Inactive Tenants';
      return 'All Tenants';
    },
    bookingStatusLabel() {
      if (this.bookingStatusFilter === 'pending') return 'Pending Bookings';
      if (this.bookingStatusFilter === 'approved') return 'Approved Bookings';
      if (this.bookingStatusFilter === 'rejected') return 'Rejected Bookings';
      return 'All Bookings';
    },
    filteredPaymentMonthly() {
      const rows = this.paymentAnalytics?.monthly || [];
      if (this.paymentMonthScope === 'all') return rows;
      if (this.paymentMonthScope === 'this_month') {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return rows.filter((row) => row?.month === monthKey);
      }
      if (this.paymentMonthScope === 'last_month') {
        const now = new Date();
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const monthKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
        return rows.filter((row) => row?.month === monthKey);
      }

      const limit = Number(this.paymentMonthScope);
      if (!Number.isFinite(limit) || limit <= 0) return rows;

      return rows.slice(-limit);
    },
    paymentScopeLabel() {
      if (this.paymentMonthScope === 'this_month') return 'This Month';
      if (this.paymentMonthScope === 'last_month') return 'Last Month';
      if (this.paymentMonthScope === '3') return 'Last 3 Months';
      if (this.paymentMonthScope === '6') return 'Last 6 Months';
      if (this.paymentMonthScope === '12') return 'Last 12 Months';
      return 'All Months';
    },
  },
};
</script>

<style scoped>
.tenant-print-sheet {
  background: #fff;
}

.tenant-print-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}
</style>
