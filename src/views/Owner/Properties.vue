<template>
  <SuccessToast v-if="showSuccess" message="🎉 Property Created Successfully"></SuccessToast>
  
  <div class="container-fluid p-0">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h4 class="mb-1 fw-bold text-dark">🏠 My Properties</h4>
        <p class="text-muted small mb-0">Manage and track your property listings</p>
      </div>

      <div class="d-flex flex-column align-items-md-end">
        <button
          class="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill"
          :class="limitReached ? 'btn-secondary opacity-75' : ''"
          :disabled="limitReached"
          @click="goToAddProperty"
        >
          <i class="bi bi-plus-lg me-1"></i> Add New Property
        </button>
      </div>
    </div>

    <div v-if="limit !== null" class="card border-0 bg-light mb-4 shadow-sm">
      <div class="card-body py-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="small fw-bold text-uppercase text-muted">Listing Limit Usage</span>
          <span class="badge bg-white text-dark border fw-bold">{{ count }} / {{ limit }}</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div 
            class="progress-bar rounded-pill" 
            :class="limitReached ? 'bg-danger' : 'bg-primary'" 
            role="progressbar" 
            :style="{ width: (count / limit * 100) + '%' }">
          </div>
        </div>
        <div v-if="limitReached" class="mt-2 small text-danger fw-bold">
          <i class="bi bi-exclamation-triangle-fill me-1"></i> 
          Limit reached. Upgrade your plan to post more properties.
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div v-if="properties.length === 0" class="col-12 text-center py-5">
        <i class="bi bi-house-door text-light-emphasis display-1"></i>
        <p class="mt-3 text-muted">No properties found. Start by adding your first one!</p>
      </div>

      <div class="col-12 col-md-6 col-lg-4" v-for="property in properties" :key="property.id">
        <div class="card h-100 border-0 shadow-sm property-card">
          <div class="position-absolute top-0 end-0 m-3 z-1">
            <span :class="property.status == 'active' ? 'bg-success' : 'bg-danger'" class="badge shadow-sm px-3 py-2">
              {{ property.status == 'active' ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="position-relative overflow-hidden rounded-top" style="height: 200px;">
            <img 
              :src="property.image_url" 
              @error="$event.target.src = placeholderImg" 
              class="card-img-top w-100 h-100 object-fit-cover transition-transform" 
              alt="Property"
            >
          </div>

          <div class="card-body d-flex flex-column p-4">
            <h5 class="card-title fw-bold text-dark text-truncate mb-2">{{ property.title }}</h5>
            
            <div class="card-text mb-4">
              <div class="d-flex align-items-start mb-2 text-muted small">
                <i class="bi bi-geo-alt-fill text-danger me-2"></i>
                <span>{{ property.state_name ?? 'N/A' }}, {{ property.region_name || "" }}</span>
              </div>
              <div class="h5 fw-bold text-primary mb-0">
                ₱{{ property.price?.toLocaleString() }}
                <small class="text-muted fw-normal" style="font-size: 0.8rem">
                   / {{ property.payment_frequency }}
                </small>
              </div>
            </div>

            <div class="mt-auto pt-3 border-top d-flex gap-2">
              <RouterLink :to="`/properties/${property.id}/edit`" class="btn btn-outline-warning flex-grow-1 btn-sm fw-bold">
                <i class="bi bi-pencil-square me-1"></i> Edit
              </RouterLink>
              <button @click="deleteProperty(property.id)" class="btn btn-outline-danger btn-sm px-3">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOwnerProperties, getPropertyLimit } from '@/api/property';
import SuccessToast from '@/components/successToast.vue';
import placeholderImg from '@/assets/Placeholder/thumbnail_placeholder.jpg'; 

export default {
  data() {
    return {
      properties: [],
      showSuccess: false,
      limit: null,
      count: null,
      limitReached: false,
      placeholderImg: placeholderImg,
      isLoading: true // Added loading state
    };
  },
  components: { SuccessToast },
  methods: {
    async deleteProperty(id) {
      // Use a more modern confirm if possible, but keeping your logic
      if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
        try {
          // Add your actual delete API call here
          // await deletePropertyApi(id);
          this.getProperties(); // Refresh list
          this.getPropertyLimit(); // Refresh limit
        } catch (error) {
          console.error("Delete failed", error);
        }
      }
    },
    async getProperties() {
      this.isLoading = true;
      try {
        const response = await getOwnerProperties();
        this.properties = response.data.properties;
      } catch (error) {
        console.error("GetProperties Error:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getPropertyLimit() {
      try {
        const response = await getPropertyLimit();
        this.limit = response.data.listing_limit;
        this.count = response.data.current_listings;
        this.limitReached = this.count >= this.limit;
      } catch (error) {
        console.error("Limit Fetch Error:", error);
      }
    },
    goToAddProperty() {
      if (!this.limitReached) {
        this.$router.push('/dashboard/properties/add');
      }
    },
  },
  mounted() {
    this.getProperties();
    this.getPropertyLimit();
    
    const success = sessionStorage.getItem("propertyCreated");
    if (success) {
      this.showSuccess = true;
      sessionStorage.removeItem("propertyCreated");
      // Auto-hide toast after 3 seconds
      setTimeout(() => { this.showSuccess = false; }, 3000);
    }
  }
};
</script>

<style scoped>
.property-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
}

.transition-transform {
  transition: transform 0.5s ease;
}

.property-card:hover .transition-transform {
  transform: scale(1.1);
}

.object-fit-cover {
  object-fit: cover;
}

.cursor-not-allowed {
  cursor: not-allowed;
}
</style>