<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Rules</h3>

    <div class="mb-3">
      <label class="block mb-1">Rules</label>
      <textarea v-model="modelValue.rules" class="w-full border rounded p-2"></textarea>
    </div>

    <div>
      <label class="block mb-1">Curfew</label>
      <input type="checkbox" v-model="modelValue.has_curfew" /> Has Curfew?
      <input v-if="modelValue.has_curfew" type="time" v-model="modelValue.curfew_time" class="border rounded p-2 ml-3" />
    </div>
  </div>
</template>

<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>
