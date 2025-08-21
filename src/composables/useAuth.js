import { ref } from "vue"
import api from "../api/axios" // axios instance

const user = ref(null)

export function useAuth() {
  async function fetchUser() {
    try {
      const { data } = await api.get("/api/user")
      user.value = data
    } catch {
      user.value = null
    }
  }

  function can(requiredRole) {
    return user.value?.role === requiredRole
  }

  return { user, fetchUser, can }
}
