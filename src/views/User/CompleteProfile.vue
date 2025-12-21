<template>
  <div class="container py-4">
    <div class="card shadow border-0 rounded-4">
      <div class="card-body p-4">
        <RouterLink to="/profile" class="btn btn-secondary mb-3">Back</RouterLink>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="progress" style="height: 8px;">
            <div
              class="progress-bar bg-primary"
              role="progressbar"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
          <p class="text-muted small mt-2">Step {{ step }} of 5</p>
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

        <!-- STEP 3: Address -->
        <div v-if="step === 3">
          <h4 class="fw-bold mb-3">Address Details</h4>
          <div class="row g-3">
            <div class="col-md-6">
              <input class="form-control form-control-lg" placeholder="Street" v-model="form.streets" />
            </div>

            <div class="col-md-6">
              <select class="form-select form-select-lg" v-model="form.region_id" @change="getProvinces">
                <option disabled value="">Select Region</option>
                <option v-for="r in regions" :key="r.id" :value="r.id" :data-code="r.regCode">
                  {{ r.regDesc }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <select class="form-select form-select-lg" v-model="form.province_id" @change="getMuncities">
                <option disabled value="">Select Province</option>
                <option v-for="p in provinces" :key="p.id" :value="p.id" :data-code="p.provCode">
                  {{ p.provDesc }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <select class="form-select form-select-lg" v-model="form.muncity_id" @change="getBarangays">
                <option disabled value="">Select Municipality</option>
                <option v-for="m in muncities" :key="m.id" :value="m.id" :data-code="m.muncityCode">
                  {{ m.muncityDesc }}
                </option>
              </select>
            </div>

            <div class="col-md-12">
              <select class="form-select form-select-lg" v-model="form.barangay_id">
                <option disabled value="">Select Barangay</option>
                <option v-for="b in barangays" :key="b.id" :value="b.id">
                  {{ b.brgyDesc }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- STEP 4: Map -->
        <div v-show="step === 4">
          <h4 class="fw-bold mb-3">Your Location</h4>
          <div id="map" style="height:40vh" class="rounded shadow"></div>
          <div class="small mt-2 text-muted">
            Lat: {{ form.latitude }} | Lng: {{ form.longitude }}
          </div>
        </div>

        <!-- STEP 5: SUMMARY -->
        <div v-if="step === 5">
          <h4 class="fw-bold mb-3">Summary</h4>

          <table class="table table-bordered">
            <tbody>
              <tr><th>First Name</th><td>{{ form.first_name }}</td></tr>
              <tr><th>Last Name</th><td>{{ form.last_name }}</td></tr>
              <tr><th>Email</th><td>{{ form.email }}</td></tr>
              <tr><th>Phone</th><td>{{ form.phone_number }}</td></tr>
              <tr><th>Street</th><td>{{ form.streets }}</td></tr>
              <tr><th>Region ID</th><td>{{ form.region_id }}</td></tr>
              <tr><th>Province ID</th><td>{{ form.province_id }}</td></tr>
              <tr><th>Municipality ID</th><td>{{ form.muncity_id }}</td></tr>
              <tr><th>Barangay ID</th><td>{{ form.barangay_id }}</td></tr>
              <tr><th>Latitude</th><td>{{ form.latitude }}</td></tr>
              <tr><th>Longitude</th><td>{{ form.longitude }}</td></tr>
            </tbody>
          </table>
        </div>

        <!-- NAVIGATION -->
        <div class="d-flex justify-content-between mt-4">
          <button v-if="step > 1" class="btn btn-outline-secondary" @click="prevStep">
            Previous
          </button>

          <button v-if="step < 5" class="btn btn-primary ms-auto" @click="nextStep">
            Next
          </button>

          <button v-if="step === 5" class="btn btn-success ms-auto" @click="validateSubmitProfile">
            Finish
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <confirmModal
      :show="showConfirmModal"
      title="Confirm Profile Completion"
      message="Are you sure all the information you entered is correct?"
      confirm-text="Yes, Submit"
      @confirm="submitProfile"
      @cancel="closeConfirmModal"
    />



  </div>
</template>

<script>
import L from "leaflet";
import { RouterLink } from "vue-router";
import { getRegion, getProvinces, getMunCities, getBarangays } from "@/api/property";
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
      isSubmitting: false,

      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        user_img: null,
        streets: "",
        region_id: "",
        province_id: "",
        muncity_id: "",
        barangay_id: "",
        latitude: null,
        longitude: null,
      },

      regions: [],
      provinces: [],
      muncities: [],
      barangays: [],
    };
  },

  computed: {
    progress() {
      return (this.step / 5) * 100;
    },
    userInfo() {
      return useUserInfo();
    },
  },

  mounted() {
    this.getRegions();

    navigator.geolocation.getCurrentPosition(
      pos => {
        this.form.latitude = pos.coords.latitude;
        this.form.longitude = pos.coords.longitude;
      },
      () => {
        this.form.latitude = 12.8797;
        this.form.longitude = 121.774;
      }
    );
  },

  watch: {
    step(val) {
      if (val === 4) {
        this.$nextTick(() => {
          if (!this.map) this.initMap();
          else this.map.invalidateSize();
        });
      }
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
    initMap() {
      this.map = L.map("map").setView([this.form.latitude, this.form.longitude], 15);
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

    async getRegions() { this.regions = await getRegion(); },
    async getProvinces(e) { this.provinces = await getProvinces(e.target.selectedOptions[0].dataset.code); },
    async getMuncities(e) { this.muncities = await getMunCities(e.target.selectedOptions[0].dataset.code); },
    async getBarangays(e) { this.barangays = await getBarangays(e.target.selectedOptions[0].dataset.code); },

    nextStep() { this.step++; },
    prevStep() { this.step--; },

    async submitProfile() {
      try {
        this.showConfirmModal = false;
        this.isSubmitting = true;

        const fd = new FormData();
        Object.entries(this.form).forEach(([k, v]) => {
          if (v) fd.append(k, v);
        });

        const res = await completeProfile(fd);


        // Update Pinia store
        const userStore = useUserInfo();
        userStore.profile_photo = res.data.userImage;

        // this.showSuccessToast("Profile completed successfully!");
        alert("Profile completed successfully!");
        setTimeout(() => {
          this.$router.push("/profile");
        }, 1500);

      } catch (err) {
        alert("Something went wrong. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
    },

    validateSubmitProfile() {
      const requiredFields = [
        "phone_number",
        "streets",
        "region_id",
        "province_id",
        "muncity_id",
        "barangay_id",
        "latitude",
        "longitude",
      ];

      for (const field of requiredFields) {
        if (!this.form[field]) {
          // this.showErrorToast("Please complete all required fields.");
          alert("Please complete all required fields.");
          return;
        }
      }

      // Passed validation → show modal
      this.showConfirmModal = true;
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
    },

    async confirmSubmit() {
      this.showConfirmModal = false;
      await this.submitProfile();
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
