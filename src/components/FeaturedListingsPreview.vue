<template>
  <section class="featured-wrap">
    <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4 title-row">
      <div>
        <p class="eyebrow mb-2">Showcase Collection</p>
        <h2 class="fw-bold h1 mb-2">A Glimpse Of Spaces You Can Rent</h2>
        <p class="text-muted mb-0">Sample concepts only. This section shows the style of listings you can browse inside RentaHub.</p>
      </div>
      <RouterLink to="/home" class="btn btn-primary rounded-pill px-4 fw-bold">
        Browse All Listings
      </RouterLink>
    </div>

    <div class="row g-4">
      <div v-for="item in limitedItems" :key="item.id" class="col-xl-4 col-md-6">
        <article class="card featured-card border-0 shadow-sm h-100">
          <div class="image-wrap">
            <img
              :src="item.imageUrl"
              class="card-img-top featured-image"
              :alt="item.title"
              @error="$emit('image-error', $event)"
            >
            <span class="sample-badge">Sample Listing</span>
            <span class="agreement-pill">{{ formatAgreement(item.agreementType) }}</span>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="fw-bold mb-2">{{ item.title }}</h5>
            <p class="text-muted small card-copy flex-grow-1 mb-3">{{ item.description }}</p>
            <div class="chip-row mb-3" v-if="item.tags && item.tags.length">
              <span v-for="tag in item.tags.slice(0, 3)" :key="`${item.id}-${tag}`" class="meta-chip">{{ tag }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <div class="small text-muted">Showcase preview</div>
              <span class="showcase-label">No direct booking</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "FeaturedListingsPreview",
  components: { RouterLink },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ["image-error"],
  computed: {
    limitedItems() {
      return this.items.slice(0, 6);
    },
  },
  methods: {
    formatAgreement(value) {
      const text = String(value || "").trim();
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "Rental";
    },
  },
};
</script>

<style scoped>
.featured-wrap {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #e7eef9;
  border-radius: 28px;
  padding: 2.2rem;
}

.title-row {
  margin-bottom: 1.65rem !important;
}

.eyebrow {
  color: #335ea8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
}

.featured-card {
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  border: 1px solid #e6edf9;
}

.featured-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 38px rgba(20, 52, 99, 0.13) !important;
}

.image-wrap {
  position: relative;
  overflow: hidden;
}

.featured-image {
  height: 220px;
  object-fit: cover;
  width: 100%;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s ease;
  filter: saturate(1.05);
}

.featured-card:hover .featured-image {
  transform: scale(1.045);
  filter: saturate(1.14);
}

.image-wrap::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 48%;
  background: linear-gradient(to top, rgba(10, 22, 45, 0.42), transparent);
  pointer-events: none;
}

.sample-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(13, 22, 44, 0.86);
  color: #fff;
  border-radius: 999px;
  padding: 0.28rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.agreement-pill {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  background: rgba(255, 209, 102, 0.95);
  color: #11264a;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
}

.card-copy {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.meta-chip {
  font-size: 0.7rem;
  color: #2f4f89;
  background: #eef4ff;
  border: 1px solid #dbe7ff;
  border-radius: 999px;
  padding: 0.22rem 0.58rem;
  font-weight: 600;
}

.showcase-label {
  font-size: 0.72rem;
  color: #657286;
  background: #f2f5f9;
  border: 1px solid #e4e9f0;
  border-radius: 999px;
  padding: 0.3rem 0.62rem;
  font-weight: 600;
}

@media (max-width: 767px) {
  .featured-wrap {
    padding: 1.3rem;
    border-radius: 20px;
  }

  .featured-image {
    height: 195px;
  }
}
</style>
