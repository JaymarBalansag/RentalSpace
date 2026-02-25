<template>
  <Header />

  <div class="container py-4" style="max-width: 800px;">
    <!-- Back Button -->
    <RouterLink to="/profile" class="btn btn-outline-secondary mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back
    </RouterLink>

    <div class="card shadow border-0 rounded-4">
      <div class="card-body p-4">
        <h3 class="fw-bold mb-4">Edit Profile</h3>

        <!-- ================= BASIC INFO ================= -->
        <h5 class="fw-bold mb-3">Basic Information</h5>
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label class="form-label">First Name</label>
            <input class="form-control" v-model="form.first_name" />
            <small v-if="errors.first_name" class="text-danger">
              {{ errors.first_name }}
            </small>
          </div>

          <div class="col-md-6">
            <label class="form-label">Last Name</label>
            <input class="form-control" v-model="form.last_name" />
            <small v-if="errors.last_name" class="text-danger">
              {{ errors.last_name }}
            </small>
          </div>

          <div class="col-md-12">
            <label class="form-label">Email</label>
            <input class="form-control" v-model="form.email" disabled />
          </div>

          <div class="col-md-12">
            <label class="form-label">Phone Number</label>
            <div class="input-group">
              <span class="input-group-text bg-light"><i class="bi bi-phone"></i></span>
              <input 
                class="form-control" 
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

        <!-- ================= PROFILE PICTURE ================= -->
        <h5 class="fw-bold mb-3">Profile Picture</h5>
        <div class="text-center mb-4">
          <img
            v-if="previewImg"
            :src="previewImg"
            class="rounded-circle mb-3"
            style="width:120px;height:120px;object-fit:cover"
          />
          <i v-else class="bi bi-person-circle fs-1 text-secondary"></i>

          <input
            type="file"
            class="form-control mt-3"
            accept="image/png,image/jpeg"
            @change="handleImageUpload"
          />

          <small v-if="errors.user_img" class="text-danger d-block mt-2">
            {{ errors.user_img }}
          </small>
        </div>

        <!-- ================= SAVE BUTTON ================= -->
        <div class="text-end">
          <button
            class="btn btn-success"
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
      imageFile: null,
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
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        this.errors.user_img = "Only JPG or PNG images are allowed.";
        return;
      }

      if (file.size > maxSize) {
        this.errors.user_img = "Image must be less than 2MB.";
        return;
      }

      delete this.errors.user_img;

      this.imageFile = file;
      this.previewImg = URL.createObjectURL(file);
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
        const formData = new FormData();

        Object.keys(this.form).forEach(key => {
          formData.append(key, this.form[key] ?? "");
        });

        if (this.imageFile) {
          formData.append("user_img", this.imageFile);
        }

        const response = await updateUserProfile(formData);

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
