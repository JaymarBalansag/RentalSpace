<template>
  <div class="container-fluid py-4" style="height: 100vh;">
    <div class="row h-100">

      <!-- Chat Heads -->
      <div class="col-md-4 border-end">
        <div class="d-flex justify-content-center align-content-center mb-3">
          <h5>Messages</h5>
        </div>

        <ul class="list-group me-2">
          <li
            v-for="chat in chats"
            :key="chat.user_id"
            class="list-group-item list-group-item-action d-flex align-items-center"
            :class="{ active: selectedChat && selectedChat.user_id === chat.user_id }"
            @click="selectChat(chat)"
            style="cursor: pointer;"
          >
            <div class="profile-circle me-3">
              <i class="bi bi-person text-secondary"></i>
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
              <i class="bi bi-person text-secondary"></i>
            </div>
            <h6 class="mb-0">{{ selectedChat.name }}</h6>
          </div>

          <!-- Messages -->
          <div class="flex-grow-1 overflow-auto p-3">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="mb-2"
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
export default {
  data() {
    return {
      authId: 1, // your id
      chats: [
        {
          user_id: 5,
          name: "Test User",
          lastMessage: "Hey, this is a starter message",
        }
      ],
      selectedChat: null,
      messages: [
        // starter message for testing
        { sender_id: 1, receiver_id: 5, message: "Hello! This is a starter message." },
        { sender_id: 5, receiver_id: 1, message: "Hi! Got your message." },
      ],
      newMessage: ""
    };
  },
  methods: {
    selectChat(chat) {
      this.selectedChat = chat;

      // For testing, we keep the starter messages
      // In real scenario, fetch messages from backend
    },
    sendMessage() {
      if (!this.newMessage.trim() || !this.selectedChat) return;

      // Add message to chat
      this.messages.push({
        sender_id: this.authId,
        receiver_id: this.selectedChat.user_id,
        message: this.newMessage
      });

      this.selectedChat.lastMessage = this.newMessage;
      this.newMessage = "";
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
