<template>
  <Header />
  <div class="edit-pref-page container py-4">
    <RouterLink to="/profile" class="btn btn-outline-secondary rounded-pill fw-semibold mb-3">
      <i class="bi bi-arrow-left me-1"></i> Back to Profile
    </RouterLink>

    <section class="pref-hero rounded-4 shadow-sm p-4 p-md-5 mb-4">
      <p class="small text-uppercase mb-1 hero-kicker">Preference Setup</p>
      <h4 class="fw-bold mb-2"><i class="bi bi-sliders me-2"></i>Edit Preferences</h4>
      <p class="text-muted mb-0">Choose what matters most so recommendations match your lifestyle and budget priorities.</p>
    </section>

    <div class="card shadow-sm border-0 rounded-4">
      <div class="card-body p-4 p-md-5">
        <div class="mb-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h6 class="fw-semibold mb-0">Preferred Amenities</h6>
            <span class="selection-chip">{{ form.amenities.length }} selected</span>
          </div>

          <div class="row g-2">
            <div v-for="amenity in amenityOptions" :key="amenity.id" class="col-md-6">
              <label class="option-card form-check m-0">
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  :id="'amenity-' + amenity.id"
                  :value="amenity.id"
                  v-model="form.amenities"
                />
                <span class="form-check-label" :for="'amenity-' + amenity.id">
                  {{ amenity.amenity_name }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <hr />

        <div class="mb-4 mt-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h6 class="fw-semibold mb-0">Preferred Property Types</h6>
            <span class="selection-chip">{{ form.property_types.length }} selected</span>
          </div>

          <div class="row g-2">
            <div v-for="type in propertyTypeOptions" :key="type.id" class="col-md-6">
              <label class="option-card form-check m-0">
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  :id="'type-' + type.id"
                  :value="type.id"
                  v-model="form.property_types"
                />
                <span class="form-check-label" :for="'type-' + type.id">
                  {{ type.type_name }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <RouterLink to="/profile" class="btn btn-outline-secondary rounded-pill px-4">Cancel</RouterLink>
          <button class="btn btn-primary rounded-pill px-4 fw-semibold" @click="savePreferences" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAmenities, getPropertyTypes } from "@/api/property";
import {
  getUserPreferencesForEdit,
  updateUserPreferences
} from "@/api/user";
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";
import Header from "@/components/Header.vue";

export default {
  name: "editPreference",
  components: { RouterLink, Header },

  data() {
    return {
      loading: false,

      amenityOptions: [],
      propertyTypeOptions: [],

      // CREATE or UPDATE form
      form: {
        amenities: [],
        property_types: [],
      },
    };
  },

  mounted() {
    this.fetchPreferences();
  },

  methods: {
    async fetchPreferences() {
      try {
        const [types, amenities, prefs] = await Promise.all([
          getPropertyTypes(),
          getAmenities(),
          getUserPreferencesForEdit()
        ]);

        this.propertyTypeOptions = types;
        this.amenityOptions = amenities;

        this.form.amenities = prefs.data.amenities.map(
          a => a.amenity_id
        );
        this.form.property_types = prefs.data.properties.map(
          p => p.property_type_id
        );

      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    },

    async savePreferences() {
      this.loading = true;

      try {
        await updateUserPreferences(
          this.form.amenities,
          this.form.property_types
        );

        await Swal.fire({
          icon: "success",
          title: "Preferences Saved",
          text: "Preferences saved successfully!",
        });
        this.$router.push("/profile");

      } catch (error) {
        console.error(error);
        await Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: "Failed to save preferences.",
        });

      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.edit-pref-page {
  background: radial-gradient(circle at top right, rgba(71, 128, 217, 0.08) 0%, rgba(255, 255, 255, 0) 55%);
}

.pref-hero {
  border: 1px solid #e7eefb;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f7ff 100%);
}

.hero-kicker {
  color: #4871b3;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.selection-chip {
  font-size: 0.74rem;
  font-weight: 700;
  color: #2e5696;
  background: #e8f0ff;
  border: 1px solid #d3e2ff;
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
}

.option-card {
  border: 1px solid #e3eaf8;
  border-radius: 12px;
  background: #fafcff;
  padding: 0.6rem 0.8rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.option-card:hover {
  border-color: #c7d9fb;
  box-shadow: 0 8px 18px rgba(73, 124, 206, 0.08);
}

.option-card .form-check-input:checked {
  background-color: #4b81dc;
  border-color: #4b81dc;
}
</style>
