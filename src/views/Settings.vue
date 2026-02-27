<script setup>
import { ref } from 'vue'
import { 
  Building2, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  CreditCard,
  Cloud,
  ChevronRight,
  Sparkles,
  Save
} from 'lucide-vue-next'

const activeTab = ref('business')
const saving = ref(false)

const tabs = [
  { id: 'business', name: 'Negocio', icon: Building2, description: 'Identidad y datos comerciales' },
  { id: 'profile', name: 'Perfil', icon: User, description: 'Gestión de cuenta personal' },
  { id: 'security', name: 'Seguridad', icon: Shield, description: 'Protección y accesos' },
  { id: 'notifications', name: 'Alertas', icon: Bell, description: 'Preferencias de comunicación' },
  { id: 'appearance', name: 'Estética', icon: Palette, description: 'Personalización visual' }
]

const handleSave = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
  }, 1500)
}
</script>

<template>
  <div class="space-y-8 md:space-y-12 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 py-4 md:py-8">
      <div class="space-y-3">
        <div class="flex items-center gap-3">
           <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Sparkles class="w-5 h-5 text-indigo-400" />
           </div>
           <h1 class="page-title">Configuración</h1>
        </div>
        <p class="page-subtitle">
           Control maestro del ecosistema Nexora. Gestiona la identidad de tu marca y las preferencias del núcleo.
        </p>
      </div>

      <button 
        @click="handleSave"
        :disabled="saving"
        class="btn-primary py-3.5 px-8 text-xs font-black tracking-[0.15em] shadow-xl active:scale-95 italic self-start md:self-auto disabled:opacity-50 overflow-hidden relative"
      >
         <div v-if="saving" class="absolute inset-0 bg-indigo-500 flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span class="text-xs">Guardando...</span>
         </div>
         <span v-else class="flex items-center gap-3">
            <Save class="w-4 h-4" />
            Guardar
         </span>
      </button>
    </div>

    <!-- Main Settings -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
      
      <!-- Tab Navigation -->
      <div class="lg:col-span-3 space-y-2 lg:sticky lg:top-6">
         <button 
           v-for="tab in tabs" 
           :key="tab.id"
           @click="activeTab = tab.id"
           :class="[
             'w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden text-left border',
             activeTab === tab.id 
               ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20' 
               : 'border-[var(--border-primary)] hover:border-indigo-500/20'
           ]"
           :style="activeTab !== tab.id ? 'background: var(--bg-secondary); color: var(--text-secondary);' : ''"
         >
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0', activeTab === tab.id ? 'bg-white/20' : 'bg-[var(--border-primary)]']">
               <component :is="tab.icon" class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
               <p class="text-[11px] font-bold uppercase tracking-wider leading-none mb-0.5 truncate">{{ tab.name }}</p>
               <p :class="['text-[9px] font-medium opacity-60 leading-tight truncate', activeTab === tab.id ? 'text-white' : '']" :style="activeTab !== tab.id ? 'color: var(--text-muted);' : ''">
                  {{ tab.description }}
               </p>
            </div>
            <ChevronRight v-if="activeTab === tab.id" class="w-3.5 h-3.5 opacity-40 shrink-0" />
         </button>

         <!-- Network Card -->
         <div class="mt-6 p-6 glass-panel border border-[var(--border-primary)] rounded-2xl bg-indigo-500/5 relative overflow-hidden hidden lg:block">
            <div class="relative z-10 space-y-4">
               <div class="flex items-center gap-2">
                  <Cloud class="w-4 h-4 text-indigo-400" />
                  <p class="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400">Estado de Red</p>
               </div>
               <div class="space-y-3">
                  <div class="flex justify-between items-end">
                     <p class="text-[10px] font-medium uppercase tracking-widest" style="color: var(--text-secondary);">Sync</p>
                     <p class="text-xs font-bold text-emerald-400 italic">OK</p>
                  </div>
                  <div class="h-1 w-full rounded-full overflow-hidden" style="background: rgba(255,255,255,0.05);">
                     <div class="h-full w-[94%] bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Content Panels -->
      <div class="lg:col-span-9">
         
         <!-- BUSINESS PANEL -->
         <transition name="slide-fade" mode="out-in">
           <div v-if="activeTab === 'business'" class="glass-panel p-6 md:p-10 rounded-3xl border border-[var(--border-primary)] shadow-xl space-y-10">
              
              <div class="space-y-6">
                 <div class="flex items-center gap-4">
                    <h3 class="text-xl md:text-2xl font-black tracking-tight italic uppercase" style="color: var(--text-primary);">Identidad de Marca</h3>
                    <div class="h-px flex-1 bg-[var(--border-primary)]"></div>
                 </div>

                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="group space-y-2">
                       <label class="text-[10px] font-bold uppercase tracking-[0.3em] ml-2 transition-colors group-focus-within:text-indigo-400" style="color: var(--text-muted);">Nombre del Negocio</label>
                       <div class="relative">
                          <Building2 class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" style="color: var(--text-muted);" />
                          <input type="text" value="Nexora Premium Store" class="w-full border rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/40 transition-all" style="background: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary);" />
                       </div>
                    </div>

                    <div class="group space-y-2">
                       <label class="text-[10px] font-bold uppercase tracking-[0.3em] ml-2 transition-colors group-focus-within:text-indigo-400" style="color: var(--text-muted);">Identificador Fiscal</label>
                       <div class="relative">
                          <CreditCard class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" style="color: var(--text-muted);" />
                          <input type="text" value="NXR-MASTER-2026-X" class="w-full border rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/40 transition-all" style="background: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary);" />
                       </div>
                    </div>
                 </div>
              </div>

              <div class="space-y-6 pt-6 border-t border-[var(--border-primary)]">
                 <div class="flex items-center gap-4">
                    <h3 class="text-xl md:text-2xl font-black tracking-tight italic uppercase" style="color: var(--text-primary);">Geolocalización</h3>
                    <div class="h-px flex-1 bg-[var(--border-primary)]"></div>
                 </div>

                 <div class="space-y-2 group">
                    <label class="text-[10px] font-bold uppercase tracking-[0.3em] ml-2" style="color: var(--text-muted);">Dirección Principal</label>
                    <textarea rows="3" class="w-full border rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/40 transition-all resize-none" style="background: var(--bg-secondary); border-color: var(--border-primary); color: var(--text-primary);">Av. Principal de Innovación, Edificio Nexora, Piso 42</textarea>
                 </div>
              </div>

              <!-- Plan Card -->
              <div class="p-6 md:p-8 rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div class="space-y-1.5 text-center md:text-left min-w-0">
                    <h4 class="text-lg font-black text-white italic uppercase truncate">Plan Nexora</h4>
                    <p class="text-xs font-medium text-white/70 truncate">Suscripción: <span class="text-white font-bold">Corporativo Pro</span></p>
                 </div>
                 <button class="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shrink-0 whitespace-nowrap">
                    GESTIONAR LICENCIA
                 </button>
              </div>
           </div>

           <!-- PLACEHOLDER PANELS -->
           <div v-else class="glass-panel p-12 md:p-16 rounded-3xl border border-[var(--border-primary)] shadow-xl flex flex-col items-center justify-center text-center space-y-6 group" style="background: var(--bg-secondary);">
              <div class="w-20 h-20 rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-transform" style="background: rgba(255,255,255,0.04); border-color: var(--border-primary);">
                 <component :is="tabs.find(t => t.id === activeTab)?.icon" class="w-8 h-8 group-hover:text-indigo-400 transition-colors" style="color: var(--text-muted);" />
              </div>
              <div class="space-y-3">
                 <h3 class="text-2xl md:text-3xl font-black tracking-tighter italic uppercase" style="color: var(--text-primary);">{{ tabs.find(t => t.id === activeTab)?.name }}</h3>
                 <p class="text-sm font-medium max-w-sm mx-auto leading-relaxed" style="color: var(--text-muted);">
                    Este módulo está siendo optimizado para la red v2.1. Disponible próximamente.
                 </p>
              </div>
              <div class="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                 <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                 <span class="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">En desarrollo</span>
              </div>
           </div>
         </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from {
  transform: translateY(12px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
