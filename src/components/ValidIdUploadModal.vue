<template>
  <div v-if="show" class="modal-backdrop-custom">
    <div class="modal-custom">
      <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
        <div>
          <h5 class="fw-bold mb-1">Submit Valid Government ID</h5>
          <p class="text-muted mb-0 small">
            Choose a clear photo of your government-issued ID. Images are auto-compressed to WebP before upload.
          </p>
        </div>
        <button class="btn btn-sm btn-light border" :disabled="loading" @click="$emit('cancel')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="mt-3">
        <label class="form-label small fw-semibold mb-1">File</label>
        <input
          ref="fileInput"
          type="file"
          class="form-control"
          :disabled="loading"
          accept=".jpg,.jpeg,.png,.webp"
          @change="onFileChange"
        />
        <small v-if="fileError" class="text-danger d-block mt-2">{{ fileError }}</small>
      </div>

      <div v-if="previewUrl" class="mt-3">
        <p class="small fw-semibold mb-2">Preview</p>

        <div class="img-frame border rounded-3 overflow-hidden d-flex justify-content-center align-items-center bg-light">
          <img :src="previewUrl" alt="Valid ID Preview" />
        </div>

        <div class="d-flex flex-wrap gap-2 mt-2 small text-muted">
          <span v-if="originalFileName"><strong>Original:</strong> {{ originalFileName }}</span>
          <span v-if="uploadFileName && uploadFileName !== originalFileName"><strong>Upload:</strong> {{ uploadFileName }}</span>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button class="btn btn-outline-secondary" :disabled="loading" @click="$emit('cancel')">Cancel</button>
        <button class="btn btn-warning text-dark" :disabled="loading || !uploadFile" @click="emitSubmit">
          {{ loading ? "Uploading..." : "Upload ID" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { compressImageToWebpFile } from "@/utils/compressToWebp";

export default {
  name: "ValidIdUploadModal",
  props: {
    show: { type: Boolean, required: true },
    loading: { type: Boolean, default: false },
  },
  emits: ["cancel", "submit"],
  data() {
    return {
      originalFile: null,
      uploadFile: null,
      previewUrl: null,
      fileError: null,
    };
  },
  computed: {
    originalFileName() {
      return this.originalFile?.name || "";
    },
    uploadFileName() {
      return this.uploadFile?.name || "";
    },
  },
  watch: {
    show(val) {
      if (!val) this.reset();
    },
  },
  beforeUnmount() {
    this.reset();
  },
  methods: {
    reset() {
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
      this.originalFile = null;
      this.uploadFile = null;
      this.fileError = null;
      if (this.$refs.fileInput) this.$refs.fileInput.value = "";
    },
    async onFileChange(e) {
      this.fileError = null;

      const file = e?.target?.files?.[0] || null;
      if (!file) return;

      this.originalFile = file;

      if (!String(file.type || "").startsWith("image/")) {
        this.fileError = "Please choose an image file (JPG, PNG, or WEBP).";
        this.uploadFile = null;
        return;
      }

      try {
        const { file: webpFile } = await compressImageToWebpFile(file, {
          quality: 0.84,
          maxWidth: 1600,
          maxHeight: 1600,
          filenameSuffix: "valid-id",
        });
        this.uploadFile = webpFile || file;
      } catch {
        this.uploadFile = file;
      }

      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = URL.createObjectURL(this.uploadFile);
    },
    emitSubmit() {
      if (!this.uploadFile) return;
      this.$emit("submit", { file: this.uploadFile, originalFile: this.originalFile });
    },
  },
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
  padding: 16px;
}

.modal-custom {
  background: #fff;
  padding: 1.25rem;
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.img-frame {
  height: 320px;
}

.img-frame img {
  max-width: 100%;
  max-height: 320px;
  object-fit: contain;
}

</style>
