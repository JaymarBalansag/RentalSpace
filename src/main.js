import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'


import "leaflet/dist/leaflet.css"
import { createPinia } from 'pinia'

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: import.meta.env.VITE_PUSHER_BROADCASTER,
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  encrypted: true,
  authEndpoint: import.meta.env.VITE_API_BROADCAST_URL,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    }
  },
});

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
