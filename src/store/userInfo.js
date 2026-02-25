import { completeProfile } from "@/api/user";
import { defineStore } from "pinia";
import api from "@/api/api";

export const useUserInfo = defineStore("info", {
  state: () => ({
    first_name: null,
    last_name: null,
    email: null,
    role: null,
    isLoggedIn: false,
    profile_photo: null,
    email_verified_at: null,
    isComplete: null,
    subscription: null,
    owner_verification_status: null,
    owner_verified_at: null,
  }),
  actions: {
    setUserInfo(first_name, last_name, role, email, profile_photo, email_verified_at, isComplete, owner_verification_status = null, owner_verified_at = null) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.role = role;
      this.email = email;
      this.isLoggedIn = true;
      this.profile_photo = profile_photo;
      this.email_verified_at = email_verified_at; 
      this.isComplete = isComplete;
      this.owner_verification_status = owner_verification_status;
      this.owner_verified_at = owner_verified_at;

      localStorage.setItem("userInfo", JSON.stringify(this.$state));
    },
    updateUserProfile(first_name, last_name, user_img_url){
      this.first_name = first_name;
      this.last_name = last_name;
      this.profile_photo = user_img_url;

      localStorage.setItem("userInfo", JSON.stringify(this.$state));
    },
    completeProfileInPage(first_name, last_name, profile_photo) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.profile_photo = profile_photo;
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        userInfo.first_name = first_name;
        userInfo.last_name = last_name;
        userInfo.profile_photo = profile_photo;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
    },
    setRole(role) {
      this.role = role;
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        userInfo.role = role;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
    },
    hydrateUserInfo() {
      const raw = localStorage.getItem("userInfo");
      if (!raw) return;

      try {
        const data = JSON.parse(raw);
        Object.assign(this, data);
      } catch (e) {
        console.warn("Failed to hydrate userInfo:", e);
        localStorage.removeItem("userInfo");
      }
    },
    async hydrateUserInfoFromServer(payload) {
      this.setUserInfo(
        payload.first_name,
        payload.last_name,
        payload.role,
        payload.email,
        payload.profile_photo,
        payload.email_verified_at,
        payload.isComplete,
        payload.owner_verification_status,
        payload.owner_verified_at
      )
    },
    setLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      userInfo.isLoggedIn = isLoggedIn;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    setSubscriptionStatus(subscription) {
      this.subscription = subscription;
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      userInfo.subscription = subscription;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    clearSubscriptionStatus() {
      this.subscription = null;
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      delete userInfo.subscription;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    setOwnerVerificationStatus(status, verifiedAt = null) {
      this.owner_verification_status = status;
      this.owner_verified_at = verifiedAt;
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      userInfo.owner_verification_status = status;
      userInfo.owner_verified_at = verifiedAt;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    logout() {
      this.first_name = null;
      this.last_name = null;
      this.email = null;
      this.role = "guest";
      this.isLoggedIn = false;
      this.profile_photo = null;
      this.email_verified_at = null;
      this.subscription = null;
      this.owner_verification_status = null;
      this.owner_verified_at = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("access_token");
    }
  }
});
