<template>
  <Header />

  <div class="edit-profile-page container py-4" style="max-width: 900px;">
    <RouterLink to="/profile" class="btn btn-outline-secondary rounded-pill px-3 mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <section class="profile-hero rounded-4 p-4 p-md-5 mb-4 shadow-sm">
      <p class="small text-uppercase mb-1 hero-kicker">Account Center</p>
      <h3 class="fw-bold mb-2">Update Profile</h3>
      <p class="mb-0 text-muted">Keep your profile accurate for smoother booking, messaging, and recommendations.</p>
    </section>

    <div class="card shadow-sm border-0 rounded-4">
      <div class="card-body p-4 p-md-5">
        <h5 class="section-title mb-3">Basic Information</h5>

        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label class="form-label fw-semibold small text-uppercase text-muted">First Name</label>
            <input class="form-control input-modern" v-model="form.first_name" />
            <small v-if="errors.first_name" class="text-danger">
              {{ errors.first_name }}
            </small>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold small text-uppercase text-muted">Last Name</label>
            <input class="form-control input-modern" v-model="form.last_name" />
            <small v-if="errors.last_name" class="text-danger">
              {{ errors.last_name }}
            </small>
          </div>

          <div class="col-md-12">
            <label class="form-label fw-semibold small text-uppercase text-muted">Email</label>
            <input class="form-control input-modern bg-light" v-model="form.email" disabled />
          </div>

          <div class="col-md-12">
            <label class="form-label fw-semibold small text-uppercase text-muted">Phone Number</label>
            <div class="input-group input-modern-group">
              <span class="input-group-text bg-light"><i class="bi bi-phone"></i></span>
              <input 
                class="form-control input-modern" 
                v-model="form.phone_number" 
                placeholder="09123456789"
                inputmode="numeric"
              />
            </div>
            <small v-if="errors.phone_number" class="text-danger">
              {{ errors.phone_number }}
            </small>
          </div>
        </div>

        <div class="profile-picture-shell rounded-4 p-4 mb-4">
          <h5 class="section-title mb-3">Profile Picture</h5>
          <div class="text-center">
            <img
              v-if="previewImg"
              :src="previewImg"
              class="rounded-circle mb-3 profile-preview"
            />
            <i v-else class="bi bi-person-circle fs-1 text-secondary"></i>

              <input
                type="file"
                class="form-control mt-3"
              accept="image/png,image/jpeg,image/webp"
                @change="handleImageUpload"
              />
 
            <small class="d-block text-muted small mt-2">Accepted file types: JPG, PNG (auto-compressed to WebP, max 2MB upload)</small>
            <small v-if="errors.user_img" class="text-danger d-block mt-2">
              {{ errors.user_img }}
            </small>
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <button
            class="btn btn-primary rounded-pill px-4 fw-semibold"
            :disabled="loading || !isFormValid || !isFormChanged"
            @click="updateProfile"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
 import Header from "@/components/Header.vue";
 import { getUserProfile, updateUserProfile } from "@/api/user";
 import { useUserInfo } from "@/store/userInfo";
 import Swal from "sweetalert2";
import { compressImageToWebpFile } from "@/utils/compressToWebp";

