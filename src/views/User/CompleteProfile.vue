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
          <p class="text-muted small mt-2">Step {{ step }} of 4</p>
        </div>

        <!-- Step 1: Basic Info -->
        <div v-if="step === 1">
          <h4 class="fw-bold mb-3">Basic Information</h4>
          <div class="row g-3">
            <div class="col-md-6">
              <input 
                type="text" 
                class="form-control form-control-lg rounded-3" 
                placeholder="First Name" 
                v-model="form.first_name"
                disabled
              />
            </div>
            <div class="col-md-6">
              <input 
                type="text" 
                class="form-control form-control-lg rounded-3" 
                placeholder="Last Name" 
                v-model="form.last_name"
                disabled
              />
            </div>
            <div class="col-md-12">
              <input 
                type="email" 
                class="form-control form-control-lg rounded-3" 
                placeholder="Email Address" 
                v-model="form.email"
                disabled
              />
            </div>
            <div class="col-md-12">
              <input 
                type="text" 
                class="form-control form-control-lg rounded-3" 
                placeholder="Phone Number" 
                v-model="form.phone_number"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Profile Picture -->
        <div v-if="step === 2">
          <h4 class="fw-bold mb-3">Profile Picture</h4>
          <div class="text-center">
            <div class="profile-preview mx-auto mb-3">
              <img 
                v-if="previewImg" 
                :src="previewImg" 
                class="img-fluid rounded-circle" 
                style="width: 120px; height: 120px; object-fit: cover;"
              />
              <i v-else class="bi bi-person-circle text-secondary fs-1"></i>
            </div>
            <input type="file"  class="form-control" @change="handleImageUpload" />
          </div>
        </div>

        <!-- Step 3: Address -->
        <div v-if="step === 3">
          <h4 class="fw-bold mb-3">Address Details</h4>
          <div class="row g-3">
            <div class="col-md-6">
              <input 
                type="text" 
                class="form-control form-control-lg rounded-3" 
                placeholder="Street" 
                v-model="form.streets"
              />
            </div>
            <div class="col-md-6">
              <select v-model="form.region_id" class="form-select form-select-lg rounded-3" @change="getProvinces">
                <option value="" disabled>Select Region</option>
                <option 
                  v-for="region in regions" 
                  :key="region.id" 
                  :value="region.id"
                  :data-code="region.regCode"
                >
                  {{ region.regDesc }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <select v-model="form.province_id" class="form-select form-select-lg rounded-3" @change="getMuncities">
                <option value="" disabled>Select Province</option>
                <option 
                  v-for="province in provinces" 
                  :key="province.id" 
                  :value="province.id"
                  :data-code="province.provCode"
                >
                  {{ province.provDesc }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <select v-model="form.muncity_id" class="form-select form-select-lg rounded-3" @change="getBarangays">
                <option value="" disabled>Select Municipal / City</option>
                <option 
                  v-for="muncity in muncities" 
                  :key="muncity.id" 
                  :value="muncity.id"
                  :data-code="muncity.muncityCode"
                >
                  {{ muncity.muncityDesc }}
                </option>
              </select>
            </div>
            <div class="col-md-12">
              <select v-model="form.barangay_id" class="form-select form-select-lg rounded-3">
                <option value="" disabled>Select Barangays</option>
                <option 
                  v-for="brgy in barangays" 
                  :key="brgy.id" 
                  :value="brgy.id"
                >
                  {{ brgy.brgyDesc }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 4: Location -->
        <div v-if="step === 4">
          <h4 class="fw-bold mb-3">Your Location</h4>
          <p class="text-muted small">We’ll use this to help you find nearby properties.</p>
          <div id="map" class="rounded shadow-sm" style="height: 40vh;"></div>
          <!-- optional live coords display -->
          <div class="mt-2 small text-muted">
            Lat: <strong>{{ form.latitude ? form.latitude.toFixed(6) : '—' }}</strong> ,
            Lng: <strong>{{ form.longitude ? form.longitude.toFixed(6) : '—' }}</strong>
          </div>
        </div>

        <!-- Navigation -->
        <div class="d-flex justify-content-between mt-4">
          <button 
            v-if="step > 1" 
            class="btn btn-outline-secondary rounded-3 px-4"
            @click="prevStep"
          >
            Previous
          </button>
          <button 
            v-if="step < 4" 
            class="btn btn-primary rounded-3 px-4 ms-auto"
            @click="nextStep"
          >
            Next
          </button>
          <button 
            v-if="step === 4" 
            class="btn btn-success rounded-3 px-4 ms-auto"
            @click="submitProfile"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProvinces, getRegion, getMunCities, getBarangays } from "@/api/property";
import { useUserInfo } from "@/store/userInfo";
import L from "leaflet";
import { RouterLink } from "vue-router";
import { completeProfile } from "@/api/user";

export default {
  name: "CompleteProfile",
  components: { RouterLink },
  data() {
    return {
      step: 1,
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
      previewImg: null,
      regions: [],
      provinces: [],
      muncities: [], // <<-- fixed name (was cities)
      barangays: [],
      map: null,
      marker: null,
      location: null,
    };
  },
  mounted() {
    // load region list
    this.getRegions();

    // get user's geolocation and store coords (do NOT initialize map here)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError,
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      // just set fallback coords in data; map will initialize when step === 4
      this.form.latitude = 8.228;
      this.form.longitude = 124.245;
    }
  },
  computed: {
    progress() {
      return (this.step / 4) * 100;
    },
    userInfo() {
      return useUserInfo();
    }
  },
  watch: {
    // initialize map only when step 4 is active and map hasn't been created yet
    step(newStep) {
      if (newStep === 4) {
        this.$nextTick(() => {
          if (!this.map) {
            const lat = this.form.latitude || (this.location && this.location.lat) || 8.228;
            const lng = this.form.longitude || (this.location && this.location.lng) || 124.245;
            this.setMap(lat, lng);
          } else {
            // ensure map redraw if container changed/display toggled
            try { this.map.invalidateSize(); } catch (e) { /* ignore */ }
          }
        });
      }
    },

    // load user info into form reactively (keeps first/last/email set)
    userInfo: {
      handler(newVal) {
        if (newVal?.first_name) {
          this.form.first_name = newVal.first_name;
          this.form.last_name = newVal.last_name;
          this.form.email = newVal.email;
        }
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    nextStep() {
      if (this.step < 4) this.step++;
    },
    prevStep() {
      if (this.step > 1) this.step--;
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // store File object in form for submission, keep preview URL for UI
        this.form.user_img = file;
        this.previewImg = URL.createObjectURL(file);
      }
    },

    // When geolocation returns, just save coords — don't init map here (map may not be in DOM)
    handleLocationSuccess(position) {
      this.location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.form.latitude = this.location.lat;
      this.form.longitude = this.location.lng;

      // If user is already on step 4, create map safely now
      if (this.step === 4 && !this.map) {
        this.$nextTick(() => {
          const lat = this.form.latitude || this.location.lat;
          const lng = this.form.longitude || this.location.lng;
          this.setMap(lat, lng);
        });
      }
    },

    handleLocationError(error) {
      console.warn("Failed to get location:", error && error.message);
      // just set fallback coords — map will initialize via watcher when step 4 is shown
      this.form.latitude = 8.228;
      this.form.longitude = 124.245;
    },

    // create map once and add a draggable marker that updates form coords
    setMap(lat, lng) {
      // Safety: ensure DOM exists (we call from watcher with $nextTick)
      if (!document.getElementById("map")) {
        console.error("Map container not found when trying to initialize map.");
        return;
      }

      // If map already exists, update view & marker
      if (this.map) {
        try {
          this.map.setView([lat, lng], 15);
          if (this.marker) {
            this.marker.setLatLng([lat, lng]);
          } else {
            this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
            this.marker.on("dragend", (e) => {
              const pos = e.target.getLatLng();
              this.form.latitude = pos.lat;
              this.form.longitude = pos.lng;
            });
          }
        } catch (e) {
          console.warn("Error updating existing map:", e);
        }
        return;
      }

      // Create the map
      this.map = L.map("map", { zoomControl: false }).setView([lat, lng], 15);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      L.control.zoom({ position: "topright" }).addTo(this.map);

      // Add draggable marker
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

      this.marker.on("dragend", (e) => {
        const pos = e.target.getLatLng();
        this.form.latitude = pos.lat;
        this.form.longitude = pos.lng;
      });

      // Click on map moves marker
      this.map.on("click", (e) => {
        const { lat: clat, lng: clng } = e.latlng;
        if (this.marker) {
          this.marker.setLatLng([clat, clng]);
        } else {
          this.marker = L.marker([clat, clng], { draggable: true }).addTo(this.map);
          this.marker.on("dragend", (ev) => {
            const pos = ev.target.getLatLng();
            this.form.latitude = pos.lat;
            this.form.longitude = pos.lng;
          });
        }
        this.form.latitude = clat;
        this.form.longitude = clng;
      });

      // initialize form coords
      this.form.latitude = lat;
      this.form.longitude = lng;
    },

    async submitProfile() {
        try {
            const formData = new FormData();

            for (const key in this.form) {
                const value = this.form[key];

                // Handle thumbnail
                if (key === "user_img") {
                if (value) formData.append("user_img", value);
                }
                // Handle array fields properly
                else if (Array.isArray(value)) {
                value.forEach((v) => {
                    formData.append(`${key}[]`, v);
                });
                }
                // Handle booleans -> cast to 1/0
                else if (typeof value === "boolean") {
                formData.append(key, value ? 1 : 0);
                }
                // Handle numbers and strings
                else if (value !== null && value !== undefined) {
                formData.append(key, value);
                }
            }   

            console.log(formData);

            const res = await completeProfile(formData);

            console.log("Profile saved:", res.data);
            alert("Profile completed successfully!");
            this.$router.push("/profile")
        } catch (err) {
            console.error("Profile submit error:", err);
            alert("Something went wrong. Please try again.");
        }
    },

    /* --- API helpers for address dropdowns --- */
    async getRegions() {
      try {
        const res = await getRegion();
        this.regions = res;
      } catch (error) {
        console.error("Region Error:", error);
      }
    },

    async getProvinces(event) {
      try {
        const regCode = event.target.options[event.target.selectedIndex].dataset.code;
        const res = await getProvinces(regCode);
        this.provinces = res;
        this.muncities = [];
        this.barangays = [];
        this.form.province_id = "";
        this.form.muncity_id = "";
        this.form.barangay_id = "";
      } catch (err) {
        console.error("Provinces Error:", err);
      }
    },

    async getMuncities(event) {
      try {
        const provCode = event.target.options[event.target.selectedIndex].dataset.code;
        const res = await getMunCities(provCode);
        this.muncities = res;
        this.barangays = [];
        this.form.muncity_id = "";
        this.form.barangay_id = "";
      } catch (err) {
        console.error("Muncities Error:", err);
      }
    },

    async getBarangays(event) {
      try {
        const muncityCode = event.target.options[event.target.selectedIndex].dataset.code;
        const res = await getBarangays(muncityCode);
        this.barangays = res;
        this.form.barangay_id = "";
      } catch (err) {
        console.error("Barangays Error:", err);
      }
    },
  },
};
</script>

<style scoped>
.progress {
  background-color: #e9ecef;
}

.profile-preview {
  width: 120px;
  height: 120px;
  border: 2px dashed #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
