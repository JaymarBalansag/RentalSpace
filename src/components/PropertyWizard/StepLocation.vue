<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Location</h3>

    <div class="mb-3">
      <label class="block mb-1">Region</label>
      <input v-model="modelValue.region_id" type="text" class="w-full border rounded p-2" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Province</label>
      <input v-model="modelValue.province_id" type="text" class="w-full border rounded p-2" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Municipality</label>
      <input v-model="modelValue.muncity_id" type="text" class="w-full border rounded p-2" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Barangay</label>
      <input v-model="modelValue.barangay_id" type="text" class="w-full border rounded p-2" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Latitude</label>
      <input v-model="modelValue.latitude" type="text" class="w-full border rounded p-2" />
    </div>

    <div>
      <label class="block mb-1">Longitude</label>
      <input v-model="modelValue.longitude" type="text" class="w-full border rounded p-2" />
    </div>
  </div>
</template>

<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>
