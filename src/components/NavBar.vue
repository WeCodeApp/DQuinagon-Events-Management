<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const emit = defineEmits(['show-login'])

const handleLogout = () => {
  userStore.clearUser()
  router.push('/')
}

const showLoginModal = () => {
  emit('show-login')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1>Exercise 1: Events Management App</h1>
    </div>
    <div class="navbar-menu">
      <div v-if="userStore.isAuthenticated" class="user-profile">
        <button @click="handleLogout" class="logout-button">Log Out</button>
      </div>
      <div v-else class="auth-links">
        <button @click="showLoginModal" class="login-button">Login</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  margin-top: 0;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color:cornflowerblue;
  width: 100%;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #4a6cf7;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-profile span {
  font-weight: 500;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #e0e0e0;
}

.auth-links {
  display: flex;
  gap: 1rem;
}

.login-button {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid cornflowerblue;
  border-radius: 4px;
  color: #ffffff;
  font-weight: 900;
  font-size: medium;
  cursor: pointer;
}

.register-link {
  padding: 0.5rem 1rem;
  background-color: #4a6cf7;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }
  .navbar-menu {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }
  .nav-links, .user-profile, .auth-links {
    width: 100%;
    justify-content: center;
  }
}
nav{
    margin: 0;
}
</style>