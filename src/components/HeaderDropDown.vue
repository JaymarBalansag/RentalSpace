<template>
  <div class="dropdown">
    <button 
      class="btn profile-trigger d-flex align-items-center gap-2 p-1" 
      type="button" 
      id="profileDropdown" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
      @click="loadHeaderIndicators"
    >
      <div class="avatar-container shadow-sm">
        <img :src="Profile || placeholderImg" class="profile-img" alt="User" />
      </div>
      <span v-if="hasUnreadHeaderItems" class="notif-badge" aria-label="Unread activity">
        <i class="bi bi-bell-fill"></i>
      </span>
      <i class="bi bi-chevron-down text-white small d-none d-md-block"></i>
    </button>

    <ul class="dropdown-menu dropdown-menu-end profile-dropdown shadow-lg border-0 animate slideIn" aria-labelledby="profileDropdown">
      <div class="dropdown-header-box px-3 py-2 mb-2 ">
        <span class="d-block fw-bold text-dark">{{ nameis }}</span>
        <span class="small text-muted text-uppercase fw-bold me-1">{{ roleIs }} </span>
        <span
          v-if="roleIs === 'user'"
          class="small fw-semibold mt-1 d-inline-block"
          :class="verificationStatusClass"
        >
           {{ verificationStatusLabel }}
        </span>
      </div>

      <li><RouterLink class="dropdown-item" to="/profile"><i class="bi bi-person"></i> My Profile</RouterLink></li>
      
      <template v-if="roleIs === 'user' && isComplete && isUserVerified">
        <li><button @click="goToPaymentWall" class="dropdown-item text-primary fw-bold"><i class="bi bi-plus-circle"></i> List Property</button></li>
      </template>
      <template v-else-if="roleIs === 'user' && !isComplete">
        <li><RouterLink class="dropdown-item" to="/completion"><i class="bi bi-person-check"></i> Account</RouterLink></li>
      </template>
      <template v-else-if="roleIs === 'user' && isComplete && !isUserVerified">
        <li><RouterLink class="dropdown-item" to="/profile"><i class="bi bi-shield-check"></i> Verify Account</RouterLink></li>
      </template>
      <template v-else-if="roleIs === 'owner'">
        <li><RouterLink class="dropdown-item" to="/Dashboard"><i class="bi bi-speedometer2"></i> Dashboard</RouterLink></li>
      </template>
      <template v-else-if="roleIs === 'admin'">
        <li><RouterLink class="dropdown-item" to="/admin/admin"><i class="bi bi-shield-lock"></i> Admin Panel</RouterLink></li>
      </template>
      <template v-else-if="roleIs === 'tenants'">
        <li><RouterLink class="dropdown-item" to="/tenant/dashboard"><i class="bi bi-shield-lock"></i> Tenant Dashboard</RouterLink></li>
      </template>
      <template v-else></template>

      <li><hr class="dropdown-divider"></li>
      <li>
        <RouterLink
          class="dropdown-item message-item"
          :class="{ unread: hasUnreadMessages }"
          to="/messages"
        >
          <span class="dropdown-item-main">
            <i class="bi bi-chat"></i>
            <span>Messages</span>
          </span>
          <span v-if="hasUnreadMessages" class="notification-pill">New</span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          class="dropdown-item notification-item"
          :class="{ unread: hasUnreadNotifications }"
          to="/notifications"
        >
          <span class="dropdown-item-main">
            <i class="bi bi-bell"></i>
            <span>Notifications</span>
          </span>
          <span v-if="hasUnreadNotifications" class="notification-pill">New</span>
        </RouterLink>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li><RouterLink class="dropdown-item" to="/settings"><i class="bi bi-gear"></i> Settings</RouterLink></li>
      <li><hr class="dropdown-divider"></li>
      <li><button @click="handleLogout" class="dropdown-item text-danger"><i class="bi bi-box-arrow-left"></i> Sign Out</button></li>
    </ul>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { logout } from '@/api/auth';
