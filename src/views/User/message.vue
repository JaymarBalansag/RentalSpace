<template>
  <div class="container-fluid py-4" style="height: 100vh;">
    <div class="row h-100">
      <!-- Chat Heads -->
      <div class="col-md-4 border-end">
        <div class="d-flex justify-content-center align-content-center mb-3">
            <h5 class="">Messages</h5>
            <router-link to="/" class="btn btn-light btn-sm ms-auto">
                <i class="bi bi-arrow-left"></i>
                Back
            </router-link>
        </div>
        <ul class="list-group me-2">
          <li
            v-for="(chat, index) in chats"
            :key="index"
            class="list-group-item list-group-item-action d-flex align-items-center"
            :class="{ active: selectedChat && selectedChat.id === chat.id }"
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
            
          <!-- Chat Header -->
          <div class="border-bottom py-2 px-3 d-flex align-items-center">
            <div class="profile-circle me-2">
              <i class="bi bi-person text-secondary"></i>
            </div>
            <h6 class="mb-0">{{ selectedChat.name }}</h6>
          </div>

          <!-- Chat Messages -->
          <div class="flex-grow-1 overflow-auto p-3">
            <div
              v-for="(message, idx) in selectedChat.messages"
              :key="idx"
              class="mb-2"
              :class="{ 'text-end': message.from === 'me' }"
            >
              <span
                class="px-3 py-2 rounded-pill"
                :class="message.from === 'me' ? 'bg-primary text-white' : 'bg-light text-dark'"
              >
                {{ message.text }}
              </span>
            </div>
          </div>

          <!-- Input -->
          <div class="border-top p-3">
            <div class="input-group">
              <input
                type="text"
                v-model="newMessage"
                @keyup.enter="sendMessage"
                class="form-control"
                placeholder="Type a message..."
              />
              <button class="btn btn-primary" @click="sendMessage">
                <i class="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- No chat selected -->
        <div v-else class="d-flex justify-content-center align-items-center flex-grow-1">
          <p class="text-muted">Select a chat to start messaging</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessagePage",
  data() {
    return {
      chats: [
        {
          id: 1,
          name: "Maria Santos",
          lastMessage: "See you later!",
          messages: [
            { from: "Maria", text: "Hi Jaymar!" },
            { from: "me", text: "Hello Maria, kamusta?" },
            { from: "Maria", text: "Okay lang! See you later!" }
          ]
        },
        {
          id: 2,
          name: "Juan Dela Cruz",
          lastMessage: "Alright, thanks!",
          messages: [
            { from: "Juan", text: "Bro, available pa ba yung space?" },
            { from: "me", text: "Oo bro, available pa siya." },
            { from: "Juan", text: "Alright, thanks!" }
          ]
        }
      ],
      selectedChat: null,
      newMessage: ""
    };
  },
  methods: {
    selectChat(chat) {
      this.selectedChat = chat;
    },
    sendMessage() {
      if (this.newMessage.trim() && this.selectedChat) {
        this.selectedChat.messages.push({
          from: "me",
          text: this.newMessage
        });
        this.selectedChat.lastMessage = this.newMessage;
        this.newMessage = "";
      }
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
