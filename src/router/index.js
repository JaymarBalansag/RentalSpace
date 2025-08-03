import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import Map from '@/views/map.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App,
    },
    {
      path: '/Map',
      name: 'map',
      component: Map
    }
  ],
})

export default router
