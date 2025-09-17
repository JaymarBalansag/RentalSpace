<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Review Your Property</h3>
    <pre class="bg-gray-100 p-4 rounded">{{ modelValue }}</pre>
    <p class="mt-2 text-sm text-gray-600">Confirm everything looks good before submitting.</p>
  </div>
</template>

<script setup>
defineProps(["modelValue"]);
</script>