import { useUserInfo } from '@/store/userInfo';
import placeholderImg from "@/assets/Placeholder/thumbnail_placeholder.jpg";
import { fetchNotifications } from "@/api/notifications";
import { fetchMessages } from "@/api/messages";
import { mapNotificationListResponse } from "@/observer/notifications/controller/notificationResponseController";
import { getAuthUserId } from "@/api/user";


export default {
  name: "ProfileDropdown",
  components: { RouterLink },
  computed: {
    isLoggedIn() {
      const info = useUserInfo();
      return info.isLoggedIn;
    },
    roleIs() {
      const info = useUserInfo();
      return info.role;
    },
    nameis(){
      const info = useUserInfo();
      return info.first_name + " " + info.last_name
    },
    Profile(){
      const info = useUserInfo();
      return info.profile_photo;
    },
    isComplete(){
      const info = useUserInfo();
      return info.isComplete;
    },
    userVerificationStatus() {
      return String(useUserInfo().user_verification_status || "unverified").toLowerCase().trim();
    },
    isUserVerified() {
      return this.userVerificationStatus === "verified";
    },
    verificationStatusLabel() {
      if (this.userVerificationStatus === "verified") return "Verified";
      if (this.userVerificationStatus === "pending") return "Pending Verification";
      if (this.userVerificationStatus === "rejected") return "Verification Rejected";
      return "Unverified";
    },
    verificationStatusClass() {
      if (this.userVerificationStatus === "verified") return "text-success";
      if (this.userVerificationStatus === "pending") return "text-warning";
      if (this.userVerificationStatus === "rejected") return "text-danger";
      return "text-secondary";
    },
    hasUnreadHeaderItems() {
      return this.hasUnreadMessages || this.hasUnreadNotifications;
    },
  },
  data() {
    return {
      userprofile : null,
      placeholderImg: placeholderImg,
      hasUnreadNotifications: false,
      hasUnreadMessages: false,
      isNotifLoading: false,
      isMessageLoading: false,
      authUserId: null,
      notificationChannelName: null,
      chatChannelName: null,
    }
  },
  async mounted() {
    await this.loadAuthUserId();
    await this.loadHeaderIndicators();
    this.bindRealtimeNotifications();
    this.bindRealtimeMessages();
    window.addEventListener("notifications:updated", this.loadNotificationIndicator);
    window.addEventListener("messages:updated", this.loadMessageIndicator);
  },
  beforeUnmount() {
    this.unbindRealtimeNotifications();
    this.unbindRealtimeMessages();
    window.removeEventListener("notifications:updated", this.loadNotificationIndicator);
    window.removeEventListener("messages:updated", this.loadMessageIndicator);
  },
  methods: {
    async loadAuthUserId() {
      if (!this.isLoggedIn) {
        this.authUserId = null;
        return;
      }
      try {
        const res = await getAuthUserId();
        this.authUserId = res?.data?.userid || null;
      } catch (_) {
        this.authUserId = null;
      }
    },
    async loadHeaderIndicators() {
      await Promise.all([
        this.loadNotificationIndicator(),
        this.loadMessageIndicator(),
      ]);
    },
    async loadNotificationIndicator() {
      if (!this.isLoggedIn || this.isNotifLoading) return;
      this.isNotifLoading = true;
      try {
        const res = await fetchNotifications(null, 50);
        const notifications = mapNotificationListResponse(res?.data);
        this.hasUnreadNotifications = notifications.some((n) => n.event_type !== "message_received" && !n.read);
      } catch (error) {
        this.hasUnreadNotifications = false;
      } finally {
        this.isNotifLoading = false;
      }
    },
    async loadMessageIndicator() {
      if (!this.isLoggedIn || this.isMessageLoading) return;
      this.isMessageLoading = true;
      try {
        const res = await fetchMessages(null, 50);
        const chats = res?.data?.chats || [];
        this.hasUnreadMessages = chats.some((chat) => {
          const unreadCount = Number(
            chat?.unread_count ??
            chat?.unreadCount ??
            chat?.unread_messages_count ??
            0
          );
          return unreadCount > 0 || Boolean(chat?.has_unread || chat?.is_unread);
        });
      } catch (_) {
        this.hasUnreadMessages = false;
      } finally {
        this.isMessageLoading = false;
      }
    },
    handleRealtimeNotification(eventPayload) {
      const raw = eventPayload?.notification || eventPayload || {};
      const eventType = String(raw?.event_type || raw?.type || "").toLowerCase().trim();
      if (eventType === "message_received" || eventType === "message") return;
      const isRead = Boolean(raw?.read_at || raw?.is_read);
      if (!isRead) {
        this.hasUnreadNotifications = true;
      }
    },
    handleRealtimeMessage() {
      this.hasUnreadMessages = true;
    },
    bindRealtimeNotifications() {
      if (!window.Echo || !this.authUserId) return;
      this.notificationChannelName = `notifications.${this.authUserId}`;
      window.Echo.private(this.notificationChannelName).listen("NotificationCreated", (event) => {
        this.handleRealtimeNotification(event);
      });
    },
    bindRealtimeMessages() {
      if (!window.Echo || !this.authUserId) return;
      this.chatChannelName = `chat.${this.authUserId}`;
      window.Echo.private(this.chatChannelName).listen("MessageSent", () => {
        this.handleRealtimeMessage();
      });
    },
    unbindRealtimeNotifications() {
      if (!this.notificationChannelName || !window.Echo) return;
      window.Echo.leave(`private-${this.notificationChannelName}`);
      this.notificationChannelName = null;
    },
    unbindRealtimeMessages() {
      if (!this.chatChannelName || !window.Echo) return;
      window.Echo.leave(`private-${this.chatChannelName}`);
      this.chatChannelName = null;
    },
    goToPaymentWall() {
      if (!this.isUserVerified) {
        this.$router.push("/profile");
        return;
      }
      this.$router.push("/payment/wall");
    },
    async handleLogout() {
      try {
        await logout();
        const info = useUserInfo();
        this.userprofile = null;
        info.logout();
        this.$router.push("/login");
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
          this.$router.push("/login");
        } else {
          alert("Something went wrong!");
        }
      }
    },
    
  },
}
</script>

