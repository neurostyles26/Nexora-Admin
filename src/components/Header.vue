<script setup>
import { ref, onMounted } from 'vue'
import { Search, Bell, User, Sun, Moon, Menu, X } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { useLayoutStore } from '../stores/layout'

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const isDark = ref(true)
const isSearchOpen = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (!isDark.value) {
    document.documentElement.classList.add('light-mode')
    localStorage.setItem('nexora-theme', 'light')
  } else {
    document.documentElement.classList.remove('light-mode')
    localStorage.setItem('nexora-theme', 'dark')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('nexora-theme')
  if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light-mode')
  }
})
</script>

<template>
  <header class="h-16 lg:h-[72px] glass-panel border-b border-[var(--border-primary)] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-[100] transition-all duration-500">
    <!-- Mobile Menu Toggle -->
    <button 
      @click="layoutStore.toggleMobileMenu"
      class="lg:hidden p-2.5 rounded-xl transition-all active:scale-95 hover:bg-[var(--border-primary)]"
      style="color: var(--text-muted);"
    >
      <Menu v-if="!layoutStore.isMobileMenuOpen" class="w-5 h-5" />
      <X v-else class="w-5 h-5" />
    </button>

    <div class="flex items-center gap-4 flex-1 ml-3 lg:ml-0 overflow-hidden lg:overflow-visible">
      <!-- Search -->
      <div 
        :class="[
          'relative max-w-md w-full group transition-all duration-500',
          isSearchOpen ? 'fixed inset-x-0 top-0 h-16 bg-[var(--bg-primary)] z-[110] px-4 flex items-center max-w-none' : 'hidden md:block'
        ]"
      >
        <Search class="absolute left-8 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" style="color: var(--text-muted);" />
        <input 
          type="text" 
          placeholder="Buscar..." 
          class="relative w-full bg-[var(--border-secondary)] border border-[var(--border-primary)] rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-indigo-500/40 text-sm transition-all placeholder:text-[var(--text-muted)] font-medium"
          style="color: var(--text-primary);"
          @blur="isSearchOpen = false"
        />
        <button 
          v-if="isSearchOpen" 
          @click="isSearchOpen = false"
          class="ml-3 p-2" style="color: var(--text-muted);"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Mobile Search Trigger -->
      <button 
        class="md:hidden p-2 transition-all"
        style="color: var(--text-muted);"
        @click="isSearchOpen = true"
      >
        <Search class="w-5 h-5" />
      </button>
    </div>

    <div class="flex items-center gap-2 lg:gap-4">
      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme" 
        class="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group overflow-hidden relative border border-[var(--border-primary)]"
        style="background: var(--glass-bg);"
        :title="isDark ? 'Modo Claro' : 'Modo Oscuro'"
      >
        <transition name="rotate-fade" mode="out-in">
          <Sun v-if="isDark" class="w-4 h-4 text-amber-400 relative z-10" />
          <Moon v-else class="w-4 h-4 text-indigo-400 relative z-10" />
        </transition>
      </button>

      <!-- Notifications -->
      <button class="relative hover:text-indigo-400 transition group p-2 hidden sm:block" style="color: var(--text-muted);">
        <Bell class="w-5 h-5 group-hover:scale-105 transition-all duration-300" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 shadow-[0_0_6px_rgba(244,63,94,0.4)]" style="border-color: var(--bg-primary);"></span>
      </button>
      
      <!-- Profile -->
      <div class="flex items-center gap-3 pl-3 lg:pl-6 border-l" style="border-color: var(--border-primary);">
        <div class="text-right hidden lg:block space-y-0.5 max-w-[120px]">
          <p class="text-[10px] font-black italic tracking-tight uppercase truncate" style="color: var(--text-primary);">{{ authStore.user?.email?.split('@')[0] }}</p>
          <p class="text-[8px] font-bold uppercase tracking-[0.2em] opacity-80" style="color: var(--text-muted);">Admin</p>
        </div>
        <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-lg group cursor-pointer hover:scale-105 transition-all duration-300 shrink-0">
          <User class="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.rotate-fade-enter-active,
.rotate-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.rotate-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.rotate-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
</style>
