import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import Map from '@/views/map.vue'
import home from '@/views/home.vue'
import Login from '@/views/Authentication/login.vue'
import Register from '@/views/Authentication/register.vue'
import Profile from '@/views/User/profile.vue'
import Info from '@/views/User/info.vue'
import Address from '@/views/User/address.vue'

const routes = [
  {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
      meta: { requiresAuth:true }
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth:true },
      children: [
        { 
          path: '',
          redirect: '/info'
        },
        {
          path: '/info',
          name: 'info',
          component: Info,
        },
        {
          path: '/address',
          name: 'address',
          component: Address
        }
      ]
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
