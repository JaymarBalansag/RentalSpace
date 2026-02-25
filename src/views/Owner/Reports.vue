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

      <div v-if="tab === 'bookings'">
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
                <tr v-if="paymentAnalytics.monthly.length === 0">
                  <td colspan="3" class="text-center text-muted py-4">No payment analytics yet.</td>
                </tr>
                <tr v-for="row in paymentAnalytics.monthly" :key="row.month">
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
import { getBookingLogs, getPaymentAnalytics, getTenantSummary } from '@/api/Owner/reports';

export default {
  data() {
    return {
      tab: 'tenants',
      loading: false,
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
        const [tenantRes, bookingRes, paymentRes] = await Promise.all([
          getTenantSummary(),
          getBookingLogs({ per_page: 20 }),
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
    formatAmount(value) {
      return Number(value || 0).toLocaleString();
    },
    formatDate(value) {
      if (!value) return '-';
      return new Date(value).toLocaleDateString();
    },
  },
};
</script>
