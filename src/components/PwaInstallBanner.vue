<template>
  <transition name="install-banner">
    <aside v-if="canShowPrompt" class="install-banner" aria-live="polite">
      <div class="install-banner__body">
        <div>
          <div class="install-banner__eyebrow">Install Rentahub</div>
          <h2 class="install-banner__title">Keep Rentahub one tap away.</h2>
          <p class="install-banner__text mb-0">
            Add the app to your home screen for a faster launch, standalone view, and cached offline fallback.
          </p>
        </div>

        <div class="install-banner__actions">
          <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold" @click="installApp">
            Install App
          </button>
          <button type="button" class="btn btn-link text-decoration-none" @click="dismiss">
            Not now
          </button>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const STORAGE_KEY = 'rentahub-install-banner-dismissed';

const deferredPrompt = ref(null);
const isInstalled = ref(false);
const isDismissed = ref(false);

const canShowPrompt = computed(() => !isInstalled.value && !isDismissed.value && !!deferredPrompt.value);

function getDisplayModeStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function markInstalled() {
  isInstalled.value = true;
  deferredPrompt.value = null;
}

function onBeforeInstallPrompt(event) {
  event.preventDefault();
  deferredPrompt.value = event;
  isDismissed.value = false;
  sessionStorage.removeItem(STORAGE_KEY);
}

async function installApp() {
  if (!deferredPrompt.value) return;

  deferredPrompt.value.prompt();
  const result = await deferredPrompt.value.userChoice;

  if (result.outcome !== 'accepted') {
    isDismissed.value = true;
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  deferredPrompt.value = null;
}

function dismiss() {
  isDismissed.value = true;
  sessionStorage.setItem(STORAGE_KEY, '1');
}

onMounted(() => {
  isInstalled.value = getDisplayModeStandalone();
  isDismissed.value = sessionStorage.getItem(STORAGE_KEY) === '1';
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.addEventListener('appinstalled', markInstalled);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.removeEventListener('appinstalled', markInstalled);
});
</script>

<style scoped>
.install-banner {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1150;
  width: min(420px, calc(100vw - 2rem));
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.97), rgba(239, 246, 255, 0.97));
  border: 1px solid rgba(170, 197, 235, 0.9);
  box-shadow: 0 18px 48px rgba(18, 42, 78, 0.16);
  backdrop-filter: blur(10px);
}

.install-banner__body {
  padding: 1.1rem 1.1rem 1rem;
}

.install-banner__eyebrow {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #2e5f9f;
  margin-bottom: 0.45rem;
}

.install-banner__title {
  font-size: 1.2rem;
  line-height: 1.15;
  color: #15315b;
  margin-bottom: 0.45rem;
}

.install-banner__text {
  color: #4e6484;
  font-size: 0.92rem;
  max-width: 34ch;
}

.install-banner__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.install-banner-enter-active,
.install-banner-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.install-banner-enter-from,
.install-banner-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 576px) {
  .install-banner__actions {
    flex-wrap: wrap;
  }

  .install-banner__actions .btn {
    width: 100%;
  }
}
</style>
