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
  broadcaster: 'pusher',
  key: 'e059a322550442df18c2',
  cluster: 'ap1',
  forceTLS: true,
  encrypted: true,
  authEndpoint: "http://localhost:8000/broadcasting/auth",
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
