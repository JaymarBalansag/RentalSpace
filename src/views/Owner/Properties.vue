<template>
  <div v-if="showSuccess" class="alert alert-success" role="alert">
    🎉 {{ toastMessage }}
  </div>
  <OwnerSubscriptionExpiredBanner />
  <div class="container-fluid p-0">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h4 class="mb-1 fw-bold text-dark">🏠 My Properties</h4>
        <p class="text-muted small mb-0">Manage and track your property listings</p>
        <div class="mt-2">
          <span class="badge rounded-pill" :class="ownerVerificationBadgeClass">
            {{ ownerVerificationLabel }}
          </span>
        </div>
      </div>

      <div class="d-flex flex-column align-items-md-end">
        <button
          class="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill"
          :class="(limitReached || isSubscriptionExpired) ? 'btn-secondary opacity-75 cursor-not-allowed' : ''"
          :disabled="limitReached || isSubscriptionExpired"
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
            <span :class="property.is_available ? 'bg-success' : 'bg-danger'" class="badge shadow-sm px-3 py-2">
              {{ property.is_available ? 'Available' : 'Fully Booked' }}
            </span>
          </div>

          <div class="position-relative overflow-hidden rounded-top" style="height: 200px;">
            <img 
              :src="property.image_url || placeholderImg" 
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
              <RouterLink
                :to="`/dashboard/properties/${property.id}/edit`"
                class="btn btn-outline-warning flex-grow-1 btn-sm fw-bold"
                :class="isSubscriptionExpired ? 'disabled pe-none opacity-75' : ''"
                :aria-disabled="isSubscriptionExpired ? 'true' : 'false'"
              >
                <i class="bi bi-pencil-square me-1"></i> Edit
              </RouterLink>
              <button
                @click="deleteProperty(property.id)"
                class="btn btn-outline-danger btn-sm px-3"
                :disabled="isSubscriptionExpired"
                :class="isSubscriptionExpired ? 'opacity-75 cursor-not-allowed' : ''"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>

            <div class="pt-3 mt-3 border-top">
              <div class="d-flex align-items-center justify-content-between">
                <span class="small fw-semibold text-muted">Availability</span>
                <div class="form-check form-switch mb-0">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :id="`availability-${property.id}`"
                    :checked="property.is_available"
                    :disabled="availabilityLoadingIds.includes(property.id) || isSubscriptionExpired"
                    @change="toggleAvailability(property)"
                  />
                  <label class="form-check-label small ms-1" :for="`availability-${property.id}`">
                    {{ property.is_available ? "Open" : "Full" }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteProperty as deleteOwnerPropertyApi, getOwnerProperties, getPropertyLimit, updateOwnerPropertyAvailability, updateOwnerPropertyState } from '@/api/property';
