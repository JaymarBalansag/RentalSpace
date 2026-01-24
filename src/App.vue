<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { useUserInfo } from '@/store/userInfo';
import api from './api/api';

onMounted(async () => { 
  const info = useUserInfo();
  const isLoggedIn = localStorage.getItem("access_token");
  info.hydrateUserInfo();
  if(isLoggedIn){
    const user = await api.get("/user");
    const payload = {
      "user" : user.data.user[0].first_name,
      "first_name" : user.data.user[0].first_name,
      "last_name" : user.data.user[0].last_name,
      "role" : user.data.user[0].role,
      "email" : user.data.user[0].email,
      "profile_photo" : user.data.user[0].user_img_url,
      "email_verified_at" : user.data.user[0].email_verified_at,
    }
    info.hydrateUserInfoFromServer(payload);
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
