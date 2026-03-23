<template>
  <transition name="network-banner">
    <div v-if="isVisible" class="network-banner" role="status" aria-live="polite">
      <div class="network-banner__content">
        <div>
          <div class="network-banner__eyebrow">
            {{ isOnline ? "Offline cache ready" : "You are offline" }}
          </div>
          <strong class="network-banner__title">
            {{ title }}
          </strong>
          <p class="network-banner__text mb-0">
            {{ message }}
          </p>
        </div>

        <div class="network-banner__actions">
          <RouterLink
            v-if="!isOnline"
            to="/offline"
            class="btn btn-sm btn-light rounded-pill px-3 fw-semibold"
          >
            Offline Help
          </RouterLink>
          <button
            v-if="!isOnline"
            type="button"
            class="btn btn-sm btn-outline-light rounded-pill px-3 fw-semibold"
            @click="refreshPage"
          >
            Retry
          </button>
          <button
            type="button"
            class="btn btn-sm btn-link text-white text-decoration-none"
            @click="dismiss"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);
const offlineReady = ref(false);
const apiMessage = ref('');
const dismissed = ref(false);
let resetTimer = null;

const title = computed(() => {
  if (!isOnline.value) return 'Cached pages can still open, but live features need internet.';
  return 'The app shell is cached for faster repeat visits and offline fallback.';
});

const message = computed(() => {
  if (!isOnline.value) {
    return apiMessage.value || 'Maps, chat, payments, and fresh dashboard data may be unavailable until your connection comes back.';
  }

  return 'You can install Rentahub to your device and reopen cached routes even without a stable connection.';
});

const isVisible = computed(() => {
  if (dismissed.value) return false;
  return !isOnline.value || offlineReady.value;
});

function clearResetTimer() {
  if (resetTimer) {
    window.clearTimeout(resetTimer);
    resetTimer = null;
  }
}

function dismiss() {
  dismissed.value = true;
}

function refreshPage() {
  window.location.reload();
}

function onOnline() {
  isOnline.value = true;
  apiMessage.value = '';
}

function onOffline() {
  isOnline.value = false;
  dismissed.value = false;
}

function onOfflineReady() {
  offlineReady.value = true;
  dismissed.value = false;
  clearResetTimer();
  resetTimer = window.setTimeout(() => {
    offlineReady.value = false;
  }, 8000);
}

function onNetworkError(event) {
  const detail = event.detail || {};
  if (isOnline.value && detail.online !== false) return;

  const path = detail.url || 'this request';
  apiMessage.value = `We could not reach ${path}. Try again when your internet is back.`;
  dismissed.value = false;
}

onMounted(() => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  window.addEventListener('rentahub:pwa-offline-ready', onOfflineReady);
  window.addEventListener('rentahub:network-error', onNetworkError);
});

onBeforeUnmount(() => {
  clearResetTimer();
  window.removeEventListener('online', onOnline);
  window.removeEventListener('offline', onOffline);
  window.removeEventListener('rentahub:pwa-offline-ready', onOfflineReady);
  window.removeEventListener('rentahub:network-error', onNetworkError);
});
</script>

<style scoped>
.network-banner {
  position: sticky;
  top: 0;
  z-index: 1200;
  padding: 0.85rem 1rem;
  background: linear-gradient(135deg, #143362, #2d68b8);
  color: #fff;
  box-shadow: 0 10px 24px rgba(9, 23, 46, 0.16);
}

.network-banner__content {
  width: min(1120px, 100%);
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.network-banner__eyebrow {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
  margin-bottom: 0.2rem;
}

.network-banner__title {
  display: block;
  font-size: 0.98rem;
  margin-bottom: 0.15rem;
}

.network-banner__text {
  max-width: 68ch;
  font-size: 0.9rem;
  opacity: 0.92;
}

.network-banner__actions {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
}

.network-banner-enter-active,
.network-banner-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.network-banner-enter-from,
.network-banner-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .network-banner__content {
    flex-direction: column;
    align-items: flex-start;
  }

  .network-banner__actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
