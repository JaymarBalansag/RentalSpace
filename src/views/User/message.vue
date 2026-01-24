<template>
  <Header />

  <div class="container-fluid chat-root">
    <div class="row h-100 g-0 overflow-hidden shadow-sm">
      
      <div 
        class="col-md-4 col-lg-3 border-end bg-white d-flex flex-column conversation-sidebar"
        :class="{ 'd-none d-md-flex': selectedChat }"
      >
        <div class="p-3 border-bottom bg-light">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h4 class="fw-bold mb-0">Messages</h4>
            <router-link to="/home" class="btn btn-sm btn-outline-secondary rounded-pill">
              <i class="bi bi-house"></i>
            </router-link>
          </div>
          <div class="input-group input-group-sm">
            <span class="input-group-text border-0 bg-white shadow-none"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-0 shadow-none bg-white" placeholder="Search chats...">
          </div>
        </div>

        <div class="flex-grow-1 overflow-auto bg-white scroll-custom">
          <div 
            v-for="chat in chats" 
            :key="chat.user_id"
            class="conversation-item d-flex align-items-center p-3 border-bottom transition"
            :class="{ 'active-chat': selectedChat && selectedChat.user_id === chat.user_id }"
            @click="selectChat(chat)"
          >
            <div class="position-relative">
              <img :src="chat.profile_photo" class="rounded-circle me-3 chat-avatar shadow-sm" alt="profile">
              <span class="status-indicator online"></span>
            </div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0 text-truncate fw-bold">{{ chat.name }}</h6>
                <small class="text-muted" style="font-size: 0.7rem;">12:45 PM</small>
              </div>
              <small class="text-muted text-truncate d-block">{{ chat.lastMessage || 'Click to start chatting' }}</small>
            </div>
          </div>
        </div>
      </div>

      <div 
        class="col-md-8 col-lg-9 d-flex flex-column chat-bg"
        :class="{ 'd-flex': selectedChat, 'd-none d-md-flex': !selectedChat }"
      >
        <div v-if="selectedChat" class="d-flex flex-column h-100 position-relative">
          
          <div class="chat-header p-3 border-bottom bg-white d-flex align-items-center justify-content-between sticky-top">
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-light rounded-pill me-2 d-md-none" @click="selectedChat = null">
                <i class="bi bi-arrow-left"></i>
              </button>
              <img :src="profile_photo" class="rounded-circle me-3 shadow-sm" width="45" height="45" alt="profile">
              <div>
                <h6 class="mb-0 fw-bold">{{ selectedChat.name }}</h6>
                <small class="text-success small fw-bold">Online</small>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-link text-muted"><i class="bi bi-telephone"></i></button>
              <button class="btn btn-link text-muted"><i class="bi bi-info-circle"></i></button>
            </div>
          </div>

          <div class="messages-area flex-grow-1 overflow-auto p-4 scroll-custom" ref="messagesBox">
            <div 
              v-for="(msg, index) in messages" 
              :key="index" 
              class="d-flex mb-3"
              :class="msg.sender_id === authId ? 'justify-content-end' : 'justify-content-start'"
            >
              <div 
                class="message-card shadow-sm"
                :class="msg.sender_id === authId ? 'sent' : 'received'"
              >
                <div class="message-text">{{ msg.message }}</div>
                <div class="message-time text-end mt-1">
                  {{ msg.created_at ? formatTime(msg.created_at) : 'Just now' }}
                </div>
              </div>
            </div>
          </div>

          <div class="p-3 bg-white border-top">
            <div class="input-wrapper d-flex align-items-center gap-2 p-2 rounded-pill bg-light border">
              <button class="btn btn-link text-muted p-0 ms-2"><i class="bi bi-plus-circle fs-5"></i></button>
              <input 
                type="text" 
                class="form-control border-0 bg-transparent shadow-none px-3" 
                v-model="newMessage" 
                @keyup.enter="sendMessage" 
                placeholder="Type your message..."
              >
              <button class="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center" @click="sendMessage" style="width: 40px; height: 40px;">
                <i class="bi bi-send-fill text-white"></i>
              </button>
            </div>
          </div>

        </div>

        <div v-else class="empty-chat d-flex flex-column justify-content-center align-items-center flex-grow-1 bg-white">
          <div class="bg-light rounded-circle p-5 mb-4">
            <i class="bi bi-chat-dots text-primary display-1 opacity-25"></i>
          </div>
          <h4 class="fw-bold">Your Messages</h4>
          <p class="text-muted">Select a conversation to start chatting with owners.</p>
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
    formatTime(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
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
  height: calc(100vh - 72px);
  background-color: #f0f2f5;
}

.chat-bg {
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  background-repeat: repeat;
  background-size: contain;
}

/* Sidebar Styling */
.conversation-item {
  cursor: pointer;
  border-left: 4px solid transparent;
}
.conversation-item:hover {
  background-color: #f8f9fa;
}
.active-chat {
  background-color: #f0f7ff !important;
  border-left-color: #0d6efd;
}
.chat-avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

/* Message Bubble Styling */
.message-card {
  max-width: 70%;
  padding: 10px 16px;
  border-radius: 18px;
  font-size: 0.95rem;
}
.sent {
  background-color: #0d6efd;
  color: white;
  border-bottom-right-radius: 4px;
}
.received {
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px;
}
.message-time {
  font-size: 0.65rem;
  opacity: 0.7;
}

/* Status Indicator */
.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 15px;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-radius: 50%;
}
.online { background-color: #28a745; }

/* Custom Scrollbar */
.scroll-custom::-webkit-scrollbar { width: 5px; }
.scroll-custom::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }

@media (max-width: 768px) {
  .chat-root { height: calc(100vh - 60px); }
  .sidebar-mobile { width: 100%; }
}
</style>