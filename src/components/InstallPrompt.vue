<script setup>
import { ref, onMounted } from 'vue'
import { Download, X, Smartphone } from 'lucide-vue-next'

const showPrompt = ref(false)
const deferredPrompt = ref(null)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default browser prompt
    e.preventDefault()
    // Stash the event
    deferredPrompt.value = e
    // Show our custom UI
    showPrompt.value = true
  })

  // Also show after a delay if they haven't seen it recently
  // (Optional logic could go here)
})

const installApp = async () => {
  if (!deferredPrompt.value) return
  
  // Show the install prompt
  deferredPrompt.value.prompt()
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice
  
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt')
  } else {
    console.log('User dismissed the install prompt')
  }
  
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt.value = null
  showPrompt.value = false
}

const closePrompt = () => {
  showPrompt.value = false
}
</script>

<template>
  <transition name="slide-up">
    <div v-if="showPrompt" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
      <div class="glass-panel p-6 rounded-[2rem] border border-indigo-500/30 shadow-[0_30px_100px_-20px_rgba(99,102,241,0.5)] overflow-hidden relative">
        <!-- Decoration -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div class="flex items-center gap-5 relative z-10">
          <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
             <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Smartphone class="w-7 h-7 text-white" />
             </div>
          </div>
          
          <div class="flex-1">
            <h4 class="text-lg font-black text-white leading-tight">Instalar Nexora Admin</h4>
            <p class="text-[11px] text-slate-400 font-medium mt-1">Acceso instantáneo desde tu pantalla de inicio con rendimiento nativo.</p>
          </div>
          
          <button @click="closePrompt" class="p-2 hover:bg-white/5 rounded-full transition-colors self-start">
            <X class="w-4 h-4 text-slate-500" />
          </button>
        </div>
        
        <div class="mt-6 flex gap-3 relative z-10">
          <button @click="installApp" class="flex-1 btn-primary py-3 px-0 justify-center text-xs tracking-widest font-black uppercase">
            <Download class="w-4 h-4" /> INSTALAR AHORA
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100%) scale(0.9);
  opacity: 0;
}
</style>
