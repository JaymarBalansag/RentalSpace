<template>
  <div class="container py-4">
    <div class="card shadow border-0 rounded-4">
      <div class="card-body p-4">
        <RouterLink to="/profile" class="btn btn-secondary mb-3">Back</RouterLink>

        <!-- Progress -->
        <div class="mb-4">
          <div class="progress" style="height: 8px;">
            <div
              class="progress-bar bg-primary"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
          <p class="text-muted small mt-2">Step {{ step }} of 4</p>
        </div>

        <!-- STEP 1: Basic Info -->
        <div v-if="step === 1">
          <h4 class="fw-bold mb-3">Basic Information</h4>
          <div class="row g-3">
            <div class="col-md-6">
              <input class="form-control form-control-lg" v-model="form.first_name" disabled />
            </div>
            <div class="col-md-6">
              <input class="form-control form-control-lg" v-model="form.last_name" disabled />
            </div>
            <div class="col-md-12">
              <input class="form-control form-control-lg" v-model="form.email" disabled />
            </div>
            <div class="col-md-12">
              <input
                class="form-control form-control-lg"
                placeholder="Phone Number"
                v-model="form.phone_number"
              />
            </div>
          </div>
        </div>

        <!-- STEP 2: Profile Picture -->
        <div v-if="step === 2">
          <h4 class="fw-bold mb-3">Profile Picture</h4>
          <div class="text-center">
            <img
              v-if="previewImg"
              :src="previewImg"
              class="rounded-circle mb-3"
              style="width:120px;height:120px;object-fit:cover"
            />
            <i v-else class="bi bi-person-circle fs-1 text-secondary"></i>
            <input type="file" class="form-control mt-3" @change="handleImageUpload" />
          </div>
        </div>

        <!-- STEP 3: Map -->
        <div v-show="step === 3">
          <div class="d-flex align-items-center gap-3 mb-2">
            <h4 class="fw-bold mb-0">Your Location</h4>
            <div v-if="loading" class="spinner-border spinner-border-sm text-primary"></div>
          </div>

          <div id="map" style="height:40vh" class="rounded shadow"></div>

          <div class="row mt-3 g-2">
            <div class="col">
              <input class="form-control" v-model="form.region_name" disabled placeholder="Region">
            </div>
            <div class="col">
              <input class="form-control" v-model="form.state_name" disabled placeholder="Province">
            </div>
            <div class="col">
              <input class="form-control" v-model="form.town_name" disabled placeholder="City / Municipality">
            </div>
            <div class="col">
              <input class="form-control" v-model="form.village_name" disabled placeholder="Barangay">
            </div>
            <div class="col">
              <input class="form-control" v-model="form.streets" placeholder="Street">
            </div>
          </div>
        </div>

        <!-- STEP 4: Summary -->
        <div v-if="step === 4">
          <h4 class="fw-bold mb-3">Summary</h4>
          <table class="table table-bordered">
            <tbody>
              <tr><th>First Name</th><td>{{ form.first_name }}</td></tr>
              <tr><th>Last Name</th><td>{{ form.last_name }}</td></tr>
              <tr><th>Email</th><td>{{ form.email }}</td></tr>
              <tr><th>Phone</th><td>{{ form.phone_number }}</td></tr>
              <tr><th>Street</th><td>{{ form.streets }}</td></tr>
              <tr><th>Region</th><td>{{ form.region_name }}</td></tr>
              <tr><th>Province</th><td>{{ form.state_name }}</td></tr>
              <tr><th>City</th><td>{{ form.town_name }}</td></tr>
              <tr><th>Barangay</th><td>{{ form.village_name }}</td></tr>
              <tr><th>Latitude</th><td>{{ form.latitude }}</td></tr>
              <tr><th>Longitude</th><td>{{ form.longitude }}</td></tr>
            </tbody>
          </table>
        </div>

        <!-- NAV -->
        <div class="d-flex justify-content-between mt-4">
          <button v-if="step > 1" class="btn btn-outline-secondary" @click="prevStep">
            Previous
          </button>

          <button v-if="step < 4" class="btn btn-primary ms-auto" @click="nextStep">
            Next
          </button>

          <button v-if="step === 4" class="btn btn-success ms-auto" @click="validateSubmitProfile">
            Finish
          </button>
        </div>
      </div>
    </div>

    <confirmModal
      :show="showConfirmModal"
      title="Confirm Profile Completion"
      message="Are you sure all information you entered is correct?"
      confirm-text="Yes, Submit"
      @confirm="submitProfile"
      @cancel="closeConfirmModal"
    />
  </div>
