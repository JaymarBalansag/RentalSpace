<template>
  <div class="container py-4">
    <!-- Back -->
    <RouterLink
      to="/profile"
      class="btn btn-outline-secondary fw-semibold mb-3"
    >
      <i class="bi bi-arrow-left me-1"></i> Back to Profile
    </RouterLink>

    <!-- Card -->
    <div class="card shadow border-0 rounded-4">
      <div class="card-body p-4">

        <h4 class="fw-bold mb-4">
          <i class="bi bi-sliders me-2"></i> Edit Preferences
        </h4>

        <!-- Amenities -->
        <div class="mb-4">
          <h6 class="fw-semibold mb-2">Preferred Amenities</h6>

          <div class="row">
            <div
              v-for="amenity in amenityOptions"
              :key="amenity.id"
              class="col-md-6 mb-2"
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'amenity-' + amenity.id"
                  :value="amenity.id"
                  v-model="form.amenities"
                />
                <label
                  class="form-check-label"
                  :for="'amenity-' + amenity.id"
                >
                  {{ amenity.amenity_name }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <!-- Property Types -->
        <div class="mb-4">
          <h6 class="fw-semibold mb-2">Preferred Property Types</h6>

          <div class="row">
            <div
              v-for="type in propertyTypeOptions"
              :key="type.id"
              class="col-md-6 mb-2"
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'type-' + type.id"
                  :value="type.id"
                  v-model="form.property_types"
                />
                <label
                  class="form-check-label"
                  :for="'type-' + type.id"
                >
                  {{ type.type_name }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="d-flex justify-content-end gap-2">
          <RouterLink to="/profile" class="btn btn-outline-secondary">
            Cancel
          </RouterLink>

          <button
            class="btn btn-primary"
            @click="savePreferences"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
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

export default {
  name: "editPreference",
  components: { RouterLink },

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

        alert("Preferences saved successfully!");
        this.$router.push("/profile");

      } catch (error) {
        console.error(error);
        alert("Failed to save preferences.");

      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
