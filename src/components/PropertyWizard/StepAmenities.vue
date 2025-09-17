<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Amenities</h3>

    <div class="grid grid-cols-2 gap-3">
      <label><input type="checkbox" value="wifi" v-model="modelValue.amenities" /> WiFi</label>
      <label><input type="checkbox" value="parking" v-model="modelValue.amenities" /> Parking</label>
      <label><input type="checkbox" value="laundry" v-model="modelValue.amenities" /> Laundry</label>
      <label><input type="checkbox" value="aircon" v-model="modelValue.amenities" /> Air Conditioning</label>
    </div>
  </div>
</template>

<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>
