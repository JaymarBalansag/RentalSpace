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
import CompleteProfile from '@/views/User/CompleteProfile.vue'
import PropertyDetails from '@/views/Main/PropertyDetails.vue'
import AdminDashboard from '@/views/Admin/AdminDashboard.vue'
import OwnerList from '@/views/Admin/owners/ownerList.vue'
import TenantsList from '@/views/Admin/tenants/tenantsList.vue'
import AdminProperty from '@/views/Admin/property/AdminProperty.vue'
import TestMessage from '@/views/User/TestMessage.vue'
import Bookings from '@/views/Owner/Bookings.vue'
import EditPreference from '@/views/User/editPreference.vue'
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
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/property/:id',
      name: 'PropertyDetails',
      component: PropertyDetails,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth:true },
    },
    {
      path: '/completion',
      name: 'profile_completion',
      component: CompleteProfile,
      meta: {requiresAuth:true},
    },
    {
      path: '/profile/preferences/edit',
      name: 'edit_preferences',
      component: EditPreference,
      meta: {requiresAuth:true},
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
    },
    {
      path: '/contactus',
      name: 'contactus',
      component: Contactus,
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
    redirect: "/overview",
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
          path: "/bookings",
          name: "OwnerBookings",
          component: Bookings
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
   },
   {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth:true },
    children: [
      {
        path: "/admin/owners",
        name: "AdminOwners",
        component: OwnerList,
        meta: {requiresAuth:true}
      },
      {
        path: "/admin/tenants",
        name: "AdminTenants",
        component: TenantsList,
        meta: {requiresAuth: true}
      },
      {
        path: "/admin/properties",
        name: "AdminProperties",
        component: AdminProperty,
        meta: {requiresAuth: true}
      } 
    ]
   },
   {
    path: "/testMessage",
    name: "TestMessage",
    component: TestMessage,
    meta: { requiresAuth:true }
   }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let prevRoute = null;

router.beforeEach(
  (to, from, next) => {
    const isLoggedIn = !!localStorage.getItem("access_token");

    prevRoute = from;

    if((to.path === "/login" || to.path === "/register") && isLoggedIn){
      return next("/home");
    }

    if(to.meta.requiresAuth && !isLoggedIn){
      return next("/login");
    }
    
    next();
  }
);


export {router, prevRoute};
