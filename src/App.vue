<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { useUserInfo } from '@/store/userInfo';

onMounted(() => {
  const info = useUserInfo();
  info.hydrateUserInfo();
});

</script>

<!-- Notes:
RouterLink to
RouterView
-->

<template>

  <Header></Header>

  <RouterView></RouterView>
  
</template>
