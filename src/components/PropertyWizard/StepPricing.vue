<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Pricing</h3>

    <div class="mb-3">
      <label class="block mb-1">Price</label>
      <input v-model="modelValue.price" type="number" class="w-full border rounded p-2" />
    </div>

    <div class="mb-3">
      <label class="block mb-1">Advance Payment</label>
      <input v-model="modelValue.advance_payment" type="number" class="w-full border rounded p-2" />
    </div>

    <div>
      <label class="block mb-1">Deposit</label>
      <input v-model="modelValue.deposit" type="number" class="w-full border rounded p-2" />
    </div>
  </div>
</template>

<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>