</template>


<script>
import L from "leaflet";
import { RouterLink } from "vue-router";
import { completeProfile } from "@/api/user";
import { useUserInfo } from "@/store/userInfo";
import confirmModal from "@/components/confirmModal.vue";

export default {
  components: { RouterLink, confirmModal },

  data() {
    return {
      step: 1,
      map: null,
      marker: null,
      previewImg: null,
      showConfirmModal: false,
      loading: false,
      timeoutId: null,

      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        user_img: null,
        streets: "",
        region_name: "",
        state_name: "",
        town_name: "",
        village_name: "",
        latitude: null,
        longitude: null,
      },
    };
  },

  computed: {
    progress() {
      return (this.step / 4) * 100;
    },
    userInfo() {
      return useUserInfo();
    },
  },

  mounted() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.form.latitude = pos.coords.latitude;
        this.form.longitude = pos.coords.longitude;
      },
      () => alert("Unable to get your location."),
      { enableHighAccuracy: true }
    );
  },

  watch: {
    step(val) {
      if (val === 3) {
        this.$nextTick(() => {
          if (!this.map) this.initMap();
          this.setAddressFields();
        });
      }
    },

    "form.latitude"() {
      this.setAddressFields();
    },
    "form.longitude"() {
      this.setAddressFields();
    },

    userInfo: {
      immediate: true,
      handler(user) {
        if (!user) return;
        this.form.first_name = user.first_name;
        this.form.last_name = user.last_name;
        this.form.email = user.email;
      },
    },
  },

  methods: {
    async setAddressFields() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.loading = true;

      this.timeoutId = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${this.form.latitude}&lon=${this.form.longitude}&format=jsonv2`
          );
          const data = await res.json();

          this.form.region_name = data.address.region || "";
          this.form.state_name = data.address.state || "";
          this.form.town_name = data.address.city || data.address.town || "";
          this.form.village_name = data.address.village || data.address.suburb || "";
        } finally {
          this.loading = false;
        }
      }, 1000);
    },

    initMap() {
      this.map = L.map("map").setView([this.form.latitude, this.form.longitude], 16);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);

      this.marker = L.marker([this.form.latitude, this.form.longitude], { draggable: true }).addTo(this.map);

      this.marker.on("dragend", e => {
        const p = e.target.getLatLng();
        this.form.latitude = p.lat;
        this.form.longitude = p.lng;
      });

      this.map.on("click", e => {
        this.marker.setLatLng(e.latlng);
        this.form.latitude = e.latlng.lat;
        this.form.longitude = e.latlng.lng;
      });
    },

    handleImageUpload(e) {
      const file = e.target.files[0];
      this.form.user_img = file;
      this.previewImg = URL.createObjectURL(file);
    },

    nextStep() { this.step++; },
    prevStep() { this.step--; },

    validateSubmitProfile() {
      const required = [
        "phone_number",
        "streets",
        "latitude",
        "longitude",
      ];

      for (const f of required) {
        if (!this.form[f]) {
          alert("Please complete all required fields.");
          return;
        }
      }

      this.showConfirmModal = true;
    },

    closeConfirmModal() {
      this.showConfirmModal = false;
    },

    async submitProfile() {
      this.showConfirmModal = false;
      const fd = new FormData();
      Object.entries(this.form).forEach(([k, v]) => v && fd.append(k, v));
      await completeProfile(fd);
      alert("Profile completed successfully!");
      this.$router.push("/profile");
    },
  },
};
</script>


<style>

  .modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-custom {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
}


</style>
