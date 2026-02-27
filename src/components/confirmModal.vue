<template>
  <div v-if="show" class="modal-backdrop-custom">
    <div class="modal-custom">
      <h5 class="fw-bold mb-2">
        {{ title }}
      </h5>

      <p class="text-muted">
        {{ message }}
      </p>

      <div v-if="showInput" class="mt-3">
        <label class="form-label small fw-semibold mb-1">{{ inputLabel }}</label>
        <textarea
          class="form-control"
          rows="3"
          :placeholder="inputPlaceholder"
          :value="inputValue"
          :disabled="loading"
          @input="$emit('update:inputValue', $event.target.value)"
        />
      </div>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button
          class="btn btn-outline-secondary"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          Cancel
        </button>

        <button
          :class="confirmButtonClass"
          :disabled="loading || (showInput && inputRequired && !normalizedInputValue)"
          @click="$emit('confirm')"
        >
          {{ loading ? "Processing..." : confirmText }}
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
    },
    variant: {
      type: String,
      default: "success"
    },
    loading: {
      type: Boolean,
      default: false
    },
    showInput: {
      type: Boolean,
      default: false
    },
    inputLabel: {
      type: String,
      default: "Reason"
    },
    inputPlaceholder: {
      type: String,
      default: "Type here..."
    },
    inputRequired: {
      type: Boolean,
      default: false
    },
    inputValue: {
      type: String,
      default: ""
    }
  },
  computed: {
    confirmButtonClass() {
      if (this.variant === "danger") return "btn btn-danger";
      if (this.variant === "warning") return "btn btn-warning text-dark";
      return "btn btn-success";
    },
    normalizedInputValue() {
      return String(this.inputValue || "").trim();
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
