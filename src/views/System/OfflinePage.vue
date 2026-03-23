<template>
  <main class="offline-page">
    <div class="offline-card">
      <div class="offline-badge">Offline mode</div>
      <h1 class="offline-title">You can still open cached parts of Rentahub.</h1>
      <p class="offline-copy">
        The app shell is available offline, but live listings, payments, messaging, maps, geocoding,
        and fresh dashboard data need an internet connection.
      </p>

      <div class="offline-actions">
        <RouterLink to="/Rentahub" class="btn btn-primary rounded-pill px-4 fw-bold">
          Go to Landing Page
        </RouterLink>
        <button type="button" class="btn btn-outline-primary rounded-pill px-4 fw-bold" @click="retry">
          Retry Connection
        </button>
      </div>

      <div class="offline-grid">
        <section class="offline-panel">
          <h2>Works better offline</h2>
          <p>Previously loaded routes, app styling, and the basic shell can reopen from cache.</p>
        </section>
        <section class="offline-panel">
          <h2>Needs internet</h2>
          <p>Login, owner dashboards, realtime notifications, map tiles, route previews, and payments.</p>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router';

function retry() {
  window.location.reload();
}
</script>

<style scoped>
.offline-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
  background:
    radial-gradient(circle at top left, rgba(255, 209, 102, 0.18), transparent 32%),
    linear-gradient(145deg, #0f223d, #1d4f8f 58%, #edf4ff 58%, #f8fbff 100%);
}

.offline-card {
  width: min(880px, 100%);
  padding: 2rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(197, 216, 242, 0.9);
  box-shadow: 0 24px 70px rgba(8, 24, 49, 0.2);
}

.offline-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  background: #e8f1ff;
  color: #26528d;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  margin-bottom: 1rem;
}

.offline-title {
  max-width: 16ch;
  font-size: clamp(2rem, 5vw, 3.6rem);
  line-height: 0.98;
  color: #112544;
  margin-bottom: 1rem;
}

.offline-copy {
  max-width: 60ch;
  font-size: 1rem;
  color: #4e6484;
  margin-bottom: 1.4rem;
}

.offline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.offline-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.offline-panel {
  border-radius: 22px;
  padding: 1.15rem;
  background: linear-gradient(180deg, #f8fbff, #eef4ff);
  border: 1px solid #dbe7fa;
}

.offline-panel h2 {
  font-size: 1rem;
  color: #1b4479;
  margin-bottom: 0.45rem;
}

.offline-panel p {
  color: #5a6f8f;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .offline-card {
    padding: 1.4rem;
  }

  .offline-grid {
    grid-template-columns: 1fr;
  }
}
</style>
