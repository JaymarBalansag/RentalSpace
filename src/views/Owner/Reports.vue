<template>
  <div>
    <h4 class="mb-3">📑 Reports</h4>
    <ul class="list-group">
      <li v-for="(report, index) in reports" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <i class="bi bi-file-earmark-text me-3"></i>
          <span>{{ report.name }}</span>
        </div>
        <RouterLink :to="report.link" class="btn btn-sm btn-outline-primary">View</RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reports: [
        { name: 'Tenant Summary', link: '/reports/tenant-summary' },
        { name: 'Reservation Logs', link: '/reports/reservation-logs' },
        { name: 'User Feedback Analytics', link: '/reports/feedback' },
      ],
    };
  },
};
</script>
