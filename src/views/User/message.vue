<template>
  <div class="container-fluid py-4" style="height: 100vh;">
    <div class="row h-100">

      <!-- Chat Heads -->
      <div class="col-md-4 border-end">
        <div class="d-flex justify-content-center align-content-center mb-3">
          <h5>Messages</h5>
          <router-link to="/" class="btn btn-light btn-sm ms-auto">
                <i class="bi bi-arrow-left"></i>
                Back
            </router-link>
        </div>

        <ul class="list-group me-2">
          <li
            v-for="chat in chats"
            :key="chat.user_id"
            class="list-group-item list-group-item-action d-flex align-items-center"
            :class="{ active: selectedChat && selectedChat.user_id === chat.user_id }"
            @click="selectChat(chat, chat.user_id, chat.profile_photo)"
            style="cursor: pointer;"
          >
            <div class="profile-circle me-3">
              <!-- <i class="bi bi-person text-secondary"></i> -->
               <img
                  :src="chat.profile_photo"
                  class="rounded-circle"
                  width="40"
                  height="40"
                  alt="user profile"
                />
            </div>

            <div>
              <h6 class="mb-0">{{ chat.name }}</h6>
              <small class="text-muted">{{ chat.lastMessage }}</small>
            </div>
          </li>
        </ul>
      </div>

      <!-- Chat Window -->
      <div class="col-md-8 d-flex flex-column">
        <div v-if="selectedChat" class="d-flex flex-column h-100">

          <!-- Header -->
          <div class="border-bottom py-2 px-3 d-flex align-items-center">
            <div class="profile-circle me-2">
              <!-- <i class="bi bi-person text-secondary"></i> -->
               <img
                  :src="profile_photo"
                  class="rounded-circle"
                  width="40"
                  height="40"
                  alt="user profile"
                />
            </div>
            <h6 class="mb-0">{{ selectedChat.name }}</h6>
          </div>

          <!-- Messages -->
          <div class="messages-container">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="my-3"
              :class="{ 'text-end': msg.sender_id === authId }"
            >
              <span
                class="px-3 py-2 rounded-pill"
                :class="msg.sender_id === authId ? 'bg-primary text-white' : 'bg-light text-dark'"
              >
                {{ msg.message }}
              </span>
            </div>
          </div>

          <!-- Input -->
          <div class="border-top p-3">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="newMessage"
                @keyup.enter="sendMessage"
                placeholder="Type a message..."
              />
              <button class="btn btn-primary" @click="sendMessage">
                <i class="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="d-flex justify-content-center align-items-center flex-grow-1">
          <p class="text-muted">Select a chat to start messaging</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchConversation, fetchMessages, sendMessage } from '@/api/messages';
import { getAuthUserId } from '@/api/user';

export default {
  data() {
    return {
      authId: null, // your id
      chats: [],
      selectedChat: null,
      messages: [],
      newMessage: ""
    };
  },
  methods: {
    async selectChat(chat, user_id, profile_photo) {
      try {
        this.selectedChat = chat;
        this.profile_photo = profile_photo || null;
        
        const response = await fetchConversation(user_id);
        this.messages = response.data.messages;

      } catch (error) {
        console.info("Error selecting chat:", error);
      }
      // For testing, we keep the starter messages
      // In real scenario, fetch messages from backend
    },
    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedChat) return;

      const messageText = this.newMessage;
      const receiverId = this.selectedChat.user_id;

      // Temporarily show the message (optimistic UI)
      this.messages.push({
        sender_id: this.authId,
        receiver_id: receiverId,
        message: messageText
      });

      this.newMessage = "";

      try {
        const response = await sendMessage(receiverId, messageText);

        // Update local data with actual server response (includes DB id + timestamp)
        this.messages[this.messages.length - 1] = response.data.message;

        // Update chat preview on left sidebar
        this.selectedChat.lastMessage = messageText;

      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    async getMessages() {
      try {
        // console.info("Fetching messages...");
        const response = await fetchMessages();
        // console.info("Fetched? or not...");
        this.chats = response.data.chats;

        // this.chats = response.data.chatWithUserInfos

      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    async getAuthId() {
      try {
        const response = await getAuthUserId();
        this.authId = response.data.userid;
      } catch (error) {
        console.error("Error fetching auth ID:", error);
      }
    }
  },
  async mounted() {
    await this.getAuthId();
    await this.getMessages();

    // Check query param
    const userIdFromQuery = this.$route.query.user;
    if(userIdFromQuery) {
      const chatToSelect = this.chats.find(c => c.user_id == userIdFromQuery);
      if(chatToSelect) {
        this.selectChat(chatToSelect, chatToSelect.user_id);
      }
    }

    // console.log('AUTH ID READY:', this.authId);

    window.Echo.private(`chat.${this.authId}`)
      .listen('MessageSent', (e) => {
        console.log('RT MESSAGE RECEIVED:', e);

        if (
          this.selectedChat &&
          (e.sender_id === this.selectedChat.user_id ||
          e.receiver_id === this.selectedChat.user_id)
        ) {
          this.messages.push(e);
        }
      });
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.messages-container');
        container.scrollTop = container.scrollHeight;
      });
    }
  }


};
</script>

<style scoped>
.profile-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
