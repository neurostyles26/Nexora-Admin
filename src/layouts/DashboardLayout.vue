<script setup>
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { useLayoutStore } from '../stores/layout'

const layoutStore = useLayoutStore()
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500 font-sans">
    <!-- Dynamic Background Layer -->
    <div class="mesh-gradient opacity-40"></div>
    
    <Sidebar />
    
    <main 
      :class="[
        'flex-1 flex flex-col relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]'
      ]"
    >
      <Header />
      
      <!-- Content Area -->
      <div class="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
        <div class="max-w-[1600px] mx-auto pb-20">
           <router-view v-slot="{ Component }">
             <transition name="page-fade" mode="out-in">
               <component :is="Component" />
             </transition>
           </router-view>
        </div>
      </div>

      <!-- Footer -->
      <footer class="h-10 border-t border-[var(--border-primary)] flex items-center justify-between px-4 sm:px-6 lg:px-10 text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] bg-[var(--bg-secondary)]/50 backdrop-blur-md relative z-10 overflow-hidden" style="color: var(--text-muted);">
        <span class="truncate">&copy; 2026 Nexora Admin</span>
        <div class="hidden sm:flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Servidor Activo</span>
          </div>
          <span class="opacity-30">|</span>
          <span>24ms</span>
        </div>
      </footer>
    </main>
  </div>
</template>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.01);
}
</style>
