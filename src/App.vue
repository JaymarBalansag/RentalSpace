<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { useUserInfo } from '@/store/userInfo';
import api from './api/api';

onMounted(async () => { 
  const info = useUserInfo();
  const isLoggedIn = localStorage.getItem("access_token");
  
  // 1. Sync local store with localStorage immediately
  info.hydrateUserInfo();

  // 2. Only attempt server fetch if we think we are logged in
  if (isLoggedIn) {
    try {
      const response = await api.get("/user");
      
      // Ensure data exists before mapping
      if (response.data?.user?.[0]) {
        const userData = response.data.user[0];
        const payload = {
          "user" : userData.first_name,
          "first_name" : userData.first_name,
          "last_name" : userData.last_name,
          "role" : userData.role,
          "email" : userData.email,
          "profile_photo" : userData.user_img_url,
          "email_verified_at" : userData.email_verified_at,
          "isComplete" : userData.isComplete,
          "owner_verification_status" : userData.owner_verification_status || null,
          "owner_verified_at" : userData.owner_verified_at || null,
          "user_verification_status": userData.user_verification_status || "unverified",
          "user_verified_at": userData.user_verified_at || null,
          "user_verification_rejected_reason": userData.user_verification_rejected_reason || null,
          "user_valid_govt_id_url": userData.user_valid_govt_id_url || null,
        };
        info.hydrateUserInfoFromServer(payload);
      }
    } catch (error) {
      // If the interceptor failed to refresh, it will handle the redirect.
      // We catch here just to prevent the console from throwing unhandled errors.
      console.warn("Could not sync user profile:", error.response?.status);
    }
  }
});



</script>

<!-- Notes:
RouterLink to
RouterView
-->

<template>

  

  <RouterView></RouterView>
  
</template>
