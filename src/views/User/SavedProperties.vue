<template>
  <Header />

  <div class="saved-page container py-4">
    <section class="saved-hero rounded-4 shadow-sm p-4 p-md-5 mb-4">
      <p class="hero-eyebrow mb-2">Saved For Later</p>
      <h2 class="fw-bold mb-2">Bookmarked Properties</h2>
      <p class="text-muted mb-0">
        Revisit the listings you saved, compare them again, and jump back into messaging or booking.
      </p>
    </section>

    <section class="saved-panel rounded-4 shadow-sm">
      <div class="panel-head d-flex justify-content-between align-items-center flex-wrap gap-3 p-3 p-md-4 border-bottom">
        <div>
          <p class="hero-eyebrow mb-1">My List</p>
          <h5 class="fw-bold mb-0">{{ bookmarks.length }} saved propert{{ bookmarks.length === 1 ? "y" : "ies" }}</h5>
        </div>
        <button class="btn btn-outline-primary rounded-pill px-4" :disabled="loading" @click="loadBookmarks">
          <i class="bi bi-arrow-repeat me-2"></i>{{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>

      <div v-if="loading" class="p-4 text-center text-muted">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="mb-0">Loading your bookmarks...</p>
      </div>

      <div v-else-if="error" class="p-4">
        <div class="alert alert-danger mb-0">{{ error }}</div>
      </div>

      <div v-else-if="bookmarks.length === 0" class="empty-state text-center p-4 p-md-5">
        <i class="bi bi-heart display-5 text-muted"></i>
        <h5 class="fw-bold mt-3">No saved properties yet</h5>
        <p class="text-muted mb-4">Browse listings and tap the heart icon to keep a property here.</p>
        <RouterLink class="btn btn-primary rounded-pill px-4" to="/Home">Explore Properties</RouterLink>
      </div>

      <div v-else class="row g-4 p-3 p-md-4">
        <div v-for="property in bookmarks" :key="property.id" class="col-12">
          <article class="saved-card card border-0 rounded-4 overflow-hidden h-100">
            <div class="row g-0 h-100">
              <div class="col-md-4">
                <div class="saved-image-wrap">
                  <img
                    :src="property.image_url || placeholderImg"
                    class="saved-image"
                    alt="Property"
                    @error="$event.target.src = placeholderImg"
                  />
                </div>
              </div>
              <div class="col-md-8">
                <div class="card-body p-4 d-flex flex-column h-100">
                  <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                    <div>
                      <h4 class="fw-bold mb-1">{{ property.title }}</h4>
                      <p class="text-muted small mb-2">
                        <i class="bi bi-geo-alt text-danger me-1"></i>{{ property.town_name || "-" }}, {{ property.state_name || "-" }}
                      </p>
                    </div>
                    <span class="badge rounded-pill" :class="property.is_available ? 'text-bg-success' : 'text-bg-secondary'">
                      {{ property.is_available ? "Available" : "Unavailable" }}
                    </span>
                  </div>

                  <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="info-chip">{{ toTitle(property.agreement_type) }}</span>
                    <span class="info-chip">PHP {{ property.price }} / {{ toTitle(property.payment_frequency) }}</span>
                    <span class="info-chip">{{ property.owner_name || "Owner not listed" }}</span>
                  </div>

                  <p class="text-muted mb-4 saved-description">
                    {{ property.description || "No description available for this property." }}
                  </p>

                  <div class="mt-auto d-flex flex-wrap gap-2">
                    <button class="btn btn-primary rounded-pill px-4" @click="goToProperty(property.id)">
                      View Details
                    </button>
                    <button
                      class="btn btn-outline-danger rounded-pill px-4"
                      :disabled="busyId === property.id"
                      @click="removeBookmark(property.id)"
                    >
                      <span v-if="busyId === property.id" class="spinner-border spinner-border-sm me-2"></span>
                      Remove Bookmark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";
import Header from "@/components/Header.vue";
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import { getBookmarkedProperties, removeBookmarkedProperty } from "@/api/bookmarks";

export default {
  name: "SavedProperties",
  components: { Header, RouterLink },
  data() {
    return {
      loading: false,
      error: "",
      busyId: null,
      bookmarks: [],
      placeholderImg,
    };
  },
  methods: {
    toTitle(text) {
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
    },
    async loadBookmarks() {
      this.loading = true;
      this.error = "";
      try {
        const response = await getBookmarkedProperties();
        this.bookmarks = Array.isArray(response?.data?.data) ? response.data.data : [];
      } catch (error) {
        this.error = error?.response?.data?.message || "Unable to load your bookmarks right now.";
        this.bookmarks = [];
      } finally {
        this.loading = false;
      }
    },
    goToProperty(id) {
      this.$router.push(`/property/${id}`);
    },
    async removeBookmark(propertyId) {
      if (this.busyId === propertyId) return;

      this.busyId = propertyId;
      try {
        const response = await removeBookmarkedProperty(propertyId);
        this.bookmarks = this.bookmarks.filter((item) => Number(item.id) !== Number(propertyId));
        await Swal.fire({
          icon: "success",
          title: "Bookmark removed",
          text: response?.data?.message || "Property removed from your bookmarks.",
          timer: 1600,
          showConfirmButton: false,
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Remove failed",
          text: error?.response?.data?.message || "Unable to remove this bookmark right now.",
        });
      } finally {
        this.busyId = null;
      }
    },
  },
  mounted() {
    this.loadBookmarks();
  },
};
</script>

<style scoped>
.saved-page {
  max-width: 1080px;
}

.saved-hero,
.saved-panel {
  background: #fff;
  border: 1px solid #e6edf7;
}

.saved-hero {
  background: linear-gradient(135deg, #f8fbff 0%, #ffffff 60%, #eef4ff 100%);
}

.hero-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #4a6da5;
}

.saved-card {
  border: 1px solid #e6edf7 !important;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.saved-image-wrap {
  height: 100%;
  min-height: 250px;
  overflow: hidden;
}

.saved-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.saved-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: #eef4ff;
  color: #1f4ba5;
  font-size: 0.82rem;
  font-weight: 600;
}

.empty-state {
  min-height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 767px) {
  .saved-image-wrap {
    min-height: 220px;
  }
}
</style>
