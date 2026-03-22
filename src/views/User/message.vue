<template>
  <Header />

  <div class="container-fluid chat-root" :style="chatRootStyle">
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
            :key="chat.conversation_id"
            class="conversation-item d-flex align-items-center p-3 border-bottom transition"
            :class="{ 'active-chat': selectedChat && selectedChat.conversation_id === chat.conversation_id }"
            @click="selectChat(chat)"
          >
            <div class="position-relative">
              <img :src="chat.profile_photo" class="rounded-circle me-3 chat-avatar shadow-sm" alt="profile">
              <span class="status-indicator online"></span>
            </div>
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center gap-2 min-w-0">
                  <h6 class="mb-0 text-truncate fw-bold">{{ chat.name }}</h6>
                  <span v-if="chatUnreadCount(chat) > 0" class="chat-unread-pill">{{ chatUnreadCount(chat) }}</span>
                </div>
                <small class="text-muted" style="font-size: 0.7rem;">{{ chat.last_message_time ? formatTime(chat.last_message_time) : '' }}</small>
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
        <div v-if="selectedChat" class="chat-pane d-flex flex-column h-100">
          
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

          <div class="messages-area flex-grow-1 overflow-auto p-4 scroll-custom" ref="messagesBox" @scroll.passive="onMessageScroll">
            <div v-if="loadingOlder" class="text-center small text-muted mb-3">Loading older messages...</div>
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

          <div class="chat-input p-3 bg-white border-top">
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
import { fetchConversation, fetchConversationMessages, fetchMessages, markConversationAsRead, sendConversationMessage } from '@/api/messages';
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
      profile_photo: null,
      nextCursor: null,
      hasMoreMessages: true,
      loadingOlder: false,
      loadingMessages: false,
      chatsLimit: 20,
      messagesLimit: 10,
      chatChannelName: null,
      headerOffset: 72,
      canLoadOlderOnTop: true,
    };
  },
  computed: {
    chatRootStyle() {
      return {
        height: `calc(100dvh - ${this.headerOffset}px)`,
      };
    },
  },
  methods: {
    chatUnreadCount(chat) {
      const count = Number(
        chat?.unread_count ??
        chat?.unreadCount ??
        chat?.unread_messages_count ??
        0
      );
      if (Number.isFinite(count) && count > 0) return count;
      return Boolean(chat?.has_unread || chat?.is_unread) ? 1 : 0;
    },
    emitMessageIndicatorUpdate() {
      window.dispatchEvent(new CustomEvent("messages:updated"));
    },
    clearUnreadForConversation(conversationId) {
      this.chats = this.chats.map((chat) => {
        if (Number(chat.conversation_id) !== Number(conversationId)) return chat;
        return {
          ...chat,
          unread_count: 0,
          unreadCount: 0,
          unread_messages_count: 0,
          has_unread: false,
          is_unread: false,
        };
      });
    },
    async markActiveConversationAsRead(conversationId) {
      if (!conversationId) return;
      this.clearUnreadForConversation(conversationId);
      this.emitMessageIndicatorUpdate();
      try {
        await markConversationAsRead(conversationId);
      } catch (_) {}
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    async selectChat(chat, { keepScrollBottom = true } = {}) {
      if (!chat || !chat.conversation_id) return;
      this.selectedChat = chat;
      this.profile_photo = chat.profile_photo;
      this.messages = [];
      this.nextCursor = null;
      this.hasMoreMessages = true;
      this.canLoadOlderOnTop = true;
      await this.loadMessages({ appendOlder: false, keepScrollBottom });
    },
    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedChat?.conversation_id) return;
      const text = this.newMessage;
      const receiverId = this.selectedChat.user_id;

      this.messages.push({
        sender_id: this.authId,
        conversation_id: this.selectedChat.conversation_id,
        receiver_id: receiverId,
        message: text,
        created_at: new Date().toISOString(),
      });

      this.newMessage = '';
      this.scrollToBottom();

      try {
        const res = await sendConversationMessage(this.selectedChat.conversation_id, text);
        this.messages[this.messages.length - 1] = res.data.message;
        this.bumpChatOnTop(this.selectedChat.conversation_id, res.data.message.message, res.data.message.created_at, true);
      } catch (e) {
        console.error(e);
      }
    },
    async getMessages() {
      const res = await fetchMessages(null, this.chatsLimit);
      this.chats = res?.data?.chats || [];
      this.emitMessageIndicatorUpdate();
    },
    async loadMessages({ appendOlder = false, keepScrollBottom = true } = {}) {
      if (!this.selectedChat?.conversation_id) return;
      if (this.loadingMessages || (appendOlder && (!this.hasMoreMessages || !this.nextCursor))) return;

      this.loadingMessages = true;
      if (appendOlder) this.loadingOlder = true;

      const el = this.$refs.messagesBox;
      const previousHeight = el ? el.scrollHeight : 0;
      const previousTop = el ? el.scrollTop : 0;

      try {
        const cursor = appendOlder ? this.nextCursor : null;
        const res = await fetchConversationMessages(this.selectedChat.conversation_id, cursor, this.messagesLimit);
        const data = res?.data || {};
        const incoming = data.messages || [];

        if (appendOlder) {
          this.messages = [...incoming, ...this.messages];
        } else {
          this.messages = incoming;
        }

        this.nextCursor = data.next_cursor || null;
        this.hasMoreMessages = !!data.has_more;
        await this.markActiveConversationAsRead(this.selectedChat.conversation_id);

        this.$nextTick(() => {
          const box = this.$refs.messagesBox;
          if (!box) return;

          if (appendOlder) {
            const newHeight = box.scrollHeight;
            box.scrollTop = newHeight - previousHeight + previousTop;
          } else if (keepScrollBottom) {
            box.scrollTop = box.scrollHeight;
          }
        });
      } finally {
        this.loadingMessages = false;
        this.loadingOlder = false;
      }
    },
    async getAuthId() {
      const res = await getAuthUserId();
      this.authId = res.data.userid;
    },
    async onMessageScroll() {
      const el = this.$refs.messagesBox;
      if (!el || !this.selectedChat) return;
      if (el.scrollTop > 120) {
        this.canLoadOlderOnTop = true;
        return;
      }
      if (!this.canLoadOlderOnTop) return;
      if (!this.hasMoreMessages || !this.nextCursor || this.loadingOlder) return;

      this.canLoadOlderOnTop = false;
      await this.loadMessages({ appendOlder: true, keepScrollBottom: false });
    },
    bumpChatOnTop(conversationId, lastMessage, lastMessageTime, selectChat = false) {
      const idx = this.chats.findIndex((c) => c.conversation_id === conversationId);
      if (idx === -1) return;

      const chat = { ...this.chats[idx], lastMessage, last_message_time: lastMessageTime };
      this.chats.splice(idx, 1);
      this.chats.unshift(chat);
      if (selectChat && this.selectedChat?.conversation_id === conversationId) {
        this.selectedChat = chat;
      }
    },
    async openFromRouteQuery() {
      const conversationId = this.$route.query.conversation ? Number(this.$route.query.conversation) : null;
      const userId = this.$route.query.user ? Number(this.$route.query.user) : null;

      let target = null;
      if (conversationId) {
        target = this.chats.find((c) => Number(c.conversation_id) === conversationId) || null;
      }
      if (!target && userId) {
        target = this.chats.find((c) => Number(c.user_id) === userId) || null;
      }

      if (!target && userId) {
        const fallback = await fetchConversation(userId, null, this.messagesLimit);
        const cid = fallback?.data?.conversation_id || null;
        if (cid) {
          target = this.chats.find((c) => Number(c.conversation_id) === Number(cid)) || null;
        }
      }

      if (target) {
        await this.selectChat(target, { keepScrollBottom: true });
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messagesBox;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },
    bindRealtimeChannel() {
      if (!this.authId || !window.Echo) return;
      this.chatChannelName = `chat.${this.authId}`;

      window.Echo.private(this.chatChannelName).listen('MessageSent', async (e) => {
        this.bumpChatOnTop(e.conversation_id, e.message, e.created_at, false);

        if (this.selectedChat && Number(e.conversation_id) === Number(this.selectedChat.conversation_id)) {
          this.messages.push(e);
          this.scrollToBottom();
          await this.markActiveConversationAsRead(e.conversation_id);
          return;
        }

        const exists = this.chats.some((c) => Number(c.conversation_id) === Number(e.conversation_id));
        if (!exists) {
          await this.getMessages();
          return;
        }
        this.chats = this.chats.map((chat) => {
          if (Number(chat.conversation_id) !== Number(e.conversation_id)) return chat;
          return {
            ...chat,
            unread_count: this.chatUnreadCount(chat) + 1,
            has_unread: true,
            is_unread: true,
          };
        });
        this.emitMessageIndicatorUpdate();
      });
    },
    unbindRealtimeChannel() {
      if (!this.chatChannelName || !window.Echo) return;
      window.Echo.leave(`private-${this.chatChannelName}`);
      this.chatChannelName = null;
    },
    updateHeaderOffset() {
      const header = document.querySelector('.header-container');
      if (!header) return;
      this.headerOffset = header.getBoundingClientRect().height;
    }
  },
  async mounted() {
    await this.getAuthId();
    await this.getMessages();
    await this.openFromRouteQuery();
    this.updateHeaderOffset();
    window.addEventListener('resize', this.updateHeaderOffset);
    this.bindRealtimeChannel();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateHeaderOffset);
    this.unbindRealtimeChannel();
  },
};
</script>

<style scoped>
.chat-root {
  background-color: #f0f2f5;
}
.chat-pane {
  min-height: 0;
  overflow: hidden;
}

.chat-bg {
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  background-repeat: repeat;
  background-size: contain;
  min-height: 0;
  overflow: hidden;
}

/* Sidebar Styling */
.conversation-item {
  cursor: pointer;
  border-left: 4px solid transparent;
}
.conversation-item:hover {
  background-color: #f8f9fa;
}
.min-w-0 {
  min-width: 0;
}
.chat-unread-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0 0.38rem;
  border-radius: 999px;
  background: #1d4ed8;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
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
.message-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
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
.messages-area {
  min-height: 0;
  flex: 1 1 0;
  overflow-y: auto;
}
.chat-input {
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .sidebar-mobile { width: 100%; }
}
</style>
