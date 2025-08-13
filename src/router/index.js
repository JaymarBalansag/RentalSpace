import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import Map from '@/views/map.vue'
import properties from '@/views/properties.vue'
import Login from '@/views/Authentication/login.vue'
import Register from '@/views/Authentication/register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: "/properties"
    },
    {
      path: '/map',
      name: 'map',
      component: Map
    },
    {
      path: '/properties',
      name: 'properties',
      component: properties
    },
    // Authentication Route
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: "register",
      component: Register
    }
  ],
})

export default router
