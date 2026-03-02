<template>
  <Header />
  <div ref="landingRoot" class="landing-page">
    <section class="hero-section d-flex align-items-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-8 col-lg-10 hero-text-container text-center">
            <div class="hero-stack" :class="{ 'hero-visible': heroVisible }">
              <span class="hero-badge">Rental Discovery, Reimagined</span>
              <h1 class="display-3 fw-bold mb-3 text-white hero-title">
                Find Spaces That Match
                <span class="text-accent">Your Lifestyle</span>
              </h1>
              <p class="lead text-white-50 mb-4 fs-5 hero-subtitle mx-auto">
                Explore modern rental showcases, map-first context, and category browsing designed
                to make your first visit feel clear and inspiring.
              </p>
              <div class="d-flex justify-content-center flex-wrap gap-3 mb-3">
                <RouterLink to="/home" class="btn btn-light btn-lg rounded-pill px-4 py-3 fw-bold text-primary">
                  Browse Listings
                </RouterLink>
                <RouterLink to="/login" class="btn btn-outline-light btn-lg rounded-pill px-4 py-3 fw-bold">
                  Join Now
                </RouterLink>
              </div>
              <div class="proof-strip justify-content-center">
                <span><i class="bi bi-patch-check-fill"></i> Verified owners</span>
                <span><i class="bi bi-map-fill"></i> Map-first browsing</span>
                <span><i class="bi bi-ui-checks-grid"></i> Smart categories</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section reveal-section" data-section="value" :class="{ 'is-visible': visibleSections.value }">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="stat-card h-100">
              <div class="value-icon"><i class="bi bi-patch-check-fill"></i></div>
              <h3 class="h5 fw-bold mb-2">Verified Owner Layer</h3>
              <p class="text-muted mb-0">Listings pass owner verification workflows before they appear for discovery.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card h-100">
              <div class="value-icon"><i class="bi bi-compass-fill"></i></div>
              <h3 class="h5 fw-bold mb-2">Guided Discovery</h3>
              <p class="text-muted mb-0">Showcases, maps, and categories work together so first-time visitors know where to start.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card h-100">
              <div class="value-icon"><i class="bi bi-chat-dots-fill"></i></div>
              <h3 class="h5 fw-bold mb-2">Built for Real Conversations</h3>
              <p class="text-muted mb-0">The platform is designed to connect tenants and owners with clearer communication.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-4">
      <div class="container reveal-section" data-section="featured" :class="{ 'is-visible': visibleSections.featured }">
        <FeaturedListingsPreview :items="featuredProperties" @image-error="onImageError" />
      </div>
    </section>

    <section class="py-4">
      <div class="container reveal-section" data-section="map" :class="{ 'is-visible': visibleSections.map }">
        <LandingMapTeaser :pins="mapPins" />
      </div>
    </section>

    <section class="py-5 reveal-section" data-section="categories" :class="{ 'is-visible': visibleSections.categories }">
      <div class="container py-4">
        <div class="text-center mb-5">
          <p class="eyebrow text-primary mb-2">Browse By Purpose</p>
          <h2 class="fw-bold h1">Explore Rental Styles</h2>
          <p class="text-muted">Choose a category to jump into the kind of space you need.</p>
        </div>
        <div class="row g-4">
          <div v-for="cat in categories" :key="cat.name" class="col-md-3 col-sm-6">
            <RouterLink class="text-decoration-none" to="/home">
              <div class="card category-card border-0 shadow-sm text-center p-4 h-100">
                <div class="icon-box mb-3 mx-auto">
                  <i :class="cat.icon"></i>
                </div>
                <h5 class="fw-bold text-dark">{{ cat.name }}</h5>
                <p class="small text-muted mb-0">{{ displayCount(cat.count) }} Listings</p>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 owner-section text-white mb-0 overflow-hidden position-relative reveal-section" data-section="owner" :class="{ 'is-visible': visibleSections.owner }">
      <div class="container py-5 position-relative z-index-2">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="display-5 fw-bold mb-3">Are you a property owner?</h2>
            <p class="lead opacity-75">
              List your space in minutes and reach thousands of potential tenants. Manage bookings
              and chats in one dashboard.
            </p>
          </div>
          <div class="col-md-4 text-md-end">
            <RouterLink to="/payment/wall" class="btn btn-accent btn-lg px-4 rounded-pill fw-bold">
              List Property
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="decoration-circle"></div>
    </section>

    <footer class="py-5 bg-white border-top">
      <div class="container text-center">
        <h4 class="fw-bold text-primary mb-3">RentaHub</h4>
        <p class="text-muted mb-4 small">&copy; 2026 RentaHub Rental Management System. All Rights Reserved.</p>
        <div class="d-flex justify-content-center gap-4">
          <a href="#" class="text-muted"><i class="bi bi-facebook"></i></a>
          <a href="#" class="text-muted"><i class="bi bi-twitter"></i></a>
          <a href="#" class="text-muted"><i class="bi bi-instagram"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { fetchCategoryCountsHelper } from "@/api/landingPage";
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import Header from "@/components/Header.vue";
import FeaturedListingsPreview from "@/components/FeaturedListingsPreview.vue";
import LandingMapTeaser from "@/components/LandingMapTeaser.vue";

