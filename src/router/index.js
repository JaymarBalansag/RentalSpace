import { createRouter, createWebHistory } from 'vue-router'

// STATIC IMPORTS: These load immediately on the first visit
import LandingPage from '@/views/Main/LandingPage.vue'
import Home from '@/views/Main/Home.vue'
import Login from '@/views/Authentication/login.vue'
import Register from '@/views/Authentication/register.vue'
import { getOwnerSubscriptionStatus } from '@/api/subscription'

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
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },

  // LAZY LOADED: Main & User
  { 
    path: '/map',
    name: 'map',
    component: () => import('@/views/Main/Map.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experience',
    name: 'experience',
    component: () => import('@/views/Main/Experience.vue'),
    meta: { requiresAuth: true, isVerified: true }
  },
  {
    path: '/property/:id',
    name: 'PropertyDetails',
    component: () => import('@/views/Main/PropertyDetails.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/User/profile.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },
  {
    path: '/profile/edit',
    name: 'edit_profile',
    component: () => import('@/views/User/EditProfile.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },
  {
    path: '/profile/preferences/edit',
    name: 'edit_preferences',
    component: () => import('@/views/User/editPreference.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },
  {
    path: '/profile/location/edit',
    name: 'edit_location',
    component: () => import('@/views/User/EditLocation.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },
  {
    path: '/completion',
    name: 'profile_completion',
    component: () => import('@/views/User/CompleteProfile.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('@/views/User/message.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/User/notification.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/User/setting.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },
  {
    path: '/change-pass',
    name: 'changePassword',
    component: () => import('@/views/User/ChangePassword.vue'),
    meta: { requiresAuth: true, isVerified: true },
  },

  // LAZY LOADED: Payments (Essential to lazy load due to potential heavy Stripe/SDKs)
  {
    path: "/payment/wall",
    name: "paymentWall",
    component: () => import('@/views/Payment/paymentWall.vue'),
    meta: { requiresAuth: true, isUser: true, isVerified: true, requiresUserVerification: true },
  },
  {
    path: '/payment/details',
    name: "paymentDetails",
    component: () => import('@/views/Payment/paymentDetails.vue'),
    meta: { requiresAuth: true, isUser: true, isVerified: true, requiresUserVerification: true },
  },
  {
    path: '/payment/checkout',
    name: "paymentCheckout",
    component: () => import('@/views/Payment/PaymentCheckout.vue'),
    meta: { requiresAuth: true, isUser: true, isVerified: true },
  },
  {
    path: '/payment/success',
    name: "paymentSuccess",
    component: () => import('@/views/Payment/PaymentSuccess.vue'),
    meta: { requiresAuth: true, isUser: true, isVerified: true },
  },

  // LAZY LOADED: Tenant & Support
  {
    path: '/tenant/dashboard',
    name: 'tenantDashboard',
    component: () => import('@/views/User/TenantDashboard.vue'),
    meta: { requiresAuth: true, isVerified: true, roleIsTenants: true }
  },
  {
    path: '/tenant/checkout',
    name: 'tenantMockCheckout',
    component: () => import('@/views/User/TenantMockCheckout.vue'),
    meta: { requiresAuth: true, isVerified: true, roleIsTenants: true }
  },
  { path: '/about', name: 'about', component: () => import('@/views/User/about.vue') },
  { path: '/contactus', name: 'contactus', component: () => import('@/views/User/contactus.vue') },

  // LAZY LOADED: Owner Dashboard
  {
    path: "/dashboard",
    name: "OwnerDashboard",
    redirect: "/overview",
    component: () => import('@/views/Owner/Dashboard.vue'),
    meta: { requiresAuth: true, roleIsOwner: true, isVerified: true },
    children: [
      { path: "/overview", name: "OwnerOverview", component: () => import('@/views/Owner/Overview.vue') },
      { path: "/properties", name: "OwnerProperties", component: () => import('@/views/Owner/Properties.vue') },
      { path: "/dashboard/properties/add", name: "AddProperty", component: () => import('@/views/Owner/PropertyCrud/addProperty.vue') },
      { path: "/dashboard/properties/:id/edit", name: "EditProperty", component: () => import('@/views/Owner/PropertyCrud/editProperty.vue') },
      { path: "/tenants", name: "OwnerTenants", component: () => import('@/views/Owner/Tenants.vue') },
      { path: "/bookings", name: "OwnerBookings", component: () => import('@/views/Owner/Bookings.vue') },
      { path: "/billing", name: "OwnerBilling", component: () => import('@/views/Owner/Billing.vue') },
      { path: "/ledger", name: "AccountLedger", component: () => import('@/views/Owner/Payment.vue') },
      { path: "/reports", name: "OwnerReports", component: () => import('@/views/Owner/Reports.vue') }
    ]
  },

  // LAZY LOADED: Admin Dashboard
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: () => import('@/views/Admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, roleIsAdmin: true, isVerified: true },
    children: [
      { path: "/admin/admin", name: "AdminOverview", component: () => import('@/views/Admin/Admin.vue') },
      { path: "/admin/owners", name: "AdminOwners", component: () => import('@/views/Admin/owners/ownerList.vue') },
      { path: "/admin/tenants", name: "AdminTenants", component: () => import('@/views/Admin/tenants/tenantsList.vue') },
      { path: "/admin/properties", name: "AdminProperties", component: () => import('@/views/Admin/property/AdminProperty.vue') },
      { path: "/admin/bookings", name: "AdminBookings", component: () => import('@/views/Admin/bookings/AdminBookings.vue') }
    ]
  },

  // Auth Extras
  { path: '/verify-email/:id', name: 'verify-email', component: () => import('@/views/Authentication/VerifyEmail.vue') },
  { path: "/reverify-email", name: "reverify-email", component: () => import('@/views/Authentication/ResendVerifyEmail.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("access_token");
  let user = null;
  if (isLoggedIn) {
    try {
      user = JSON.parse(localStorage.getItem("userInfo"));
    } catch (e) {
      user = null;
    }
  }

  const role = user?.role || "guest";
  const email_verified_at = user?.email_verified_at;
  const isComplete = user?.isComplete;
  const userVerificationStatus = String(user?.user_verification_status || "unverified").toLowerCase().trim();

  // Verification Lock
  if (isLoggedIn && !email_verified_at && to.path !== "/reverify-email" && to.path !== "/logout") {
    return next("/reverify-email");
  }

  // Prevent Auth pages for logged in users
  if ((to.path === "/login" || to.path === "/register") && isLoggedIn) {
    return next("/home");
  }

  // Role Checks
  if (to.meta.isUser && role !== "user") return next("/home");
  if (to.meta.roleIsOwner && role !== 'owner') return next("/home");
  if (to.meta.roleIsAdmin && role !== 'admin') return next("/home");
  if (to.meta.roleIsTenants && role !== 'tenants') return next("/home");

  // Auth requirement
  if (to.meta.requiresAuth && !isLoggedIn) {
    localStorage.removeItem("userInfo");
    return next("/login");
  }

  // Owner subscription gate for property management actions.
  const isOwnerPropertyManagementRoute =
    to.path === "/dashboard/properties/add" ||
    /^\/dashboard\/properties\/\d+\/edit$/.test(to.path);

  if (isLoggedIn && role === "owner" && to.meta.roleIsOwner) {
    try {
      const subscription = await getOwnerSubscriptionStatus();
      const userInfoRaw = localStorage.getItem("userInfo");
      if (userInfoRaw) {
        const cached = JSON.parse(userInfoRaw);
        cached.subscription = subscription;
        localStorage.setItem("userInfo", JSON.stringify(cached));
      }

      if (subscription?.is_expiring_soon) {
        sessionStorage.setItem("ownerSubscriptionWarning", subscription.message || "Your subscription is about to expire.");
      }

      if (isOwnerPropertyManagementRoute && !subscription?.can_manage_properties) {
        alert(subscription?.message || "Subscription expired or inactive. Renew to manage properties.");
        return next("/overview");
      }
    } catch (error) {
      if (isOwnerPropertyManagementRoute) {
        alert("Unable to validate subscription status. Please try again.");
        return next("/overview");
      }
    }
  }

  // Completion Lock
  if (to.path === "/completion" && (isComplete === 1 || isComplete === true)) {
    return next("/home");
  }

  if (to.meta.requiresUserVerification && userVerificationStatus !== "verified") {
    return next("/profile");
  }

  next();
});

export { router };
