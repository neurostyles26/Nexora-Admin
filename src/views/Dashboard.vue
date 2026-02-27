<script setup>
import { TrendingUp, Users, ShoppingBag, CreditCard, Sparkles, Zap, Globe, Target } from 'lucide-vue-next'

const stats = [
  { name: 'Ventas Totales', value: '$25,400', trend: '+14.2%', icon: CreditCard, color: 'text-emerald-400', detail: 'Sincronizado vía Sheets' },
  { name: 'Comunidad Nexora', value: '1,280', trend: '+22.5%', icon: Users, color: 'text-indigo-400', detail: 'Nivel Plateado' },
  { name: 'Pedidos Activos', value: '84', trend: '+8.1%', icon: ShoppingBag, color: 'text-purple-400', detail: 'Flujo Crítico' },
  { name: 'Tasa de Éxito', value: '98%', trend: '+2.4%', icon: Target, color: 'text-cyan-400', detail: 'IA Optimizada' },
]
</script>

<template>
  <div class="space-y-8 lg:space-y-12 animate-fade-in pb-20">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-4 md:py-8 border-b border-[var(--border-primary)]">
      <div class="space-y-4 md:space-y-6">
        <div class="flex items-center gap-3">
           <div class="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-lg shrink-0">
              <Zap class="w-5 h-5 text-indigo-400" />
           </div>
           <div class="space-y-0.5 min-w-0">
              <h4 class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 truncate">Nexora Command Center</h4>
              <p class="text-[8px] font-bold uppercase tracking-widest truncate" style="color: var(--text-muted);">Protocol v2.1</p>
           </div>
        </div>
        <div class="space-y-2">
           <h1 class="page-title">Vista Global</h1>
           <p class="page-subtitle">
              Monitoreo estratégico del ecosistema empresarial. Gestión de datos en tiempo real.
           </p>
        </div>
      </div>

      <div class="flex items-center gap-4 px-6 py-4 border rounded-2xl shadow-lg self-start lg:self-auto group hover:border-indigo-500/20 transition-all duration-500 shrink-0" style="background: rgba(255,255,255,0.015); border-color: var(--border-primary);">
         <div class="space-y-1 text-right">
            <p class="text-[9px] md:text-[10px] font-black uppercase tracking-widest" style="color: var(--text-muted);">Estado</p>
            <p class="text-xs font-bold text-emerald-400">OPERATIVO</p>
         </div>
         <div class="w-px h-10 bg-[var(--border-primary)]"></div>
         <div class="relative">
            <Globe class="w-6 h-6 text-indigo-500/40 animate-spin-slow" />
         </div>
      </div>
    </div>

    <!-- Stats Matrix -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.name" 
        class="stat-card group h-full flex flex-col justify-between"
      >
        <!-- Ambient glow -->
        <div class="absolute -top-8 -right-8 w-20 h-20 bg-indigo-500/5 blur-[40px] group-hover:bg-indigo-500/10 transition-all duration-700 pointer-events-none"></div>
        
        <div class="flex items-start justify-between relative z-10 w-full mb-5">
          <div class="stat-icon" style="background: rgba(255,255,255,0.04);">
            <component :is="stat.icon" :class="['w-5 h-5 md:w-6 md:h-6 transition-all group-hover:scale-110', stat.color]" />
          </div>
          <div class="flex flex-col items-end gap-1">
             <span :class="['text-[8px] md:text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border', stat.trend.startsWith('+') ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5']">
               {{ stat.trend }}
             </span>
          </div>
        </div>

        <div class="relative z-10 space-y-1.5">
          <p class="stat-label">{{ stat.name }}</p>
          <p class="stat-value group-hover:text-indigo-400 transition-colors">{{ stat.value }}</p>
          <div class="flex items-center gap-2 pt-2 border-t border-[var(--border-primary)]">
             <div class="w-1.5 h-1.5 rounded-full shrink-0" :class="stat.trend.startsWith('+') ? 'bg-emerald-500' : 'bg-rose-500'"></div>
             <p class="text-[8px] font-medium uppercase tracking-wider italic truncate" style="color: var(--text-secondary);">{{ stat.detail }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Analysis Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div class="lg:col-span-2 glass-panel p-6 md:p-10 rounded-3xl border border-[var(--border-primary)] h-[300px] md:h-[400px] flex flex-col justify-between group relative overflow-hidden shadow-xl">
        <div class="w-full flex items-center justify-between border-b border-[var(--border-primary)] pb-5 md:pb-8">
           <div class="min-w-0">
              <h5 class="text-lg md:text-xl font-black tracking-tight italic uppercase truncate" style="color: var(--text-primary);">Flujo de Capital</h5>
              <p class="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] mt-1 italic truncate" style="color: var(--text-muted);">Ventas Estimadas vs Real</p>
           </div>
           <Sparkles class="w-5 h-5 text-indigo-500 opacity-20 shrink-0" />
        </div>
        
        <!-- Chart Bars -->
        <div class="flex-1 w-full flex items-end justify-between gap-1.5 md:gap-3 px-2 py-6">
           <div v-for="h in [40, 70, 45, 90, 65, 80, 55]" :key="h" class="flex-1 rounded-t-lg relative group/bar transition-all hover:bg-indigo-500/20" style="background: rgba(255,255,255,0.04);" :style="{height: h + '%'}">
              <div class="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-lg"></div>
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-1 opacity-0 group-hover/bar:opacity-100 transition-all text-[9px] font-bold text-indigo-400 whitespace-nowrap">${{ h * 124 }}</div>
           </div>
        </div>

        <div class="w-full pt-4 md:pt-6 border-t border-[var(--border-primary)] flex gap-3 md:gap-6">
           <div v-for="i in 3" :key="i" class="flex-1 h-1.5 md:h-2 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.04);">
              <div class="h-full bg-indigo-500/30 rounded-full" :style="{width: (30 + i * 20) + '%'}"></div>
           </div>
        </div>
      </div>

      <div class="glass-panel p-6 md:p-10 rounded-3xl border border-[var(--border-primary)] h-[300px] md:h-[400px] flex flex-col justify-between group shadow-xl overflow-hidden">
         <div class="space-y-3">
            <h5 class="text-lg md:text-xl font-black tracking-tight italic uppercase truncate" style="color: var(--text-primary);">Sincronización</h5>
            <div class="flex items-center gap-2">
               <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <p class="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">Fuentes Activas</p>
            </div>
         </div>
         
          <div class="space-y-2.5 md:space-y-3 py-2 flex-1 overflow-y-auto scrollbar-hide mt-4">
            <div v-for="source in ['Google Sheets', 'Power BI Cloud', 'Supabase Realtime']" :key="source" class="p-3 md:p-4 rounded-xl border hover:border-indigo-500/20 transition-all flex items-center justify-between group/item" style="background: rgba(255,255,255,0.03); border-color: var(--border-primary);">
               <span class="text-[9px] md:text-xs font-bold uppercase tracking-widest group-hover/item:text-[var(--text-primary)] transition-colors truncate" style="color: var(--text-secondary);">{{ source }}</span>
               <div class="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
               </div>
            </div>
          </div>

         <button class="w-full py-3.5 md:py-4 rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] transition-all italic border shadow-lg hover:border-indigo-500/20" style="background: rgba(255,255,255,0.03); border-color: var(--border-primary); color: var(--text-secondary);">
            Optimizar Enlace
         </button>
      </div>
    </div>
  </div>
</template>
