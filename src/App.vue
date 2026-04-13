<script setup>
import { onMounted } from 'vue';
import NetworkStatusBanner from '@/components/NetworkStatusBanner.vue';
import PwaInstallBanner from '@/components/PwaInstallBanner.vue';
import { useUserInfo } from '@/store/userInfo';
import { RouterView } from 'vue-router';

onMounted(async () => {
  const info = useUserInfo();
  await info.bootstrapAuth();
});
</script>

<template>
  <NetworkStatusBanner />
  <RouterView />
  <PwaInstallBanner />
</template>
