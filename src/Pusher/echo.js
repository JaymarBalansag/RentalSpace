import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

let echo = null

export function initEcho(token) {
  if (echo) return echo

  echo = new Echo({
    broadcaster: import.meta.env.VITE_PUSHER_BROADCASTER,
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: import.meta.env.VITE_API_BROADCAST_URL,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  return echo
}

export function destroyEcho() {
  if (echo) {
    echo.disconnect()
    echo = null
  }
}
