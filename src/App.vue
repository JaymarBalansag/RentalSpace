<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
</script>

<!-- Notes:
RouterLink to
RouterView
-->

<template>

  <Header  v-if="$route.path !== '/login'"></Header>

  <RouterView></RouterView>
  
</template>