import { getOwnerSubscriptionStatus } from "@/api/subscription";
import SuccessToast from '@/components/successToast.vue';
import OwnerSubscriptionExpiredBanner from "@/components/OwnerSubscriptionExpiredBanner.vue";
import placeholderImg from '@/assets/Placeholder/thumbnail_placeholder.jpg'; 
import { useUserInfo } from '@/store/userInfo';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      properties: [],
      showSuccess: false,
      limit: null,
      count: null,
      limitReached: false,
      availabilityLoadingIds: [],
      placeholderImg: placeholderImg,
      isLoading: true, // Added loading state,
      toastMessage: "",
    };
  },
  components: { SuccessToast, OwnerSubscriptionExpiredBanner },
  computed: {
    info() {
      return useUserInfo();
    },
    subscription() {
      return this.info.subscription || null;
    },
    isSubscriptionExpired() {
      if (!this.subscription) return false;
      const canManage = this.subscription?.can_manage_properties;
      const hasStatus = typeof this.subscription?.status !== "undefined" && this.subscription?.status !== null;
      const status = hasStatus ? String(this.subscription.status).toLowerCase() : "";
      const statusInactive = hasStatus && !["active", "trialing", "trial", "ongoing"].includes(status);
      return canManage === false || statusInactive;
    },
    ownerVerificationStatus() {
      const status = String(this.info?.owner_verification_status || "unverified").toLowerCase().trim();
      return ["verified", "pending", "rejected", "unverified"].includes(status) ? status : "unverified";
    },
    ownerVerificationLabel() {
      if (this.ownerVerificationStatus === "verified") return "Owner: Verified";
      if (this.ownerVerificationStatus === "pending") return "Owner: Verification Pending";
      if (this.ownerVerificationStatus === "rejected") return "Owner: Verification Rejected";
      return "Owner: Unverified";
    },
    ownerVerificationBadgeClass() {
      if (this.ownerVerificationStatus === "verified") return "bg-success-subtle text-success";
      if (this.ownerVerificationStatus === "pending") return "bg-warning-subtle text-warning-emphasis";
      if (this.ownerVerificationStatus === "rejected") return "bg-danger-subtle text-danger";
      return "bg-secondary-subtle text-secondary";
    },
  },
  methods: {
    async refreshSubscription() {
      try {
        const subscription = await getOwnerSubscriptionStatus();
        if (subscription) {
          this.info.setSubscriptionStatus(subscription);
        }
      } catch (error) {
        console.warn("Failed to refresh subscription status:", error);
      }
    },
    async applyExpiredAvailability() {
      if (!this.isSubscriptionExpired) return;
      const toDisable = (this.properties || []).filter(
        (p) => p?.is_available || String(p?.status || "").toLowerCase() !== "pending"
      );
      if (!toDisable.length) return;

      await Promise.allSettled(
        toDisable.map(async (property) => {
          try {
            await updateOwnerPropertyState(property.id, false, "pending");
            property.is_available = false;
            property.status = "pending";
          } catch (error) {
            console.error("Failed to update availability:", error);
          }
        })
      );

    },
    async deleteProperty(id) {
      if (this.isSubscriptionExpired) return;
      const result = await Swal.fire({
        title: "Delete property?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      try {
        await deleteOwnerPropertyApi(id);
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Property deleted successfully.",
          timer: 1400,
          showConfirmButton: false,
        });
        this.getProperties(); // Refresh list
        this.getPropertyLimit(); // Refresh limit
      } catch (error) {
        console.error("Delete failed", error);
        await Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: error?.response?.data?.message || "Delete failed.",
        });
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
    async toggleAvailability(property) {
      if (this.isSubscriptionExpired) return;
      if (this.availabilityLoadingIds.includes(property.id)) return;
      const nextAvailability = !property.is_available;
      this.availabilityLoadingIds.push(property.id);

      try {
        await updateOwnerPropertyAvailability(property.id, nextAvailability);
        property.is_available = nextAvailability;
      } catch (error) {
        console.error("Availability update failed:", error);
        alert(error?.response?.data?.message || "Failed to update availability.");
      } finally {
        this.availabilityLoadingIds = this.availabilityLoadingIds.filter((id) => id !== property.id);
      }
    },
    goToAddProperty() {
      if (!this.limitReached && !this.isSubscriptionExpired) {
        this.$router.push('/dashboard/properties/add');
      }
    },
  },
  async mounted() {
    await this.refreshSubscription();
    await this.getProperties();
    await this.getPropertyLimit();
    await this.applyExpiredAvailability();
    
    const success = sessionStorage.getItem("propertyCreated");
    const update = sessionStorage.getItem("propertyUpdate");
    if (success) {
      this.showSuccess = true;
      Swal.fire({
          icon: "success",
          title: "Property submitted",
          text: "Your property was submitted successfully.",
          timer: 1300,
          showConfirmButton: false,
        });
      sessionStorage.removeItem("propertyCreated");
      this.toastMessage = "Property Created Successfully";
      // Auto-hide toast after 3 seconds
      setTimeout(() => { this.showSuccess = false; }, 3000);
    } else if (update){
      this.showSuccess = true;
      this.toastMessage = "Property Updated Successfully";
      sessionStorage.removeItem("propertyUpdate");
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
