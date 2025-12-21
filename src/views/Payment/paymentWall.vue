<template>
  <Header />

  <div class="container py-5 mb-5">
    <div class="text-center mb-5">
      <h2 class="fw-bold">Choose Your Subscription Plan</h2>
      <p class="text-muted">
        Subscribe as a property owner to start listing, managing tenants, and growing your business.
      </p>
    </div>

    <div class="row justify-content-center g-4">
      <!-- Monthly Plan -->
      <div class="col-md-5">
        <div class="card h-100 shadow-lg border-primary border-2">
          <div class="card-header bg-primary text-white text-center">
            <h4 class="fw-normal mb-1">Monthly Plan</h4>
            <h2 class="fw-bold">₱50</h2>
            <small>per month</small>
            <span class="badge bg-warning text-dark ms-2">Most Popular</span>
          </div>
          <div class="card-body d-flex flex-column">
            <p class="card-text text-center">
              Ideal for new landlords or those testing the platform. Billed monthly, cancel anytime.
            </p>
            <ul class="list-unstyled mt-3 mb-4 text-start">
              <li><i class="bi bi-check2 text-success"></i> Up to 5 property listings</li>
              <li><i class="bi bi-check2 text-success"></i> Full access to reservation system</li>
              <li><i class="bi bi-check2 text-success"></i> Admin verification for all listings</li>
              <li><i class="bi bi-check2 text-success"></i> 24/7 support and updates</li>
            </ul>
            <button @click="selectPlan('Monthly')" class="btn btn-primary mt-auto">
              Subscribe Monthly
            </button>
          </div>
        </div>
      </div>

      <!-- Annual Plan -->
      <div class="col-md-5">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-header bg-white text-center">
            <h4 class="fw-normal mb-1">Annual Plan</h4>
            <h2 class="fw-bold text-primary">₱500</h2>
            <small class="text-muted">per year</small>
          </div>
          <div class="card-body d-flex flex-column">
            <p class="card-text text-center">
              Best value for long-term property owners who want to save more and focus on growth.
            </p>
            <ul class="list-unstyled mt-3 mb-4 text-start">
              <li><i class="bi bi-check2 text-success"></i> Up to 15 property listings</li>
              <li><i class="bi bi-check2 text-success"></i> Unlimited tenant bookings</li>
              <li><i class="bi bi-check2 text-success"></i> Priority admin verification</li>
              <li><i class="bi bi-check2 text-success"></i> Save 20% compared to monthly plan</li>
            </ul>
            <button @click="selectPlan('Annual')" class="btn btn-outline-primary mt-auto">
              Subscribe Annually
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "PaymentWall",
  components: {  },
  data() {
    return {}
  },
  methods: {
    selectPlan(planType) {
      this.$router.push({ 
        path: '/payment/details',
        query: { plan: planType }
      })
    }
  }
}
</script>


<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}
.card:hover {
  transform: translateY(-5px);
}
</style>
