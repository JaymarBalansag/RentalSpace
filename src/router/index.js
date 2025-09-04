import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import home from '@/views/home.vue'
import Login from '@/views/Authentication/login.vue'
import Register from '@/views/Authentication/register.vue'
import Profile from '@/views/User/profile.vue'
// import Experience from '@/views/experience.vue'
import Home from '@/views/Main/Home.vue'
import Map from '@/views/Main/Map.vue'
import Experience from '@/views/Main/Experience.vue'

const routes = [
  {
      path: '/',
      redirect: '/Home'
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
      meta: { requiresAuth:true }
    },
    {
      path: '/experience',
      name: 'experience',
      component: Experience,
      meta: { requiresAuth:true }
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth:true },
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
    const isLoggedIn = !!localStorage.getItem("access_token");

    if((to.path === "/login" || to.path === "/register") && isLoggedIn){
      return next("/home");
    }

    if(to.meta.requiresAuth && !isLoggedIn){
      return next("/login");
    }
    
    next();
  }
);


export default router