export default {
  components: { Header, FeaturedListingsPreview, LandingMapTeaser },
  data() {
    return {
      loading: false,
      propertyCount: 0,
      tenantCount: 0,
      heroVisible: false,
      visibleSections: {
        value: false,
        featured: false,
        map: false,
        categories: false,
        owner: false,
      },
      revealObserver: null,
      categories: [
        { name: "Boarding House", icon: "bi bi-houses-fill", count: 120 },
        { name: "Apartments", icon: "bi bi-building", count: 85 },
        { name: "Condominiums", icon: "bi bi-building-check", count: 45 },
        { name: "House", icon: "bi bi-house", count: 30 },
      ],
      featuredProperties: [
        {
          id: "sample-1",
          title: "Modern Apartment near Downtown",
          town: "Tacloban City",
          state: "Leyte",
          price: "PHP 9,500 / month",
          agreementType: "rental",
          imageUrl: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80",
          rating: 4.8,
          description: "Bright and furnished apartment near schools, terminals, and local markets.",
          lat: 11.2444,
          lng: 125.0039,
          tags: ["Near transport", "City access", "Move-in ready"],
          isSample: true,
        },
        {
          id: "sample-2",
          title: "Cozy Boarding House for Students",
          town: "Palo",
          state: "Leyte",
          price: "PHP 4,200 / month",
          agreementType: "rental",
          imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
          rating: 4.5,
          description: "Shared amenities, secure entrance, and short commute to major campuses.",
          lat: 11.1575,
          lng: 124.9908,
          tags: ["Student-friendly", "Budget pick", "Secure entry"],
          isSample: true,
        },
        {
          id: "sample-3",
          title: "Family House with Parking",
          town: "Ormoc City",
          state: "Leyte",
          price: "PHP 14,000 / month",
          agreementType: "lease",
          imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          rating: 4.7,
          description: "Spacious home in a quiet neighborhood with easy access to transport.",
          lat: 11.005,
          lng: 124.6075,
          tags: ["Family-ready", "With parking", "Quiet area"],
          isSample: true,
        },
        {
          id: "sample-4",
          title: "Studio Unit with Balcony",
          town: "Tacloban City",
          state: "Leyte",
          price: "PHP 7,800 / month",
          agreementType: "rental",
          imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
          rating: 4.4,
          description: "Compact studio perfect for solo renters with a city-view balcony.",
          lat: 11.25,
          lng: 125.005,
          tags: ["Solo living", "Balcony view", "City center"],
          isSample: true,
        },
        {
          id: "sample-5",
          title: "Commercial Space along Main Road",
          town: "Palo",
          state: "Leyte",
          price: "PHP 18,000 / month",
          agreementType: "lease",
          imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
          rating: 4.6,
          description: "Street-facing unit suitable for cafes, clinics, or retail operations.",
          lat: 11.1595,
          lng: 124.9872,
          tags: ["Business-ready", "Main road", "High visibility"],
          isSample: true,
        },
        {
          id: "sample-6",
          title: "Condo Unit with Amenities",
          town: "Tacloban City",
          state: "Leyte",
          price: "PHP 12,300 / month",
          agreementType: "rental",
          imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
          rating: 4.9,
          description: "Secure condo with gym access, standby generator, and flexible lease terms.",
          lat: 11.2422,
          lng: 124.9982,
          tags: ["Amenity-rich", "Secure tower", "Flexible terms"],
          isSample: true,
        },
      ],
    };
  },
  computed: {
    mapPins() {
      return this.featuredProperties.map((item) => ({
        id: item.id,
        title: item.title,
        lat: item.lat,
        lng: item.lng,
        price: item.price,
      }));
    },
  },
  methods: {
    onImageError(event) {
      const target = event?.target;
      if (target) target.src = placeholderImg;
    },
    displayCount(value) {
      const count = Number(value || 0);
      return count <= 100 ? count : "100+";
    },
    setupRevealObservers() {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        this.heroVisible = true;
        this.visibleSections = { value: true, featured: true, map: true, categories: true, owner: true };
        return;
      }

      setTimeout(() => {
        this.heroVisible = true;
      }, 120);

      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const key = entry.target.getAttribute("data-section");
            if (key && key in this.visibleSections) {
              this.visibleSections[key] = true;
              this.revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18 }
      );

      const root = this.$refs.landingRoot;
      if (root && typeof root.querySelectorAll === "function") {
        const sections = root.querySelectorAll(".reveal-section[data-section]");
        sections.forEach((section) => this.revealObserver.observe(section));
      }
    },
    async fetchCategoryCounts() {
      this.loading = true;
      try {
        const response = await fetchCategoryCountsHelper();
        const payload = response?.data || {};
        const data = payload?.data || [];

        if (Array.isArray(data) && data.length >= 4) {
          this.categories[0].count = Number(data[0]?.total || 0);
          this.categories[1].count = Number(data[1]?.total || 0);
          this.categories[2].count = Number(data[2]?.total || 0);
          this.categories[3].count = Number(data[3]?.total || 0);
        }

        this.propertyCount = Number(payload?.propertyCount || 0);
        this.tenantCount = Number(payload?.tenantCount || 0);
      } catch (error) {
        console.error("Failed to fetch category counts:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchCategoryCounts();
    this.$nextTick(() => {
      this.setupRevealObservers();
    });
  },
  beforeUnmount() {
    if (this.revealObserver) this.revealObserver.disconnect();
  },
};
</script>

<style scoped>
.landing-page {
  background: radial-gradient(circle at 18% 10%, #e9f1ff 0%, #f7f9fd 35%, #f8fafd 100%);
}

.hero-section {
  min-height: 88vh;
  background:
    linear-gradient(145deg, rgba(19, 49, 95, 0.84), rgba(29, 80, 158, 0.78)),
    url("https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=2000&q=80");
  background-size: cover;
  background-position: center;
  padding: 6.5rem 0 4.5rem;
  position: relative;
  overflow: hidden;
}

.hero-stack {
  opacity: 0;
  transform: translateY(14px);
  transition: transform 0.88s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.88s ease;
}

.hero-stack.hero-visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-badge {
  display: inline-block;
  margin-bottom: 0.9rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #dbeafe;
  background: rgba(255, 255, 255, 0.12);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.hero-title {
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  max-width: 50ch;
  line-height: 1.62;
}

.proof-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.2rem;
  color: #dce7fb;
  font-size: 0.88rem;
  font-weight: 500;
}

.proof-strip i {
  color: #ffd166;
  margin-right: 0.25rem;
}

.text-accent {
  color: #ffd166;
}

.btn-accent {
  background-color: #ffd166;
  color: #2a5298;
}

.btn-accent:hover {
  background-color: #ffc107;
  color: #000;
}

.stats-section {
  margin-top: -2.4rem;
  position: relative;
  z-index: 5;
  padding-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(180deg, #fff 0%, #f7faff 100%);
  border: 1px solid #e4ebf8;
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 10px 24px rgba(16, 39, 77, 0.07);
}

.value-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 0.75rem;
  background: #eaf1ff;
  color: #2a5298;
  font-size: 1.1rem;
}

.category-card {
  border-radius: 18px;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease, background-color 0.45s ease, color 0.45s ease;
  cursor: pointer;
  border: 1px solid #e7eef9 !important;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
}

.category-card:hover {
  transform: translateY(-6px) scale(1.01);
  background: linear-gradient(160deg, #4780d9, #2f63b7);
  color: #fff;
  box-shadow: 0 20px 35px rgba(31, 57, 101, 0.2) !important;
}

.category-card:hover .text-dark {
  color: #fff !important;
}

.category-card:hover .text-muted {
  color: rgba(255, 255, 255, 0.78) !important;
}

.icon-box {
  width: 60px;
  height: 60px;
  background: rgba(71, 128, 217, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #4780d9;
}

.category-card:hover .icon-box {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.owner-section {
  background: linear-gradient(145deg, #16263f, #1f3558);
}

.decoration-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 209, 102, 0.1);
  border-radius: 50%;
  bottom: -150px;
  right: -50px;
}

.reveal-section {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.86s ease, transform 0.86s cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 991px) {
  .hero-section {
    min-height: auto;
    padding: 5.5rem 0 3.5rem;
  }

  .hero-text-container {
    text-align: center;
  }

  .hero-subtitle {
    max-width: 100%;
  }

  .stats-section {
    margin-top: 0;
    padding-top: 1.2rem;
  }

  .proof-strip {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-stack,
  .reveal-section,
  .category-card,
  .btn,
  .card {
    transition: none !important;
    animation: none !important;
  }
}
</style>
