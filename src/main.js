import './assets/main.css'

import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import {router} from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'


import "leaflet/dist/leaflet.css"
import { createPinia } from 'pinia'
import axios from "axios";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: import.meta.env.VITE_PUSHER_BROADCASTER,
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  encrypted: true,
  authorizer: (channel) => ({
    authorize: (socketId, callback) => {
      const token = localStorage.getItem('access_token');

      axios.post(
        import.meta.env.VITE_API_BROADCAST_URL,
        {
          socket_id: socketId,
          channel_name: channel.name,
        },
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
      .then((response) => callback(false, response.data))
      .catch((error) => callback(true, error));
    },
  }),
});

registerSW({
  immediate: true,
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('rentahub:pwa-offline-ready'));
  },
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('rentahub:pwa-update-ready'));
  },
});

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
