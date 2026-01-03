<template>
  <Header />

  <!-- ROOT -->
  <div class="container-fluid chat-root mt-3">
    <div class="row h-100 d-none d-md-flex">

      <!-- Chat Heads -->
      <div class="col-md-4 border-end d-flex flex-column">
        <div class="d-flex align-items-center mb-3 px-2">
          <h5 class="mb-0">Messages</h5>
          <router-link to="/" class="btn btn-light btn-sm ms-auto">
            <i class="bi bi-arrow-left"></i> Back
          </router-link>
        </div>

        <ul class="list-group flex-grow-1 overflow-auto">
          <li
            v-for="chat in chats"
            :key="chat.user_id"
            class="list-group-item list-group-item-action d-flex align-items-center"
            :class="{ active: selectedChat && selectedChat.user_id === chat.user_id }"
            @click="selectChat(chat)"
            style="cursor: pointer;"
          >
            <img
              :src="chat.profile_photo"
              class="rounded-circle me-3"
              width="40"
              height="40"
              alt="profile"
            />
            <div>
              <h6 class="mb-0">{{ chat.name }}</h6>
              <small class="text-muted">{{ chat.lastMessage }}</small>
            </div>
          </li>
        </ul>
      </div>

      <!-- Chat Window -->
      <div class="col-md-8 d-flex flex-column chat-window">

        <div v-if="selectedChat" class="d-flex flex-column h-100">

          <!-- Chat Header -->
          <div class="border-bottom py-2 px-3 d-flex align-items-center">
            <img
              :src="profile_photo"
              class="rounded-circle me-2"
              width="40"
              height="40"
              alt="profile"
            />
            <h6 class="mb-0">{{ selectedChat.name }}</h6>
          </div>

          <!-- Messages (ONLY SCROLLABLE) -->
          <div
            class="messages-box flex-grow-1 overflow-auto px-3 py-2"
            ref="messagesBox"
          >
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="mb-2"
              :class="{ 'text-end': msg.sender_id === authId }"
            >
              <span
                class="px-3 py-2 rounded-pill d-inline-block message-bubble"
                :class="msg.sender_id === authId
                  ? 'bg-primary text-white'
                  : 'bg-light text-dark'"
              >
                {{ msg.message }}
              </span>
            </div>
          </div>

          <!-- Input (FIXED) -->
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

        <!-- Empty State -->
        <div
          v-else
          class="d-flex justify-content-center align-items-center flex-grow-1"
        >
          <p class="text-muted">Select a chat to start messaging</p>
        </div>

      </div>
    </div>

    <div class="row h-100 d-md-none d-flex">
      <!-- Chat Heads -->
      <div class="col-12 border-end d-flex flex-column">
        <div class="d-flex align-items-center mb-3 px-2">
          <h5 class="mb-0">Messages</h5>
          <router-link to="/" class="btn btn-light btn-sm ms-auto">
            <i class="bi bi-arrow-left"></i> Back
          </router-link>
        </div>

        <div class="border-bottom py-2 px-3 d-flex align-items-center">
          <button
            :class="selectedChat ? 'd-inline-block' : 'd-none'"
            class="btn btn-light btn-sm me-2"
            @click="selectedChat = null"
          >
            <i class="bi bi-arrow-left"></i>
          </button>

          <h6 class="mb-0">{{ selectedChat?.name }}</h6>
        </div>

        <ul :class="selectedChat ? 'd-none' : 'd-flex'" class="list-group flex-grow-1 overflow-auto">
          <li
            v-for="chat in chats"
            :key="chat.user_id"
            class="list-group-item list-group-item-action d-flex align-items-center"
            :class="{ active: selectedChat && selectedChat.user_id === chat.user_id }"
            @click="selectChat(chat)"
            style="cursor: pointer;"
          >
            <img
              :src="chat.profile_photo"
              class="rounded-circle me-3"
              width="40"
              height="40"
              alt="profile"
            />
            <div>
              <h6 class="mb-0">{{ chat.name }}</h6>
              <small class="text-muted">{{ chat.lastMessage }}</small>
            </div>
          </li>
        </ul>

        <!-- Chat Window for mobile -->
        <div :class="selectedChat ? 'd-block' : 'd-none'" class="messages-box flex-grow-1 overflow-auto px-3 py-2" ref="messagesBox">
          <div v-for="(msg, index) in messages" :key="index" class="mb-2" :class="{ 'text-end': msg.sender_id === authId }">
            <span class="px-3 py-2 rounded-pill d-inline-block message-bubble" :class="msg.sender_id === authId ? 'bg-primary text-white' : 'bg-light text-dark'">
              {{ msg.message }}
            </span>
          </div>
        </div>

        <!-- Input (FIXED) -->
        <div :class="selectedChat ? 'd-flex' : 'd-none'" class="border-top p-3">
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

    </div>
    
  </div>
</template>

<script>
import { fetchConversation, fetchMessages, sendMessage } from '@/api/messages';
import { getAuthUserId } from '@/api/user';
import Header from '@/components/Header.vue';

export default {
  components: { Header },

  data() {
    return {
      authId: null,
      chats: [],
      selectedChat: null,
      messages: [],
      newMessage: '',
      profile_photo: null
    };
  },

  methods: {
    async selectChat(chat) {
      this.selectedChat = chat;
      this.profile_photo = chat.profile_photo;

      const res = await fetchConversation(chat.user_id);
      this.messages = res.data.messages;

      this.scrollToBottom();
    },

    async sendMessage() {
      if (!this.newMessage.trim()) return;

      const text = this.newMessage;
      const receiverId = this.selectedChat.user_id;

      this.messages.push({
        sender_id: this.authId,
        receiver_id: receiverId,
        message: text
      });

      this.newMessage = '';
      this.scrollToBottom();

      try {
        const res = await sendMessage(receiverId, text);
        this.messages[this.messages.length - 1] = res.data.message;
      } catch (e) {
        console.error(e);
      }
    },

    async getMessages() {
      const res = await fetchMessages();
      this.chats = res.data.chats;
    },

    async getAuthId() {
      const res = await getAuthUserId();
      this.authId = res.data.userid;
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messagesBox;
        if (el) el.scrollTop = el.scrollHeight;
      });
    }
  },

  async mounted() {
    await this.getAuthId();
    await this.getMessages();

    window.Echo.private(`chat.${this.authId}`).listen('MessageSent', (e) => {
      if (this.selectedChat && (e.sender_id === this.selectedChat.user_id || e.receiver_id === this.selectedChat.user_id)) {
        this.messages.push(e);
        this.scrollToBottom();
      }
    });
  }
};
</script>

<style scoped>
.chat-root {
  height: calc(100vh - 64px); /* header height */
}

.message-bubble {
  max-width: 75%;

}

.messages-box {
  background-color: #ffffff;
}

.list-group-item.active {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #000;
}
</style>
