import { completeProfile } from "@/api/user";
import { defineStore } from "pinia";

export const useUserInfo = defineStore("info", {
  state: () => ({
    first_name: null,
    last_name: null,
    email: null,
    role: null,
    isLoggedIn: false,
    profile_photo: null,

  }),
  actions: {
    setUserInfo(first_name, last_name, role, email, profile_photo) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.role = role;
      this.email = email;
      this.isLoggedIn = true;
      this.profile_photo = profile_photo;

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
    setLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      userInfo.isLoggedIn = isLoggedIn;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    logout() {
      this.first_name = null;
      this.last_name = null;
      this.email = null;
      this.role = "guest"; // or 'guest' if you prefer
      this.isLoggedIn = false;
      this.profile_photo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("access_token");
    }
  }
});
