import { defineStore } from "pinia";
import api from "@/api/api";

const USER_INFO_STORAGE_KEY = "userInfo";

const createDefaultState = () => ({
  id: null,
  first_name: null,
  last_name: null,
  email: null,
  role: "guest",
  isLoggedIn: false,
  profile_photo: null,
  email_verified_at: null,
  isComplete: null,
  subscription: null,
  owner_verification_status: null,
  owner_verified_at: null,
  user_verification_status: "unverified",
  user_verified_at: null,
  user_verification_rejected_reason: null,
  user_valid_govt_id_url: null,
  hasHydratedAuth: false,
  isHydratingAuth: false,
});

function readPersistedUserInfo() {
  const raw = localStorage.getItem(USER_INFO_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Failed to parse persisted userInfo:", error);
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
    return null;
  }
}

function buildPersistedUserInfo(state) {
  return {
    id: state.id,
    first_name: state.first_name,
    last_name: state.last_name,
    email: state.email,
    role: state.role,
    isLoggedIn: state.isLoggedIn,
    profile_photo: state.profile_photo,
    email_verified_at: state.email_verified_at,
    isComplete: state.isComplete,
    subscription: state.subscription,
    owner_verification_status: state.owner_verification_status,
    owner_verified_at: state.owner_verified_at,
    user_verification_status: state.user_verification_status,
    user_verified_at: state.user_verified_at,
    user_verification_rejected_reason: state.user_verification_rejected_reason,
    user_valid_govt_id_url: state.user_valid_govt_id_url,
  };
}

function normalizeUserPayload(payload = {}) {
  return {
    id: payload.id ?? null,
    first_name: payload.first_name ?? null,
    last_name: payload.last_name ?? null,
    email: payload.email ?? null,
    role: payload.role ?? "guest",
    isLoggedIn: true,
    profile_photo: payload.profile_photo ?? payload.user_img_url ?? null,
    email_verified_at: payload.email_verified_at ?? null,
    isComplete: payload.isComplete ?? payload.iscomplete ?? null,
    owner_verification_status:
      payload.owner_verification_status ??
      payload.ownerVerificationStatus ??
      null,
    owner_verified_at: payload.owner_verified_at ?? null,
    user_verification_status:
      payload.user_verification_status ?? "unverified",
    user_verified_at: payload.user_verified_at ?? null,
    user_verification_rejected_reason:
      payload.user_verification_rejected_reason ?? null,
    user_valid_govt_id_url:
      payload.user_valid_govt_id_url ?? null,
  };
}

export const useUserInfo = defineStore("info", {
  state: createDefaultState,
  actions: {
    persistUserInfo() {
      localStorage.setItem(
        USER_INFO_STORAGE_KEY,
        JSON.stringify(buildPersistedUserInfo(this.$state))
      );
    },
    resetState() {
      this.$patch(createDefaultState());
    },
    clearPersistedUserInfo() {
      localStorage.removeItem(USER_INFO_STORAGE_KEY);
    },
    hydrateUserInfo() {
      const cached = readPersistedUserInfo();
      if (!cached) return null;

      this.$patch({
        ...cached,
        isLoggedIn: Boolean(cached.isLoggedIn),
      });

      return cached;
    },
    applyUser(payload) {
      this.$patch(normalizeUserPayload(payload));
      this.persistUserInfo();
    },
    setUserInfo(
      first_name,
      last_name,
      role,
      email,
      profile_photo,
      email_verified_at,
      isComplete,
      owner_verification_status = null,
      owner_verified_at = null,
      user_verification_status = "unverified",
      user_verified_at = null,
      user_verification_rejected_reason = null,
      user_valid_govt_id_url = null
    ) {
      this.applyUser({
        first_name,
        last_name,
        role,
        email,
        profile_photo,
        email_verified_at,
        isComplete,
        owner_verification_status,
        owner_verified_at,
        user_verification_status,
        user_verified_at,
        user_verification_rejected_reason,
        user_valid_govt_id_url,
      });
    },
    async fetchCurrentUser() {
      const response = await api.get("/user");
      const user = response?.data?.user?.[0];

      if (!user) {
        throw new Error("Authenticated user payload was missing.");
      }

      this.applyUser(user);
      this.hasHydratedAuth = true;
      this.isHydratingAuth = false;
      return user;
    },
    async bootstrapAuth() {
      if (this.hasHydratedAuth) {
        return this.isLoggedIn;
      }

      if (this.isHydratingAuth) {
        return this.isLoggedIn;
      }

      this.isHydratingAuth = true;
      this.hydrateUserInfo();

      const token = localStorage.getItem("access_token");
      if (!token) {
        this.resetState();
        this.hasHydratedAuth = true;
        this.isHydratingAuth = false;
        this.clearPersistedUserInfo();
        return false;
      }

      try {
        await this.fetchCurrentUser();
      } catch (error) {
        const status = error?.response?.status;

        if ([401, 403, 419].includes(status)) {
          this.logout();
        } else {
          console.warn("Could not bootstrap user profile:", status || error);
        }
      } finally {
        this.hasHydratedAuth = true;
        this.isHydratingAuth = false;
      }

      return this.isLoggedIn;
    },
    async hydrateUserInfoFromServer(payload) {
      this.applyUser(payload);
    },
    updateUserProfile(first_name, last_name, user_img_url) {
      this.$patch({
        first_name,
        last_name,
        profile_photo: user_img_url,
      });
      this.persistUserInfo();
    },
    completeProfileInPage(first_name, last_name, profile_photo) {
      this.$patch({
        first_name,
        last_name,
        profile_photo,
      });
      this.persistUserInfo();
    },
    setRole(role) {
      this.role = role;
      this.isLoggedIn = role !== "guest";
      this.persistUserInfo();
    },
    setLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
      this.persistUserInfo();
    },
    setSubscriptionStatus(subscription) {
      this.subscription = subscription;
      this.persistUserInfo();
    },
    clearSubscriptionStatus() {
      this.subscription = null;
      this.persistUserInfo();
    },
    setOwnerVerificationStatus(status, verifiedAt = null) {
      this.owner_verification_status = status;
      this.owner_verified_at = verifiedAt;
      this.persistUserInfo();
    },
    setUserVerificationStatus(
      status,
      verifiedAt = null,
      rejectedReason = null,
      validIdUrl = null
    ) {
      this.user_verification_status = status || "unverified";
      this.user_verified_at = verifiedAt;
      this.user_verification_rejected_reason = rejectedReason;

      if (typeof validIdUrl !== "undefined") {
        this.user_valid_govt_id_url = validIdUrl;
      }

      this.persistUserInfo();
    },
    logout() {
      this.resetState();
      this.clearPersistedUserInfo();
      localStorage.removeItem("access_token");
    },
  },
});
