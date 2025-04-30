
<!-- LoginModal.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { loginUser, registerUser } from '@/services/api' // Make sure this exists
import { useRouter } from 'vue-router'

const success = ref('') // Add this at the top with other refs
const email = ref('')
const password = ref('')
const error = ref('')
const isRegister = ref(false) // toggle state for register/login
const userStore = useUserStore()
const router = useRouter()


const emit = defineEmits(['close'])

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  try {
    if (isRegister.value) {
      const user = await registerUser(email.value, password.value)
      if (user) {
        success.value = 'Registered successfully. Please log in.'
        isRegister.value = false
        password.value = '' // Clear password for safety
      } else {
        error.value = 'Registration failed'
      }
    } else {
      const user = await loginUser(email.value, password.value)
      if (user) {
        userStore.setUser(user)
        router.push('/home')
        emit('close')
      } else {
        error.value = 'Invalid email or password'
      }
    }
  } catch (err) {
    error.value = err.message || 'An error occurred. Please try again.'
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})

</script>

<template>
  <div class="modal-overlay" @click="handleClickOutside">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Sign In</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="Enter your email" 
            required
            autofocus
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button @click="handleSubmit" class="login-button">
          {{ isRegister ? 'Register' : 'Sign In' }}
        </button>

        <div class="register-prompt">
          <span>{{ isRegister ? 'Already have an account?' : "Don't have an account?" }}</span>
          <a @click.prevent="isRegister = !isRegister" class="register-link">
            {{ isRegister ? 'Sign In' : 'Register' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0.5rem;
  background-color: cornflowerblue;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
  padding: 0;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 1rem 1.5rem 1.5rem;
  background-color: aliceblue;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-actions {
  margin-top: 1.5rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: var(--primary-hover);
}

.error-message {
  margin: 0.5rem 0;
  color: #e53935;
  font-size: 0.875rem;
}

.additional-options {
  margin-top: 1.5rem;
  text-align: center;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
}

.register-prompt {
  margin-top: 1rem;
  font-size: 0.875rem;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 480px) {
  .modal-container {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }
}
</style>
