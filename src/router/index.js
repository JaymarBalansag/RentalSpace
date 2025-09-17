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
import PaymentWall from '@/views/Payment/paymentWall.vue'
import PaymentDetails from '@/views/Payment/paymentDetails.vue'
import Dashboard from '@/views/Owner/Dashboard.vue'
import Overview from '@/views/Owner/Overview.vue'
import Properties from '@/views/Owner/Properties.vue'
import Tenants from '@/views/Owner/Tenants.vue'
import Reports from '@/views/Owner/Reports.vue'
import Billing from '@/views/Owner/Billing.vue'
import EditProperty from '@/views/Owner/PropertyCrud/editProperty.vue'
import AddProperty from '@/views/Owner/PropertyCrud/addProperty.vue'
import PropertyWizard from '@/components/PropertyWizard/PropertyWizard.vue'
import Message from '@/views/User/message.vue'
import Notification from '@/views/User/notification.vue'
import Setting from '@/views/User/setting.vue'
import About from '@/views/User/about.vue'
import Contactus from '@/views/User/contactus.vue'

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
    {
      path: '/messages',
      name: 'messages',
      component: Message,
      meta: { requiresAuth:true },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notification,
      meta: { requiresAuth:true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Setting,
      meta: { requiresAuth:true },
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: { requiresAuth:true },
    },
    {
      path: '/contactus',
      name: 'contactus',
      component: Contactus,
      meta: { requiresAuth:true },
    },
    // On development and testing ( Payment )
    {
      path: "/payment/wall",
      name: "paymentWall",
      component: PaymentWall
    },
    {
      path: '/payment/details',
      name: "paymentDetails",
      component: PaymentDetails
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
    },
    // For Owner
    {
    path: "/dashboard",
    name: "OwnerDashboard",
    component: Dashboard,
    children: [
        {
          path: "/overview",
          name: "OwnerOverview",
          component: Overview
        },
        {
          path: "/properties",
          name: "OwnerProperties",
          component: Properties
        },
        {
          path: "/dashboard/properties/add",
          name: "AddProperty",
          component: AddProperty
        },
        {
          path: "/dashboard/properties/:id/edit",
          name: "EditProperty",
          component: EditProperty
        },
        {
          path: "/tenants",
          name: "OwnerTenants",
          component: Tenants
        },
        {
          path: "/billing",
          name: "OwnerBilling",
          component: Billing
        },
        {
          path: "/reports",
          name: "OwnerReports",
          component: Reports
        }
      ]
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
