<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Upload Media</h3>

    <div class="mb-3">
      <label class="block mb-1">Thumbnail</label>
      <input type="file" @change="handleThumbnail" />
    </div>

    <div>
      <label class="block mb-1">Gallery Images</label>
      <input type="file" multiple @change="handleImages" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const handleThumbnail = (e) => {
  emit("update:modelValue", { ...props.modelValue, thumbnail: e.target.files[0] });
};

const handleImages = (e) => {
  emit("update:modelValue", { ...props.modelValue, images: Array.from(e.target.files) });
};
</script>
