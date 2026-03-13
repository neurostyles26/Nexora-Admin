<script setup>
import { onMounted, ref } from 'vue'

const loading = ref(true)
const startExit = ref(false)

onMounted(() => {
  setTimeout(() => {
    startExit.value = true
    setTimeout(() => {
      loading.value = false
    }, 1500)
  }, 3500) // Slightly longer for more "weight"
})
</script>

<template>
  <Transition name="cx-preloader">
    <div v-if="loading" class="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
      <!-- Background Mesh Pulse -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] animate-pulse-slow"></div>
      
      <div class="relative flex flex-col items-center">
        <!-- Main Logo Container -->
        <div class="relative w-64 h-64 flex items-center justify-center group" :class="{ 'cx-exit': startExit }">
          
          <!-- Outer Cinematic Rings -->
          <div class="absolute inset-0 border-[1px] border-indigo-500/20 rounded-full"></div>
          <div class="absolute inset-[-20px] border-[1px] border-indigo-500/10 rounded-full animate-ping-slow"></div>
          <div class="absolute inset-[-40px] border-[1px] border-indigo-500/5 rounded-full animate-pulse-slow"></div>
          
          <!-- Animated Progress Mask Path -->
          <svg class="absolute inset-0 w-full h-full rotate-[-90deg] drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <circle 
              cx="128" cy="128" r="124" 
              fill="none" 
              stroke="url(#preloaderGrad)" 
              stroke-width="4" 
              stroke-dasharray="780"
              stroke-dashoffset="780"
              class="animate-draw-sync"
            />
            <defs>
              <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>

          <!-- Logo Badge Reveal -->
          <div class="logo-box-reveal shadow-[0_0_50px_rgba(99,102,241,0.3)]">
             <img src="/Logo-Global-Nexora.png" alt="Nexora" class="w-32 h-32 object-contain" />
          </div>
          
          <!-- Cinematic Shimmer -->
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 animate-shimmer-fast"></div>
        </div>

        <!-- Professional Text Reveal -->
        <div class="mt-14 space-y-4">
          <div class="overflow-hidden">
            <h2 class="text-4xl font-black tracking-[0.6em] text-white uppercase text-reveal-up" style="font-family: 'Montserrat', sans-serif;">
              NEXORA
            </h2>
          </div>
          <div class="h-[2px] w-0 bg-gradient-to-r from-transparent via-indigo-600 to-transparent mx-auto line-expansion"></div>
          <p class="text-[10px] font-black tracking-[0.6em] text-indigo-400 uppercase opacity-reveal-delayed">
            Sincronizando Sistema
          </p>
        </div>
      </div>
      
      <!-- Loading Dots -->
      <div class="absolute bottom-16 flex gap-3">
        <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping-slow {
  animation: ping 4s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes draw-sync {
  to { stroke-dashoffset: 0; }
}

.animate-draw-sync {
  animation: draw-sync 2.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.animate-shimmer-fast {
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-200%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(45deg); }
}

/* Logo Reveal */
.logo-box-reveal {
  background: white;
  padding: 16px;
  border-radius: 32px;
  animation: popIn 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  transform: scale(0.4) translateY(40px);
}

@keyframes popIn {
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.text-reveal-up {
  animation: slideInUp 1s cubic-bezier(0.23, 1, 0.32, 1) 0.8s forwards;
  opacity: 0;
  transform: translateY(100%);
}

@keyframes slideInUp {
  to { opacity: 1; transform: translateY(0); }
}

.line-expansion {
  animation: expandW 1.2s cubic-bezier(0.65, 0, 0.35, 1) 1.2s forwards;
}

@keyframes expandW {
  to { width: 100%; }
}

.opacity-reveal-delayed {
  animation: fadeI 0.8s ease-out 1.8s forwards;
  opacity: 0;
}

@keyframes fadeI {
  to { opacity: 1; }
}

/* Cinematic Exit */
.cx-exit {
  animation: cinematicExit 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
}

@keyframes cinematicExit {
  to { transform: scale(0.9) translateY(-20px); opacity: 0; filter: blur(30px); }
}

.cx-preloader-leave-active {
  transition: all 1.2s cubic-bezier(0.7, 0, 0.3, 1);
}

.cx-preloader-leave-to {
  opacity: 0;
  backdrop-filter: blur(50px);
}
</style>
