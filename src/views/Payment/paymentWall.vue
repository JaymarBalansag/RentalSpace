<template>
  <Header></Header>

  <div class="container py-5 mb-5">
    <div class="text-center mb-5">
      <h2 class="fw-bold">Choose Your Plan</h2>
      <p class="text-muted">Flexible options for property owners to start listing and managing tenants.</p>
    </div>

    <div class="row justify-content-center g-4">
      <!-- Per Transaction -->
      <div class="col-md-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-header bg-white text-center">
            <h4 class="fw-normal">Per Booking</h4>
            <h2 class="fw-bold text-primary">₱50</h2>
            <small class="text-muted">per successful tenant booking</small>
          </div>
          <div class="card-body d-flex flex-column">
            <p class="card-text text-center">
              Perfect if you only expect a few tenants. Pay only when you earn.
            </p>
            <ul class="list-unstyled mt-3 mb-4 text-start">
              <li><i class="bi bi-check2 text-success"></i> Pay only when a tenant books</li>
              <li><i class="bi bi-check2 text-success"></i> No upfront costs</li>
              <li><i class="bi bi-check2 text-success"></i> Simple and flexible</li>
            </ul>
            <button class="btn btn-outline-primary mt-auto">Choose Plan</button>
          </div>
        </div>
      </div>

      <!-- Monthly -->
      <div class="col-md-4">
        <div class="card h-100 shadow-lg border-primary border-2">
          <div class="card-header bg-primary text-white text-center">
            <h4 class="fw-normal">Monthly</h4>
            <h2 class="fw-bold">$10</h2>
            <small>per month</small>
            <span class="badge bg-warning text-dark ms-2">Most Popular</span>
          </div>
          <div class="card-body d-flex flex-column">
            <p class="card-text text-center">
              Great for active landlords with multiple listings and tenants.
            </p>
            <ul class="list-unstyled mt-3 mb-4 text-start">
              <li><i class="bi bi-check2 text-success"></i> 5 Slot listings</li>
              <li><i class="bi bi-check2 text-success"></i> Unlimited bookings</li>
              <li><i class="bi bi-check2 text-success"></i> Priority support</li>
            </ul>
            <button @click="goToMonthyPage" class="btn btn-primary mt-auto">Choose Plan</button>
          </div>
        </div>
      </div>

      <!-- Yearly -->
      <div class="col-md-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-header bg-white text-center">
            <h4 class="fw-normal">Yearly</h4>
            <h2 class="fw-bold text-primary">$100</h2>
            <small class="text-muted">per year</small>
          </div>
          <div class="card-body d-flex flex-column">
            <p class="card-text text-center">
              Best value for long-term property owners who want to save more.
            </p>
            <ul class="list-unstyled mt-3 mb-4 text-start">
              <li><i class="bi bi-check2 text-success"></i> 10 Slot listings</li>
              <li><i class="bi bi-check2 text-success"></i> Unlimited bookings</li>
              <li><i class="bi bi-check2 text-success"></i> Save 20% vs monthly</li>
            </ul>
            <button class="btn btn-outline-primary mt-auto">Choose Plan</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: "paymentWall",
  components: {
    Header
  },
  methods: {
    goToMonthyPage(){
      this.$router.push("/payment/details");
    }
  }
}
</script>
