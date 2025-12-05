<template>
  <div>
    <div v-for="m in messages" :key="m.id">
      {{ m.content }}
    </div>

    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>

import echo from "@/Pusher/echo";
import { sendMessage } from "@/api/messages";

export default {
  data() {
    return {
      messages: [],
      receiverId: 1, // example
      newMessage: "",
    };
  },

  mounted() {
    // Listen for incoming messages
    echo.private(`chat.${this.receiverId}`)
      .listen(".message.sent", (e) => {
        this.messages.push(e.message);
      });

    //   console.log(import.meta.env.VITE_PUSHER_APP_KEY);

  },

  methods: {
    async sendMessage() {
      if (!this.newMessage.trim()) return;
        
      try {
        const res = await sendMessage({
          receiver_id: this.receiverId,
          content: this.newMessage,
        });

        this.newMessage = "";
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
  },
};
</script>
