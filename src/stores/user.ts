import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isAuthenticated = ref(false)
  const userId = ref<number | null>(null)
  const name = ref('')
  const email = ref('')

  function setUser(user: { id: number; name: string; email: string }) {
    isAuthenticated.value = true
    userId.value = user.id
    name.value = user.name
    email.value = user.email
  }

  function clearUser() {
    isAuthenticated.value = false
    userId.value = null
    name.value = ''
    email.value = ''
  }

  return { isAuthenticated, userId, name, email, setUser, clearUser }
})
