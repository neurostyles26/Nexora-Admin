<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Preloader from './components/Preloader.vue'
import InstallPrompt from './components/InstallPrompt.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
  await authStore.checkVolatileSession()
})
</script>

<template>
  <div class="nexora-app min-h-screen text-slate-200">
    <Preloader />
    <InstallPrompt />
    
    <router-view v-slot="{ Component }">
      <transition 
        name="fade" 
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- Toast Notifications Placeholder -->
    <div id="notifications" class="fixed bottom-4 right-4 z-50"></div>
  </div>
</template>


<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
