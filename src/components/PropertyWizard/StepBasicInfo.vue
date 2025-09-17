<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4">Add Property</h2>

    <!-- Step Content -->
    <component :is="steps[currentStep].component"
               v-model="formData" />

    <!-- Navigation -->
    <div class="flex justify-between mt-6">
      <button v-if="currentStep > 0"
              class="px-4 py-2 bg-gray-200 rounded"
              @click="prevStep">
        Previous
      </button>

      <button v-if="currentStep < steps.length - 1"
              class="px-4 py-2 bg-blue-600 text-white rounded"
              @click="nextStep">
        Next
      </button>

      <button v-else class="px-4 py-2 bg-green-600 text-white rounded">
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Steps import
import StepBasicInfo from "./StepBasicInfo.vue";
import StepPricing from "./StepPricing.vue";
import StepDetails from "./StepDetails.vue";
import StepRules from "./StepRules.vue";
import StepLocation from "./StepLocation.vue";
import StepAmenities from "./StepAmenities.vue";
import StepMedia from "./StepMedia.vue";
import StepReview from "./StepReview.vue";

const currentStep = ref(0);

// All steps
const steps = [
  { name: "Basic Info", component: StepBasicInfo },
  { name: "Pricing", component: StepPricing },
  { name: "Details", component: StepDetails },
  { name: "Rules", component: StepRules },
  { name: "Location", component: StepLocation },
  { name: "Amenities", component: StepAmenities },
  { name: "Media", component: StepMedia },
  { name: "Review", component: StepReview },
];

// Main form state (shared across steps)
const formData = ref({
  title: "",
  description: "",
  property_type_id: null,
  agreement_type: "",
  price: "",
  advance_payment: "",
  deposit: "",
  lease_term: "",
  bedrooms: "",
  bathrooms: "",
  furnishing: "",
  parking: "",
  rules: "",
  has_curfew: false,
  curfew_time: "",
  region_id: null,
  province_id: null,
  muncity_id: null,
  barangay_id: null,
  latitude: null,
  longitude: null,
  amenities: [],
  facilities: [],
  images: [],
  thumbnail: null,
});

// Navigation
const nextStep = () => {
  if (currentStep.value < steps.length - 1) currentStep.value++;
};
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};

// Submit handler
const submitForm = async () => {
  console.log("Submitting property:", formData.value);

  try {
    const res = await fetch("http://localhost:8000/api/properties", {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
      body: createFormData(formData.value),
    });
    const data = await res.json();
    console.log("Success:", data);
  } catch (err) {
    console.error("Error submitting property:", err);
  }
};

// Convert object to FormData for file upload
const createFormData = (data) => {
  const fd = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((val, i) => fd.append(`${key}[${i}]`, val));
    } else {
      fd.append(key, data[key]);
    }
  }
  return fd;
};
</script>
