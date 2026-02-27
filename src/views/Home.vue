<script setup>
import { ArrowRight, Menu, X, FileText, LayoutDashboard, Globe, Lock, Cpu } from 'lucide-vue-next'
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen text-slate-300 overflow-x-hidden selection:bg-indigo-500/30 font-sans">
    <!-- Mesh Background -->
    <div class="mesh-gradient"></div>
    
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 lg:px-20">
      <div class="max-w-7xl mx-auto flex items-center justify-between glass-panel px-5 py-2.5 rounded-2xl border border-white/10 shadow-xl">
        <!-- Brand -->
        <router-link to="/" class="flex items-center group">
          <div class="bg-white p-1.5 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
             <img src="/Logo-Global-Nexora.png" alt="Nexora" class="h-6 md:h-7" />
          </div>
        </router-link>
        
        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-6 lg:gap-10">
          <router-link to="/login" class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-white transition-all">
            <FileText class="w-3.5 h-3.5 opacity-50" />
            Docs
          </router-link>
          
          <router-link to="/login" class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-xl font-bold text-xs text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all uppercase tracking-[0.15em]">
            <LayoutDashboard class="w-3.5 h-3.5" />
            Acceder
          </router-link>
        </div>

        <!-- Mobile Toggle -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 text-white/70 hover:text-white transition-colors">
          <component :is="isMobileMenuOpen ? X : Menu" class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition name="mobile-fade">
        <div v-if="isMobileMenuOpen" class="fixed inset-0 top-16 z-40 md:hidden bg-[#020617]/98 backdrop-blur-3xl p-6 border-t border-white/5">
          <div class="flex flex-col gap-6">
            <router-link @click="isMobileMenuOpen = false" to="/login" class="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-white py-5 border-b border-white/5">
              <FileText class="w-4 h-4 text-indigo-400" />
              Documentación
            </router-link>
            <router-link @click="isMobileMenuOpen = false" to="/login" class="btn-primary justify-center py-5 text-sm tracking-[0.3em]">
              ACCEDER AL NÚCLEO
            </router-link>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-6 md:px-12 lg:px-20 relative overflow-hidden">
      <!-- Ambient Glows -->
      <div class="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none animate-float"></div>
      <div class="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none animate-float-delayed"></div>
      
      <div class="max-w-5xl mx-auto text-center relative z-10 w-full">
        <!-- Badge -->
        <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 text-indigo-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-10 animate-fade-in shadow-lg backdrop-blur-md">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          SISTEMA DE GESTIÓN EMPRESARIAL
        </div>
        
        <!-- Title -->
        <div class="mb-10 md:mb-14">
          <h1 class="font-black leading-[0.9] tracking-tighter flex flex-col items-center">
            <span class="text-fluid-large text-white filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">NEXORA</span>
            <span class="text-fluid-medium text-accent-gradient drop-shadow-lg opacity-90 italic">ADMIN</span>
          </h1>
          
          <div class="h-0.5 w-20 bg-gradient-to-r from-transparent via-indigo-600 to-transparent mx-auto mt-8 md:mt-10 opacity-50"></div>
          
          <p class="max-w-2xl mx-auto text-fluid-p font-medium text-slate-400 italic tracking-wide leading-relaxed mt-8 px-4 md:px-0 opacity-80">
            El núcleo inteligente que conecta tu negocio en tiempo real.
          </p>
        </div>
        
        <!-- CTA -->
        <div class="flex flex-col items-center gap-10 mt-10 md:mt-14">
          <router-link to="/login" class="btn-primary group py-5 px-12 text-white text-base md:text-lg w-full sm:w-auto shadow-[0_16px_48px_-12px_rgba(79,70,229,0.4)]">
            CONECTAR AHORA <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
          </router-link>
          
          <!-- Trust signals -->
          <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-30 hover:opacity-100 transition-opacity duration-700">
             <div class="flex items-center gap-2 group cursor-pointer">
                <Globe class="w-3.5 h-3.5 text-indigo-400" /> 
                <span class="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Global</span>
             </div>
             <div class="flex items-center gap-2 group cursor-pointer">
                <Lock class="w-3.5 h-3.5 text-indigo-400" /> 
                <span class="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Seguro</span>
             </div>
             <div class="flex items-center gap-2 group cursor-pointer">
                <Cpu class="w-3.5 h-3.5 text-indigo-400" /> 
                <span class="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Real-time</span>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 md:py-16 px-6 relative bg-[#020617]/80 backdrop-blur-md border-t border-white/5">
       <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex flex-col items-center md:items-start gap-3">
             <div class="bg-white p-1.5 rounded-lg">
                <img src="/Logo-Global-Nexora.png" alt="Nexora" class="h-5" />
             </div>
             <p class="text-[10px] font-bold uppercase tracking-[0.3em]" style="color: var(--text-muted);">Powered by Nexora Core</p>
          </div>
          
          <div class="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
             <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Systems Operational</span>
          </div>

          <div class="flex gap-6 text-[10px] font-bold uppercase tracking-[0.15em]" style="color: var(--text-muted);">
             <a href="#" class="hover:text-white transition-colors">Legal</a>
             <a href="#" class="hover:text-white transition-colors">Privacy</a>
             <a href="#" class="hover:text-white transition-colors">Contact</a>
          </div>
       </div>
    </footer>
  </div>
</template>

<style scoped>
.text-fluid-large {
  font-size: clamp(3.5rem, 14vw, 10rem);
}

.text-fluid-medium {
  font-size: clamp(1.8rem, 7vw, 5.5rem);
}

.text-fluid-p {
  font-size: clamp(0.95rem, 2vw, 1.35rem);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 12s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

.mobile-fade-enter-active,
.mobile-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.mobile-fade-enter-from,
.mobile-fade-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
