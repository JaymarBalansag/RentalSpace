<template>
  <SuccessToast v-if="showSuccess" message="🎉 Property Created"></SuccessToast>
  <div>
    <h4 class="mb-3">🏠 Properties</h4>
    <button
      class="btn btn-primary mb-4 "
      :class="limitReached ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
      :disabled="limitReached"
      :title="limitReached ? 'Upgrade your subscription to add more properties' : ''"
      @click="goToAddProperty"
    >
      {{ limitReached ? "Limit Reached" : "+ Add Property" }}
    </button>    
    <div v-if="limitReached" class="alert alert-warning" role="alert">
      Upgrade your subscription to add more properties
    </div>
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="property in properties" :key="property.id">
        <div class="card h-100 shadow-sm">
          <img :src="property.image_url" @error="$event.target.src = this.placeholderImg" class="card-img-top" alt="Property">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ property.title }}</h5>
            <p class="card-text">
              📍 <strong>Location:</strong> {{ property.state_name ?? 'N/A' }}, {{ property.region_name || "" }}<br>
              🔖 <strong>Status:</strong>
              <span :class="property.status == 'active' ? 'badge bg-success' : 'badge bg-danger ms-1' " class="ms-1">
                {{ property.status == 'active' ? 'Active' : 'Inactive' }}
              </span>
            </p>
            <div class="mt-auto d-flex justify-content-between">
              <RouterLink :to="`/properties/${property.id}/edit`" class="btn btn-sm btn-warning">
                <i class="bi bi-pencil"></i> Edit
              </RouterLink>
              <button @click="deleteProperty(property.id)" class="btn btn-sm btn-danger">
                <i class="bi bi-trash"></i> Delete
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
      message: "",
      showSuccess: false,
      limit : null,
      count: null,
      limitReached: false,
      placeholderImg : placeholderImg,
    };
  },
  components: {
    SuccessToast
  },
  methods: {
    deleteProperty(id) {
      if (confirm("Are you sure you want to delete this property?")) {
        // perform deletion logic here
      }
    },
    async getProperties(){
      try {
        const response = await getOwnerProperties();
        this.message = response.message
        this.properties = response.data.properties
      } catch (error) {
        console.log("GetProperties: " + error)
      }
    },
    async getPropertyLimit(){
      try {
        const response = await getPropertyLimit();
        this.limit = response.data.listing_limit;
        this.count = response.data.current_listings;
        // alert(this.limit)
        this.limitReached = this.count >= this.limit;

      } catch (error) {
        alert("Something Went Wrong!");
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
    this.getPropertyLimit()
    const success = sessionStorage.getItem("propertyCreated");

    if(success){
      this.showSuccess = true;
      sessionStorage.removeItem("propertyCreated")
    }
  }
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