export default {
  name: "EditProfilePage",
  components: { RouterLink, Header },

   data() {
     return {
       loading: false,
       originalForm: null,

      form: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        region_name: "",
        state_name: "",
        town_name: "",
        village_name: "",
        streets: "",
      },

       previewImg: null,
      previewImgObjectUrl: null,
       imageFile: null,
      imageFileOriginal: null,
       errors: {},
     };
   },

  computed: {
    isFormChanged() {
      if (!this.originalForm) return false;
      return (
        JSON.stringify(this.form) !== JSON.stringify(this.originalForm) ||
        this.imageFile !== null
      );
    },

    isFormValid() {
      return Object.keys(this.errors).length === 0;
    },
  },

   methods: {
     /* ================= IMAGE VALIDATION ================= */
    async handleImageUpload(event) {
      const file = event?.target?.files?.[0] || null;
      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxInputSize = 10 * 1024 * 1024; // 10MB safety cap
      const maxUploadSize = 2 * 1024 * 1024; // 2MB (as per UI)

      if (!allowedTypes.includes(file.type)) {
        this.errors.user_img = "Only JPG, PNG, or WEBP images are allowed.";
        return;
      }

      if (file.size > maxInputSize) {
        this.errors.user_img = "Image must be less than 10MB.";
        return;
      }

      this.imageFileOriginal = file;

       let chosen = file;
       try {
         const { file: webpFile } = await compressImageToWebpFile(file, {
           quality: 0.82,
           maxWidth: 512,
           maxHeight: 512,
           filenameSuffix: "profile",
           keepOriginalIfLarger: false,
         });
         chosen = webpFile || file;
       } catch {
         chosen = file;
       }

      if ((chosen?.size || 0) > maxUploadSize) {
        this.errors.user_img = "Image must be less than 2MB.";
        return;
      }

      delete this.errors.user_img;

      this.imageFile = chosen;
      if (this.previewImgObjectUrl) URL.revokeObjectURL(this.previewImgObjectUrl);
      this.previewImgObjectUrl = URL.createObjectURL(chosen);
      this.previewImg = this.previewImgObjectUrl;
    },

    /* ================= FORM VALIDATION ================= */
    validateForm() {
      this.errors = {};

      if (!this.form.first_name.trim()) {
        this.errors.first_name = "First name is required.";
      }

      if (!this.form.last_name.trim()) {
        this.errors.last_name = "Last name is required.";
      }

      const phPhoneRegex = /^09\d{9}$/;
      if (!this.form.phone_number) {
        this.errors.phone_number = "Phone number is required.";
      } else if (!phPhoneRegex.test(this.form.phone_number)) {
        this.errors.phone_number = "Must be a valid 11-digit number starting with 09.";
      }

      return Object.keys(this.errors).length === 0;
    },

     /* ================= UPDATE PROFILE ================= */
     async updateProfile() {
       if (!this.validateForm()) return;
       if (!this.isFormChanged) return;

       this.loading = true;

       try {
        const buildFormData = (overrideImg) => {
          const formData = new FormData();
          Object.keys(this.form).forEach(key => {
            formData.append(key, this.form[key] ?? "");
          });
          const img = overrideImg || this.imageFile;
          if (img) formData.append("user_img", img);
          return formData;
        };

        let response;
        try {
          response = await updateUserProfile(buildFormData(null));
        } catch (error) {
          const status = error?.response?.status;
          const msg = String(error?.response?.data?.message || error?.message || "");
          const looksLikeTypeRejection =
            status === 415 ||
            status === 422 ||
            /webp|mime|mimes|unsupported|type|format/i.test(msg);

          if (looksLikeTypeRejection && this.imageFileOriginal && this.imageFile && this.imageFile !== this.imageFileOriginal) {
            response = await updateUserProfile(buildFormData(this.imageFileOriginal));
          } else {
            throw error;
          }
        }

        await Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: response.data.message || "Profile updated successfully!",
        });

        const info = useUserInfo();
        const first_name = response.data.user.first_name
        const last_name = response.data.user.last_name
        const user_img_url = response.data.user.user_img_url

         info.updateUserProfile(first_name, last_name, user_img_url )
 
         this.originalForm = { ...this.form };
         this.imageFile = null;
        this.imageFileOriginal = null;
 
         // this.$router.push("/profile")
         window.location.href="/profile"

       } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: error.response?.data?.message || "Error updating profile.",
        });
      } finally {
        this.loading = false;
       }
     },

    /* ================= GET PROFILE ================= */
    async getUserProfile() {
      this.loading = true;
      try {
        const response = await getUserProfile();
        const user = response.data.user[0];

        this.form = {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          region_name: user.region_name || "",
          state_name: user.state_name || "",
          town_name: user.town_name || "",
          village_name: user.village_name || "",
          streets: user.streets || "",
        };

        this.originalForm = { ...this.form };
        this.previewImg = user.user_img_url || null;

      } catch {
        await Swal.fire({
          icon: "error",
          title: "Load Failed",
          text: "Error fetching user profile.",
        });
      } finally {
        this.loading = false;
      }
    },
  },

   mounted() {
     this.getUserProfile();
   },

  beforeUnmount() {
    if (this.previewImgObjectUrl) URL.revokeObjectURL(this.previewImgObjectUrl);
  },

   watch: {
     'form.phone_number'(val) {
       if (!val) return;

      // 1. Remove all non-numeric characters
      let cleaned = val.replace(/\D/g, '');

      // 2. Force '09' logic
      if (cleaned.length > 0 && !cleaned.startsWith('09')) {
        if (cleaned.startsWith('9')) {
          cleaned = '0' + cleaned;
        } else {
          cleaned = '09';
        }
      }

      // 3. Limit to 11 digits
      this.form.phone_number = cleaned.substring(0, 11);
    }
  },
};
</script>

<style scoped>
.edit-profile-page {
  background: radial-gradient(circle at top right, rgba(71, 128, 217, 0.08) 0%, rgba(255, 255, 255, 0) 55%);
}

.profile-hero {
  border: 1px solid #e7eefb;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f7ff 100%);
}

.hero-kicker {
  color: #4871b3;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #2a3c5f;
}

.input-modern {
  border: 1px solid #dbe5f5;
  border-radius: 12px;
  min-height: 46px;
}

.input-modern:focus {
  border-color: #4c82de;
  box-shadow: 0 0 0 0.2rem rgba(76, 130, 222, 0.16);
}

.input-modern-group .input-group-text {
  border-color: #dbe5f5;
  border-radius: 12px 0 0 12px;
}

.input-modern-group .input-modern {
  border-left: 0;
  border-radius: 0 12px 12px 0;
}

.profile-picture-shell {
  border: 1px solid #e7edf8;
  background: #fafcff;
}

.profile-preview {
  width: 122px;
  height: 122px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 10px 24px rgba(44, 84, 150, 0.18);
}
</style>
