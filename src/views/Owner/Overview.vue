<template>
  <div>
    <h4 class="mb-3">📊 Overview</h4>
    <!-- Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Properties</h5>
              <p class="display-6">12</p>
              <RouterLink to="/owner/properties" class="btn btn-primary btn-sm">Manage</RouterLink>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Tenants</h5>
              <p class="display-6">8</p>
              <RouterLink to="/owner/tenants" class="btn btn-primary btn-sm">View</RouterLink>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Billing</h5>
              <p class="display-6">₱500</p>
              <RouterLink to="/owner/billing" class="btn btn-primary btn-sm">Details</RouterLink>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Reports</h5>
              <p class="display-6">5</p>
              <RouterLink to="/owner/reports" class="btn btn-primary btn-sm">View</RouterLink>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
