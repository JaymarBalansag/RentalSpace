import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import Map from '@/views/map.vue'
import properties from '@/views/properties.vue'
import Login from '@/views/Authentication/login.vue'
import Register from '@/views/Authentication/register.vue'

const routes = [
  {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
      meta: { requiresAuth:true }
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(
  (to, from, next) => {
    const isLoggedIn = !!localStorage.getItem("token");

    if((to.path === "/login" || to.path === "/register") && isLoggedIn){
      return next("/properties");
    }

    if(to.meta.requiresAuth && !isLoggedIn){
      return next("/login");
    }
    
    next();
  }
);


export default router
