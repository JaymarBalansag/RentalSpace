<template>
  <Header />
  <div class="complete-page container py-4 py-lg-5">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <section class="complete-hero rounded-4 shadow-sm p-4 p-md-5 mb-4">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="small text-uppercase mb-1 hero-kicker">Onboarding</p>
              <h2 class="fw-bold text-primary mb-1">Complete Your Profile</h2>
              <p class="text-muted mb-0 small">Finish these steps to unlock booking and owner messaging.</p>
            </div>
            <RouterLink to="/profile" class="btn btn-link text-muted text-decoration-none">
            <i class="bi bi-x-lg"></i> Cancel
            </RouterLink>
          </div>
        </section>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <div class="step-wizard d-flex justify-content-between position-relative mb-4">
              <div class="progress-line"></div>
              <div v-for="n in 4" :key="n" class="step-item" :class="{ 'active': step >= n }">
                <span class="step-number">{{ n }}</span>
              </div>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar bg-primary transition-all" :style="{ width: progress + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-body p-4 p-md-5">

            <div v-if="step === 1" class="animate-fade-in">
              <div class="mb-4">
                <h4 class="fw-bold mb-1">Personal Details</h4>
                <p class="text-muted small">Verify your identity and provide a contact number.</p>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">First Name</label>
                  <input class="form-control bg-light" v-model="form.first_name" disabled />
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Last Name</label>
                  <input class="form-control bg-light" v-model="form.last_name" disabled />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Email Address</label>
                  <input class="form-control bg-light" v-model="form.email" disabled />
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Phone Number <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-white"><i class="bi bi-phone"></i></span>
                    <input 
                      class="form-control input-modern" 
                      placeholder="09123456789" 
                      v-model="form.phone_number" 
                      type="tel" 
                      inputmode="numeric"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="step === 2" class="animate-fade-in text-center py-4">
              <div class="mb-4">
                <h4 class="fw-bold mb-1">Profile Photo</h4>
                <p class="text-muted small">A photo helps people recognize you.</p>
              </div>
              <div class="upload-area mx-auto position-relative">
                <div class="preview-circle shadow">
                  <img v-if="previewImg" :src="previewImg" class="img-fluid rounded-circle h-100 w-100 object-fit-cover" />
                  <i v-else class="bi bi-person-circle display-1 text-light-emphasis"></i>
                </div>
                <label for="fileUpload" class="btn btn-primary btn-sm rounded-pill floating-upload-btn shadow">
                  <i class="bi bi-camera-fill me-1"></i> Choose Photo
                </label>
                <input id="fileUpload" type="file" class="d-none" @change="handleImageUpload" accept="image/*" />
              </div>
            </div>

            <div v-show="step === 3" class="animate-fade-in">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h4 class="fw-bold mb-1">Locate Your Residence</h4>
                  <p class="text-muted small mb-0">Drag the marker or click on the map to pin your location.</p>
                </div>
                <div v-if="loading" class="spinner-border spinner-border-sm text-primary"></div>
              </div>

              <div ref="mapEl" style="height:350px" class="rounded-4 shadow-sm border mb-4"></div>

              <div class="row g-2">
                <div class="col-md-4"><input class="form-control form-control-sm bg-light" v-model="form.town_name" disabled placeholder="City"></div>
                <div class="col-md-4"><input class="form-control form-control-sm bg-light" v-model="form.village_name" disabled placeholder="Barangay"></div>
                <div class="col-md-4"><input class="form-control form-control-sm input-modern" v-model="form.streets" placeholder="Street Name *"></div>
              </div>
            </div>

            <div v-if="step === 4" class="animate-fade-in">
              <div class="mb-4">
                <h4 class="fw-bold mb-1">Review Details</h4>
                <p class="text-muted small">Please verify your information before submitting.</p>
              </div>
              <div class="table-responsive">
                <table class="table table-sm border-0">
                  <tbody>
                    <tr><td class="text-muted small">Name</td><td class="fw-bold">{{ form.first_name }} {{ form.last_name }}</td></tr>
                    <tr><td class="text-muted small">Contact</td><td class="fw-bold">{{ form.phone_number }}</td></tr>
                    <tr><td class="text-muted small">Location</td><td class="fw-bold">{{ form.village_name }}, {{ form.town_name }}, {{ form.state_name }}</td></tr>
                    <tr><td class="text-muted small">Street</td><td class="fw-bold">{{ form.streets }}</td></tr>
                  </tbody>
                </table>
              </div>
              <div class="alert alert-info py-2 small d-flex align-items-center">
                <i class="bi bi-info-circle me-2"></i> By clicking Finish, you agree to our terms of service.
              </div>
            </div>

            <div class="d-flex justify-content-between mt-5 pt-3 border-top">
              <button v-if="step > 1" class="btn btn-light rounded-pill px-4" @click="prevStep">Back</button>
              <div v-else></div>

              <button v-if="step < 4" class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm" @click="nextStep">
                Next <i class="bi bi-arrow-right ms-1"></i>
              </button>

              <button v-else :disabled="loading" class="btn btn-success rounded-pill px-5 fw-bold shadow-sm d-flex align-items-center gap-2" @click="validateSubmitProfile">
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
                {{ loading ? 'Saving...' : 'Finish Profile' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <confirmModal
      :show="showConfirmModal"
      title="Submit Profile?"
      message="Ensure all your details are correct. You can edit this later in your settings."
      confirm-text="Yes, Submit Profile"
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
import Header from "@/components/Header.vue";
import 'leaflet/dist/leaflet.css';
import Swal from "sweetalert2";

// Fix for Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

export default {
  components: { RouterLink, confirmModal, Header },
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
    progress() { return (this.step / 4) * 100; },
    userInfo() { return useUserInfo(); },
  },
  watch: {
    step(val) {
      if (val === 3) {
        this.$nextTick(() => {
          if (!this.map) {
            this.initMap();
          } else {
            this.map.invalidateSize();
          }
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
    'form.phone_number'(val) {
      if (!val) return;

      // 1. Remove all non-numeric characters
      let cleaned = val.replace(/\D/g, '');

      // 2. Force the start to be '09'
      // If they type '9', turn it into '09'. If they type anything else first, reset it to '09'
      if (cleaned.length > 0 && !cleaned.startsWith('09')) {
        if (cleaned.startsWith('9')) {
          cleaned = '0' + cleaned;
        } else {
          cleaned = '09';
        }
      }

      // 3. Limit to 11 digits
      this.form.phone_number = cleaned.substring(0, 11);
    },
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.form.latitude = pos.coords.latitude;
        this.form.longitude = pos.coords.longitude;
      },
      () => console.warn("GPS access denied, using default coordinates."),
      { enableHighAccuracy: true }
    );
  },
  methods: {
    async setAddressFields() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.loading = true;
      this.timeoutId = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${this.form.latitude}&lon=${this.form.longitude}&format=jsonv2`);
          const data = await res.json();
          this.form.region_name = data.address.region || "";
          this.form.state_name = data.address.state || "";
          this.form.town_name = data.address.city || data.address.town || "";
          this.form.village_name = data.address.village || data.address.suburb || "";
        } catch (e) {
          console.error("Geocoding failed", e);
        } finally {
          this.loading = false;
        }
      }, 800);
    },
    initMap() {
      const lat = this.form.latitude || 14.5995;
      const lng = this.form.longitude || 120.9842;

      if (this.map) {
        this.map.setView([lat, lng], 16);
        if (this.marker) {
          this.marker.setLatLng([lat, lng]);
        }
        this.map.invalidateSize();
        return;
      }

      this.map = L.map(this.$refs.mapEl).setView([lat, lng], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
      
      this.setAddressFields(); // Initial geocode

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 250);

      this.marker.on("dragend", e => {
        const p = e.target.getLatLng();
        this.form.latitude = p.lat;
        this.form.longitude = p.lng;
        this.setAddressFields();
      });

      this.map.on("click", e => {
        this.marker.setLatLng(e.latlng);
        this.form.latitude = e.latlng.lat;
        this.form.longitude = e.latlng.lng;
        this.setAddressFields();
      });
    },
    handleImageUpload(e) {
      const file = e.target.files[0];
      if (file) {
        this.form.user_img = file;
        this.previewImg = URL.createObjectURL(file);
      }
    },
    nextStep() { 
      if (this.step === 1) {
        const phone = this.form.phone_number;

        // Check if it's exactly 11 digits and starts with 09
        const phPhoneRegex = /^09\d{9}$/;
        
        if (!phone || !phPhoneRegex.test(phone)) {
          Swal.fire({
            icon: "warning",
            title: "Invalid Phone Number",
            text: "Please enter a valid 11-digit mobile number starting with 09 (e.g., 09123456789).",
          });
          return;
        }
      }
      
      this.step++;
    },
    prevStep() { this.step--; },
    validateSubmitProfile() {
      if (!this.form.streets) {
        Swal.fire({
          icon: "warning",
          title: "Street Required",
          text: "Please enter your street name.",
        });
        return;
      }

      const hasCoordinates =
        Number.isFinite(Number(this.form.latitude)) &&
        Number.isFinite(Number(this.form.longitude));

      if (!hasCoordinates) {
        Swal.fire({
          icon: "warning",
          title: "Location Required",
          text: "Please pin your location on the map before submitting.",
        });
        return;
      }

      this.showConfirmModal = true;
    },
    closeConfirmModal() { this.showConfirmModal = false; },
    async submitProfile() {
      this.loading = true;
      this.showConfirmModal = false;
      const fd = new FormData();
      Object.entries(this.form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") fd.append(k, v);
      });
      try {
        await completeProfile(fd);
        const info = useUserInfo();
        await info.completeProfileInPage(this.form.first_name, this.form.last_name, this.previewImg);
        await Swal.fire({
          icon: "success",
          title: "Profile Completed",
          text: "Your profile has been updated successfully.",
          timer: 1400,
          showConfirmButton: false,
        });
        // this.$router.push("/profile");
        window.location.href="/profile"
      } catch (error) {
        const message = error?.response?.data?.message || "Failed to save profile. Please try again.";
        await Swal.fire({
          icon: "error",
          title: "Profile Save Failed",
          text: message,
        });
      } finally {
        this.loading = false;
      }
    },
  },
  beforeUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  },
};
</script>

<style scoped>
.complete-page {
  background: radial-gradient(circle at top right, rgba(71, 128, 217, 0.08) 0%, rgba(255, 255, 255, 0) 55%);
}

.complete-hero {
  border: 1px solid #e7eefb;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f7ff 100%);
}

.hero-kicker {
  color: #4871b3;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.transition-all { transition: width 0.4s ease; }
.animate-fade-in { animation: fadeIn 0.3s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* Step Wizard Styling */
.step-wizard { margin: 0 1rem; }
.progress-line { position: absolute; top: 50%; left: 0; width: 100%; height: 2px; background: #e9ecef; z-index: 1; transform: translateY(-50%); }
.step-item { position: relative; z-index: 2; width: 30px; height: 30px; background: white; border: 2px solid #dee2e6; border-radius: 50%; transition: 0.3s; }
.step-item.active { border-color: #4b81dc; background: #4b81dc; }
.step-number { font-size: 12px; font-weight: bold; color: #adb5bd; line-height: 26px; text-align: center; display: block; }
.step-item.active .step-number { color: white; }

/* Upload Area */
.upload-area { width: 150px; height: 150px; }
.preview-circle { width: 150px; height: 150px; border-radius: 50%; background: #f8f9fa; border: 3px solid #eee; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.floating-upload-btn { position: absolute; bottom: 0; right: 0; }

.input-modern {
  border: 1px solid #dbe5f5;
  border-radius: 12px;
}

.input-modern:focus {
  border-color: #4c82de;
  box-shadow: 0 0 0 0.2rem rgba(76, 130, 222, 0.16);
}

.letter-spacing-1 { letter-spacing: 1px; }
</style>