<style scoped>
.profile-trigger {
  border-radius: 50px;
  transition: 0.3s;
  position: relative;
  overflow: visible;
}

.profile-trigger:hover {
  background: rgba(255,255,255,0.1);
}

.avatar-container {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  position: relative;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: #1d4ed8;
  border: 2px solid #ffffff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.65rem;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.25);
}

.profile-dropdown {
  min-width: 240px;
  border-radius: 12px;
  padding: 0.5rem;
  margin-top: 10px !important;
}

.dropdown-header-box {
  background: #f8f9fa;
  border-radius: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  color: #444;
}

.dropdown-item i {
  font-size: 1.1rem;
}

.dropdown-item:hover {
  background-color: #f0f4ff;
  color: #4780d9;
}

.notification-item {
  justify-content: space-between;
}

.message-item {
  justify-content: space-between;
}

.dropdown-item-main {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.message-item.unread {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(14, 165, 233, 0.08));
  color: #1d4ed8;
  font-weight: 600;
}

.message-item.unread i {
  color: #1d4ed8;
}

.notification-item.unread {
  background: linear-gradient(135deg, rgba(71, 128, 217, 0.12), rgba(29, 78, 216, 0.06));
  color: #2459b7;
  font-weight: 600;
}

.notification-item.unread i {
  color: #2459b7;
}

.notification-pill {
  margin-left: auto;
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  background: #1d4ed8;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

/* Simple Slide Animation */
.animate.slideIn {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: slideIn;
}

@keyframes slideIn {
  0% { transform: translateY(1rem); opacity: 0; }
  100% { transform: translateY(0rem); opacity: 1; }
}
</style>
