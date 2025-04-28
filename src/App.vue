<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import LoginModal from './components/Login.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const showLoginModal = ref(false)

const toggleLoginModal = () => {
  showLoginModal.value = !showLoginModal.value
}
</script>

<template>
  <header class="app-header">
    <NavBar @show-login="toggleLoginModal" />
  </header>
<br/>
  <main class="app-content">
    <RouterView />
  </main>

  <LoginModal
    v-if="showLoginModal"
    @close="toggleLoginModal"
  />
</template>

<style>
/* Global styles */
:root {
  --primary-color: #4a6cf7;
  --primary-hover: #3a5ce5;
  --text-color: #333;
  --light-gray: #f5f5f5;
  --border-color: #ddd;
}

.app-content {
  max-width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .app-content {
    margin: 1rem auto;
  }
}
</style>
