<template>
  <div>
    <h4 class="mb-3">📊 Overview</h4>
    <!-- Cards Section -->
    <div class="row mb-4">
      <div class="col-md-3" v-for="(item, index) in overviewItems" :key="index">
        <div class="card text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="display-6">{{ item.count }}</p>
            <RouterLink :to="item.link" class="btn btn-primary btn-sm">Manage</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      overviewItems: [
        { title: 'Properties', count: 12, link: '/properties' },
        { title: 'Tenants', count: 8, link: '/tenants' },
        { title: 'Billing', count: '₱500', link: '/billing' },
        { title: 'Reports', count: 5, link: '/reports' },
      ],
    };
  },
};
</script>

<style scoped>
.card-body {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-body:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>
