<template>
  <Header></Header>

  <div class="container py-4" style="max-width: 800px;">
    <!-- Back Button -->
    <RouterLink to="/profile" class="btn btn-outline-secondary mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <div class="card shadow border-0 rounded-4">
      <div class="card-body p-4">
        <h3 class="fw-bold mb-4">Edit Profile</h3>

        <!-- Basic Info -->
        <h5 class="fw-bold mb-3">Basic Information</h5>
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label class="form-label">First Name</label>
            <input class="form-control" v-model="form.first_name" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Last Name</label>
            <input class="form-control" v-model="form.last_name" />
          </div>
          <div class="col-md-12">
            <label class="form-label">Email</label>
            <input class="form-control" v-model="form.email" disabled />
          </div>
          <div class="col-md-12">
            <label class="form-label">Phone Number</label>
            <input class="form-control" v-model="form.phone_number" />
          </div>
        </div>

        <!-- Profile Picture -->
        <h5 class="fw-bold mb-3">Profile Picture</h5>
        <div class="text-center mb-4">
          <img
            v-if="previewImg"
            :src="previewImg"
            class="rounded-circle mb-3"
            style="width:120px;height:120px;object-fit:cover"
          />
          <i v-else class="bi bi-person-circle fs-1 text-secondary"></i>
          <input type="file" class="form-control mt-3" @change="handleImageUpload" />
        </div>

        <!-- Address -->
        <h5 class="fw-bold mb-3">Address</h5>
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label class="form-label">Region</label>
            <input class="form-control" v-model="form.region_name" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Province</label>
            <input class="form-control" v-model="form.state_name" />
          </div>
          <div class="col-md-6">
            <label class="form-label">City / Municipality</label>
            <input class="form-control" v-model="form.town_name" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Barangay</label>
            <input class="form-control" v-model="form.village_name" />
          </div>
          <div class="col-md-12">
            <label class="form-label">Street</label>
            <input class="form-control" v-model="form.streets" />
          </div>
        </div>

        <!-- Save Button -->
        <div class="text-end">
          <button class="btn btn-success" @click="updateProfile">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Header from "@/components/Header.vue";

export default {
  name: "EditProfilePage",
  components: { RouterLink, Header },
  data() {
    return {
      form: {
        first_name: "Juan",
        last_name: "Dela Cruz",
        email: "juan@example.com",
        phone_number: "",
        region_name: "",
        state_name: "",
        town_name: "",
        village_name: "",
        streets: "",
      },
      previewImg: null,
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.previewImg = URL.createObjectURL(file);
      }
    },
    updateProfile() {
      // Here you’d call your API to save changes
      alert("Profile updated successfully!");
    },
  },
};
</script>
