<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Sparkles, 
  Zap, 
  Globe, 
  Target,
  BookOpen,
  ArrowRight,
  X,
  Info,
  UserPlus,
  Check,
  ShieldAlert
} from 'lucide-vue-next'
import { supabase } from '../services/supabase'

const router = useRouter()
const authStore = useAuthStore()
const showWelcomePopup = ref(false)
const pendingUsers = ref([])

const stats = [
  { name: 'Ventas Totales', value: '$12,845', trend: '+12.5%', icon: ShoppingBag, color: 'text-emerald-400', detail: 'Mes Actual' },
  { name: 'Usuarios Activos', value: '1,240', trend: '+5.2%', icon: Users, color: 'text-indigo-400', detail: 'Últimas 24h' },
  { name: 'Conversión', value: '3.8%', trend: '-1.4%', icon: TrendingUp, color: 'text-rose-400', detail: 'Global' },
  { name: 'Tasa de Éxito', value: '98%', trend: '+2.4%', icon: Target, color: 'text-cyan-400', detail: 'IA Optimizada' },
]

onMounted(async () => {
  const hasSeenPopup = localStorage.getItem('nexora_welcome_doc_seen')
  if (!hasSeenPopup) {
    showWelcomePopup.value = true
  }
  
  await fetchPendingUsers()
})

const fetchPendingUsers = async () => {
  const { data } = await supabase.from('users').select('*').eq('is_verified', false)
  pendingUsers.value = data || []
}

const verifyUser = async (userId) => {
  const { error } = await supabase.from('users').update({ is_verified: true }).eq('id', userId)
  if (!error) {
    await fetchPendingUsers()
  }
}

const closePopup = () => {
  showWelcomePopup.value = false
  localStorage.setItem('nexora_welcome_doc_seen', 'true')
}

const goToDocs = () => {
  showWelcomePopup.value = false
  localStorage.setItem('nexora_welcome_doc_seen', 'true')
  router.push('/integrations')
}
</script>

<template>
  <div class="space-y-8 lg:space-y-12 animate-fade-in pb-20">
    <!-- Founder Console Welcome -->
    <div v-if="authStore.user?.is_system_admin" class="animate-slide-up relative overflow-hidden rounded-3xl p-8 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 mb-12" style="background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1));">
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40">
              <span class="text-[9px] font-black text-indigo-300 uppercase tracking-[0.3em]">Acceso Primordial</span>
            </div>
            <Sparkles class="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h2 class="text-3xl font-black italic uppercase tracking-tighter text-white">Consola de Fundador</h2>
            <p class="text-sm italic text-slate-400 mt-1">Soberanía total sobre el ecosistema Nexora.</p>
          </div>
        </div>
        <div class="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-sm">
           <div class="space-y-1">
              <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estado del Núcleo</p>
              <p class="text-xs font-black text-emerald-400 italic">ACTIVO & SINCRONIZADO</p>
           </div>
           <div class="w-px h-8 bg-white/10"></div>
           <Shield class="w-6 h-6 text-indigo-400/50" />
        </div>
      </div>
    </div>

    <!-- Pending Verifications (For Super Admin) -->
    <div v-if="authStore.user?.is_system_admin && pendingUsers.length > 0" class="animate-slide-up space-y-6">
      <div class="flex items-center gap-3">
        <ShieldAlert class="w-5 h-5 text-indigo-400" />
        <h4 class="text-[10px] font-bold uppercase tracking-[0.4em]" style="color: var(--text-muted);">Verificaciones Pendientes</h4>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="user in pendingUsers" :key="user.id" class="stat-card p-6 flex flex-col gap-6 border-indigo-500/20">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <UserPlus class="w-6 h-6 text-indigo-400" />
            </div>
            <div class="space-y-1">
              <p class="text-sm font-black italic uppercase text-white">{{ user.full_name }}</p>
              <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500">{{ user.id.substring(0, 8) }}...</p>
            </div>
          </div>
          <button 
            @click="verifyUser(user.id)"
            class="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-[9px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            <Check class="w-3.5 h-3.5" /> VERIFICAR ACCESO
          </button>
        </div>
      </div>
    </div>

    <!-- Welcome documentation popup -->
    <div v-if="showWelcomePopup" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div class="max-w-md w-full glass-panel border border-indigo-500/30 rounded-3xl p-8 space-y-6 shadow-3xl animate-slide-up relative">
        <button @click="closePopup" class="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors group">
          <X class="w-5 h-5 text-slate-400 group-hover:rotate-90 transition-transform" />
        </button>
        
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <BookOpen class="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h3 class="text-xl font-black italic uppercase tracking-tighter text-white">¡Bienvenido!</h3>
            <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Aviso de Configuración</p>
          </div>
        </div>
        
        <div class="space-y-4">
          <p class="text-sm text-slate-300 leading-relaxed italic">
            Revisa la <span class="text-indigo-400 font-bold">documentación paso a paso</span> para aprender cómo agregar <span class="text-yellow-400 font-bold">Power BI</span> y tus bases de datos al panel operativo.
          </p>
          
          <div class="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex gap-3">
            <Info class="w-5 h-5 text-indigo-400 shrink-0" />
            <p class="text-[10px] text-slate-400 uppercase tracking-wider leading-relaxed">Configura el ecosistema digital de Nexora correctamente siguiendo la guía integrada.</p>
          </div>
        </div>
        
        <div class="flex flex-col gap-3">
          <button @click="goToDocs" class="btn-primary py-4 px-6 text-xs font-black italic uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-indigo-500/20">
            Ir a la Documentación
            <ArrowRight class="w-4 h-4" />
          </button>
          <button @click="closePopup" class="py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors italic">
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>

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
