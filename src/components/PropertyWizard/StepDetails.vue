<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Property Details</h3>

    <div class="mb-3">
      <label class="block mb-1">Bedrooms</label>
      <input v-model="modelValue.bedrooms" type="number" class="w-full border rounded p-2" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Bathrooms</label>
      <input v-model="modelValue.bathrooms" type="number" class="w-full border rounded p-2" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Furnishing</label>
      <select v-model="modelValue.furnishing" class="w-full border rounded p-2">
        <option value="">Select...</option>
        <option value="furnished">Furnished</option>
        <option value="semi">Semi-Furnished</option>
        <option value="unfurnished">Unfurnished</option>
      </select>
    </div>

    <div>
      <label class="block mb-1">Parking</label>
      <input v-model="modelValue.parking" type="text" class="w-full border rounded p-2" />
    </div>
  </div>
</template>

<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>
