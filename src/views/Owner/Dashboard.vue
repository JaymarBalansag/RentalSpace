<template>
  <div class="d-flex" style="min-height: 100vh;">
    <!-- Sidebar -->
    <div class="bg-dark text-white p-3" style="width: 250px;">
      <h4 class="mb-4">Owner Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <RouterLink to="/overview" class="nav-link text-white">
            <i class="bi bi-speedometer2 me-2"></i> Overview
          </RouterLink>
        </li>
        <li class="nav-item mb-2">
          <RouterLink to="/properties" class="nav-link text-white">
            <i class="bi bi-building me-2"></i> Properties
          </RouterLink>
        </li>
        <li class="nav-item mb-2">
          <RouterLink to="/tenants" class="nav-link text-white">
            <i class="bi bi-people me-2"></i> Tenants
          </RouterLink>
        </li>
        <li class="nav-item mb-2">
          <RouterLink to="/billing" class="nav-link text-white">
            <i class="bi bi-cash-stack me-2"></i> Billing
          </RouterLink>
        </li>
        <li class="nav-item mb-2">
          <RouterLink to="/reports" class="nav-link text-white">
            <i class="bi bi-bar-chart-line me-2"></i> Reports
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-grow-1 p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Welcome, Owner</h3>

        <!-- Dropdown Menu -->
        <div class="dropdown">
          <button 
            class="btn btn-outline-secondary btn-sm dropdown-toggle" 
            type="button" 
            id="dropdownMenuButton" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <i class="bi bi-person-circle me-1"></i> Profile
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li>
              <RouterLink to="/home" class="dropdown-item">
                <i class="bi bi-house-door me-2"></i> Go to Home
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/profile" class="dropdown-item">
                <i class="bi bi-gear me-2"></i> Account Settings
              </RouterLink>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <button class="dropdown-item text-danger">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

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

      <!-- Placeholder for inner routes -->
      <router-view />
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "OwnerDashboard",
  components: { RouterLink }
};
</script>
