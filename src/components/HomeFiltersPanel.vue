<template>
  <div :class="panelClass">
    <div class="filter-card p-3 border rounded-4 shadow-sm bg-white mb-4">
      <h6 class="fw-bold mb-3 d-flex align-items-center">
        <i class="bi bi-tags me-2 text-primary"></i> Price Range
      </h6>
      <div class="row g-2 mb-3">
        <div class="col-6">
          <input
            v-model.number="minPriceModel"
            type="number"
            class="form-control form-control-sm rounded-3"
            placeholder="Min"
          >
        </div>
        <div class="col-6">
          <input
            v-model.number="maxPriceModel"
            type="number"
            class="form-control form-control-sm rounded-3"
            placeholder="Max"
          >
        </div>
      </div>
    </div>

    <div class="filter-card p-3 border rounded-4 shadow-sm bg-white mb-4">
      <h6 class="fw-bold mb-3">Amenities</h6>
      <div v-if="loadingAmenities" class="placeholder-glow">
        <div v-for="n in 5" :key="`amenity-skeleton-${n}`" class="placeholder col-10 mb-2 rounded"></div>
      </div>
      <div v-else class="filter-list scroll-custom">
        <div v-for="(amenity, index) in amenities" :key="amenity.id || index" class="form-check mb-2">
          <input
            :id="`amenity-${idPrefix}-${index}`"
            v-model="selectedAmenitiesModel"
            class="form-check-input"
            type="checkbox"
            :value="amenity.id"
          >
          <label class="form-check-label small" :for="`amenity-${idPrefix}-${index}`">
            {{ amenity.amenity_name }}
          </label>
        </div>
      </div>
    </div>

    <div class="filter-card p-3 border rounded-4 shadow-sm bg-white">
      <h6 class="fw-bold mb-3">Facilities</h6>
      <div v-if="loadingFacilities" class="placeholder-glow">
        <div v-for="n in 5" :key="`facility-skeleton-${n}`" class="placeholder col-10 mb-2 rounded"></div>
      </div>
      <div v-else class="filter-list scroll-custom">
        <div v-for="(facility, index) in facilities" :key="facility.id || index" class="form-check mb-2">
          <input
            :id="`facility-${idPrefix}-${index}`"
            v-model="selectedFacilitiesModel"
            class="form-check-input"
            type="checkbox"
            :value="facility.id"
          >
          <label class="form-check-label small" :for="`facility-${idPrefix}-${index}`">
            {{ facility.facility_name }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="showActions" class="filter-actions d-flex gap-2 mt-3">
      <button type="button" class="btn btn-primary btn-sm flex-fill rounded-3 fw-bold" @click="$emit('apply')">
        Apply Filters
      </button>
      <button type="button" class="btn btn-link btn-sm flex-fill text-muted text-decoration-none" @click="$emit('reset')">
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  amenities: {
    type: Array,
    default: () => [],
  },
  facilities: {
    type: Array,
    default: () => [],
  },
  loadingAmenities: {
    type: Boolean,
    default: false,
  },
  loadingFacilities: {
    type: Boolean,
    default: false,
  },
  selectedAmenities: {
    type: Array,
    default: () => [],
  },
  selectedFacilities: {
    type: Array,
    default: () => [],
  },
  minPrice: {
    default: null,
  },
  maxPrice: {
    default: null,
  },
  idPrefix: {
    type: String,
    default: "home",
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  panelClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:selectedAmenities",
  "update:selectedFacilities",
  "update:minPrice",
  "update:maxPrice",
  "apply",
  "reset",
]);

const selectedAmenitiesModel = computed({
  get: () => props.selectedAmenities,
  set: (value) => emit("update:selectedAmenities", value),
});

const selectedFacilitiesModel = computed({
  get: () => props.selectedFacilities,
  set: (value) => emit("update:selectedFacilities", value),
});

const minPriceModel = computed({
  get: () => props.minPrice,
  set: (value) => emit("update:minPrice", value),
});

const maxPriceModel = computed({
  get: () => props.maxPrice,
  set: (value) => emit("update:maxPrice", value),
});
</script>

<style scoped>
.filter-card {
  border: 1px solid #e1ebfb !important;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 18px rgba(21, 48, 88, 0.05);
}

.filter-list {
  max-height: 200px;
  overflow-y: auto;
}

.scroll-custom::-webkit-scrollbar {
  width: 5px;
}

.scroll-custom::-webkit-scrollbar-thumb {
  background: #d6deea;
  border-radius: 10px;
}

.mobile-filter-panel .filter-card {
  margin-bottom: 1rem !important;
}

.filter-actions {
  position: sticky;
  bottom: 0;
  padding-top: 0.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f9fbff 28%, #f9fbff 100%);
}
</style>
