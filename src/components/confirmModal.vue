<template>
  <div v-if="show" class="modal-backdrop-custom">
    <div class="modal-custom">
      <h5 class="fw-bold mb-2">
        {{ title }}
      </h5>

      <p class="text-muted">
        {{ message }}
      </p>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button
          class="btn btn-outline-secondary"
          @click="$emit('cancel')"
        >
          Cancel
        </button>

        <button
          class="btn btn-success"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmModal",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: "Confirm Action"
    },
    message: {
      type: String,
      default: "Are you sure you want to proceed?"
    },
    confirmText: {
      type: String,
      default: "Yes"
    }
  }
};
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-custom {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>
