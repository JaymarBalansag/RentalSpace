<template>
  <Header />

  <div class="about-page">
    <section class="about-hero">
      <div class="container py-5 text-center">
        <p class="hero-eyebrow mb-2">Who We Are</p>
        <h1 class="display-5 fw-bold text-white mb-2">About RentaHub</h1>
        <p class="hero-copy mx-auto mb-0">
          Making renting simple, transparent, and accessible for every Filipino.
        </p>
      </div>
    </section>

    <SubscriptionWarningBanner />

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <RouterLink to="/home" class="back-link text-decoration-none mb-4 d-inline-flex align-items-center">
            <i class="bi bi-arrow-left me-2"></i>Back to Home
          </RouterLink>

          <section class="panel mb-5">
            <div class="row align-items-center g-4">
              <div class="col-md-6">
                <p class="section-eyebrow mb-2">Our Story</p>
                <h2 class="fw-bold text-dark mb-3">Built To Reduce Rental Friction</h2>
                <p class="text-secondary lh-lg mb-3">
                  <strong>RentaHub</strong> was born from a simple observation: finding a reliable
                  rental space is often stressful and disorganized. Whether it is a student looking
                  for a boarding house or a business seeking a commercial spot, the process was broken.
                </p>
                <p class="text-secondary lh-lg mb-0">
                  We built this platform to bridge the gap between property owners and tenants with
                  map context, real-time messaging, and clearer booking workflows.
                </p>
              </div>
              <div class="col-md-6">
                <div class="media-frame">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                    class="img-fluid rounded-4"
                    alt="Modern Building"
                  >
                </div>
              </div>
            </div>
          </section>

          <section class="row g-4 mb-5">
            <div class="col-md-6">
              <article class="value-card h-100">
                <div class="icon-circle icon-primary mb-3">
                  <i class="bi bi-bullseye fs-4"></i>
                </div>
                <h4 class="fw-bold mb-2">Our Mission</h4>
                <p class="text-muted mb-0">
                  To connect property owners and renters through a reliable and user-friendly system
                  that provides transparency, maps, and real-time communication tools.
                </p>
              </article>
            </div>
            <div class="col-md-6">
              <article class="value-card h-100">
                <div class="icon-circle icon-success mb-3">
                  <i class="bi bi-eye-fill fs-4"></i>
                </div>
                <h4 class="fw-bold mb-2">Our Vision</h4>
                <p class="text-muted mb-0">
                  To be the most trusted rental management platform in the Philippines, empowering local
                  communities through innovative property technology.
                </p>
              </article>
            </div>
          </section>

          <section class="panel mb-5">
            <div class="text-center mb-4">
              <p class="section-eyebrow mb-2">Why RentaHub</p>
              <h3 class="fw-bold mb-0">Designed Around Real Renters</h3>
            </div>
            <div class="row g-4 text-center">
              <div class="col-md-4">
                <div class="feature-icon mx-auto mb-2"><i class="bi bi-geo-alt-fill"></i></div>
                <h6 class="fw-bold">Map Integration</h6>
                <p class="small text-muted mb-0">Locate properties precisely using map-first discovery.</p>
              </div>
              <div class="col-md-4">
                <div class="feature-icon mx-auto mb-2"><i class="bi bi-chat-dots-fill"></i></div>
                <h6 class="fw-bold">Direct Messaging</h6>
                <p class="small text-muted mb-0">Chat directly with owners to confirm rules and availability.</p>
              </div>
              <div class="col-md-4">
                <div class="feature-icon mx-auto mb-2"><i class="bi bi-shield-fill-check"></i></div>
                <h6 class="fw-bold">Verified Listings</h6>
                <p class="small text-muted mb-0">Built to support a safer space for owners and tenants.</p>
              </div>
            </div>
          </section>

          <section class="cta-panel text-center">
            <h4 class="fw-bold mb-2">Ready to find your next place?</h4>
            <p class="text-muted mb-4">Explore listings tailored for students, families, and businesses.</p>
            <RouterLink to="/home" class="btn btn-primary btn-lg rounded-pill px-5 fw-bold">
              Explore All Properties
            </RouterLink>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import Header from "@/components/Header.vue";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner.vue";

export default {
  name: "AboutUsPage",
  components: { RouterLink, Header, SubscriptionWarningBanner },
};
</script>

<style scoped>
.about-page {
  background: radial-gradient(circle at 20% 0, #edf4ff 0%, #f8fbff 34%, #ffffff 100%);
  min-height: 100vh;
}

.about-hero {
  background:
    linear-gradient(145deg, rgba(20, 51, 98, 0.84), rgba(38, 90, 168, 0.78)),
    url("../../assets/Main/about.avif");
  background-size: cover;
  background-position: center;
}

.hero-eyebrow {
  color: #dce9ff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.74rem;
  font-weight: 700;
}

.hero-copy {
  color: rgba(241, 247, 255, 0.9);
  max-width: 62ch;
}

.back-link {
  color: #4a658f;
  font-weight: 600;
}

.panel {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #e3ecfa;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 22px rgba(18, 43, 83, 0.06);
}

.section-eyebrow {
  color: #3a64aa;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
  font-weight: 700;
}

.media-frame {
  border-radius: 18px;
  border: 1px solid #e2eaf9;
  box-shadow: 0 10px 20px rgba(18, 43, 83, 0.1);
  overflow: hidden;
}

.value-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #e3ecfa;
  border-radius: 18px;
  padding: 1.3rem;
  box-shadow: 0 10px 20px rgba(18, 43, 83, 0.06);
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 28px rgba(18, 43, 83, 0.1);
}

.icon-circle {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: inline-grid;
  place-items: center;
}

.icon-primary {
  background: #eaf2ff;
  color: #2f61ae;
}

.icon-success {
  background: #eafaf0;
  color: #1e8a53;
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #eaf2ff;
  color: #2f61ae;
  font-size: 1.2rem;
}

.cta-panel {
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid #deebff;
  border-radius: 20px;
  padding: 2rem;
}

.lh-lg {
  line-height: 1.78;
}

@media (prefers-reduced-motion: reduce) {
  .value-card {
    transition: none !important;
  }
}
</style>
