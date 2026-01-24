import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
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
import ChangePassword from '@/views/User/ChangePassword.vue'
import EditProfile from '@/views/User/EditProfile.vue'
import Payment from '@/views/Owner/Payment.vue'
import TenantDashboard from '@/views/User/TenantDashboard.vue'
import { useUserInfo } from '@/store/userInfo'
import Admin from '@/views/Admin/Admin.vue'
import LandingPage from '@/views/Main/LandingPage.vue'
import EditLocation from '@/views/User/EditLocation.vue'
import VerifyEmail from '@/views/Authentication/VerifyEmail.vue'
import ResendVerifyEmail from '@/views/Authentication/ResendVerifyEmail.vue'
const routes = [
  {
      path: '/',
      redirect: '/Rentahub'
    },
    {
      path: '/Rentahub',
      name: 'LandingPage',
      component: LandingPage,
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
      meta: { requiresAuth:true, isVerified:true }
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
      meta: { requiresAuth:true, isVerified:true },
    },
    {
      path: '/completion',
      name: 'profile_completion',
      component: CompleteProfile,
      meta: {requiresAuth:true, isVerified:true},
    },
    {
      path: '/profile/preferences/edit',
      name: 'edit_preferences',
      component: EditPreference,
      meta: {requiresAuth:true, isVerified:true},
    },
    {
      path: '/profile/location/edit',
      name: 'edit_location',
      component: EditLocation,
      meta: {requiresAuth:true, isVerified:true},
    },
    {
      path: '/profile/edit',
      name: 'edit_profile',
      component: EditProfile,
      meta: { requiresAuth:true, isVerified:true},
    },
    {
      path: '/messages',
      name: 'messages',
      component: Message,
      meta: { requiresAuth:true, isVerified:true},
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notification,
      meta: { requiresAuth:true, isVerified:true},
    },
    {
      path: '/settings',
      name: 'settings',
      component: Setting,
      meta: { requiresAuth:true, isVerified:true},
    },
    {
      path: '/change-pass',
      name: 'changePassword',
      component: ChangePassword,
      meta: { requiresAuth:true, isVerified:true},
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
    {
      path: '/tenant/dashboard',
      name: 'tenantDashboard',
      component: TenantDashboard,
      meta: {requiresAuth:true, isVerified:true, roleIsTenants: true}
    },
    // On development and testing ( Payment )
    {
      path: "/payment/wall",
      name: "paymentWall",
      component: PaymentWall,
      meta: { requiresAuth:true, isUser: true, isVerified:true },
    },
    {
      path: '/payment/details',
      name: "paymentDetails",
      component: PaymentDetails,
      meta: { requiresAuth:true, isUser: true, isVerified:true},
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
    {
      path: '/verify-email',
      name: 'verify-email',
      component: VerifyEmail
    },
    {
      path: "/reverify-email",
      name: "reverify-email",
      component: ResendVerifyEmail,
      meta: { requiresAuth: true }
    },
    // For Owner
    {
    path: "/dashboard",
    name: "OwnerDashboard",
    redirect: "/overview",
    component: Dashboard,
    meta: { requiresAuth:true, roleIsOwner: true, isVerified:true  },
    children: [
        {
          path: "/overview",
          name: "OwnerOverview",
          component: Overview,
          meta: { requiresAuth:true },
        },
        {
          path: "/properties",
          name: "OwnerProperties",
          component: Properties,
          meta: { requiresAuth:true },
        },
        {
          path: "/dashboard/properties/add",
          name: "AddProperty",
          component: AddProperty,
          meta: { requiresAuth:true },
        },
        {
          path: "/dashboard/properties/:id/edit",
          name: "EditProperty",
          component: EditProperty,
          meta: { requiresAuth:true },
        },
        {
          path: "/tenants",
          name: "OwnerTenants",
          component: Tenants,
          meta: { requiresAuth:true },
        },
        {
          path: "/bookings",
          name: "OwnerBookings",
          component: Bookings,
          meta: { requiresAuth:true },
        },
        {
          path: "/billing",
          name: "OwnerBilling",
          component: Billing,
          meta: { requiresAuth:true },
        },
        {
          path: "/ledger",
          name: "AccountLedger",
          component: Payment,
          meta: { requiresAuth:true },
        },
        {
          path: "/reports",
          name: "OwnerReports",
          component: Reports,
          meta: { requiresAuth:true },
        }
      ]
    },
    //  For Admin
    {
      path: "/admin/dashboard",
      name: "AdminDashboard",
      component: AdminDashboard,
      meta: { requiresAuth:true, roleIsAdmin: true, isVerified:true },
      children: [
        {
          path: "/admin/admin",
          name: "AdminOverview",
          component: Admin,
          meta: {requiresAuth:true}
        },
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

]

const router = createRouter({
  history: createWebHistory(),
  routes
})



router.beforeEach(
  (to, from, next) => {
    const isLoggedIn = !!localStorage.getItem("access_token");


    let role = "guest";
    let email_verified_at = null;
    if(isLoggedIn){
      const user = JSON.parse(localStorage.getItem("userInfo"))
      role = user?.role;
      email_verified_at = user?.email_verified_at;
    }

    // Hard Lock for User who is not verified and logged in
    if (
      isLoggedIn &&
      !email_verified_at &&
      to.path !== "/reverify-email" &&
      to.path !== "/logout"
    ) {
      return next("/reverify-email");
    }

    // Redirect to home if user logged in is trying to go to /login /register
    if((to.path === "/login" || to.path === "/register") && isLoggedIn){
      return next("/home");
    }

    if((to.path === "/verify-email" || to.path === "/reverify-email") && isLoggedIn && email_verified_at){
      return next("/home");
    }

    if(to.meta.isUser && role !== "user"){
      return next("/home");
    }

    if(to.meta.isVerified && !email_verified_at){
      return next("/reverify-email")
    }
    
    if (to.meta.roleIsOwner && role !== 'owner') {
      return next("/home"); 
    }
    
    if (to.meta.roleIsAdmin && role !== 'admin') {
      return next("/home"); 
    }

    if (to.meta.roleIsTenants && role !== 'tenants') {
      return next("/home"); 
    }

    if(to.meta.requiresAuth && !isLoggedIn){
      localStorage.removeItem("userInfo");
      return next("/login");
    }
    
    next();
  }
);


export {router};
