<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../services/supabase'
import { 
  TicketPercent, 
  Plus, 
  Calendar, 
  Tag, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Globe
} from 'lucide-vue-next'

const promotions = ref([])
const loading = ref(true)
const showModal = ref(false)

const newPromo = ref({
  title: '',
  description: '',
  discount_percent: 0,
  plan_tier: 'basic',
  status: 'active',
  expires_at: ''
})

onMounted(async () => {
  await fetchPromotions()
})

const fetchPromotions = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false })
    if (error) throw error
    promotions.value = data
  } catch (err) {
    console.error('Error fetching promotions:', err)
  } finally {
    loading.value = false
  }
}

const createPromotion = async () => {
  try {
    const { error } = await supabase.from('promotions').insert([newPromo.value])
    if (error) throw error
    showModal.value = false
    await fetchPromotions()
    newPromo.value = { title: '', description: '', discount_percent: 0, plan_tier: 'basic', status: 'active', expires_at: '' }
  } catch (err) {
    console.error('Error creating promotion:', err)
  }
}

const deletePromotion = async (id) => {
  if (!confirm('¿Eliminar esta promoción?')) return
  try {
    const { error } = await supabase.from('promotions').delete().eq('id', id)
    if (error) throw error
    await fetchPromotions()
  } catch (err) {
    console.error('Error deleting promotion:', err)
  }
}
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-4 md:py-8">
      <div class="space-y-3">
        <h1 class="page-title">Planes y Promociones</h1>
        <p class="page-subtitle">Gestiona las ofertas estratégicas del ecosistema Nexora.</p>
      </div>
      
      <button 
        @click="showModal = true"
        class="btn-primary px-8 py-3.5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] italic shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
      >
        <Plus class="w-4 h-4" /> Nueva Oferta
      </button>
    </div>

    <!-- Promotions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="loading" v-for="i in 3" :key="i" class="stat-card p-10 flex flex-col items-center justify-center gap-4 animate-pulse">
        <div class="w-16 h-16 bg-white/5 rounded-2xl"></div>
        <div class="h-4 bg-white/5 rounded w-3/4"></div>
      </div>
      
      <div 
        v-else 
        v-for="promo in promotions" 
        :key="promo.id"
        class="stat-card p-0 flex flex-col group overflow-hidden border-indigo-500/20 shadow-2xl"
      >
        <div class="p-8 space-y-6 relative overflow-hidden">
          <!-- Promo Header -->
          <div class="flex items-start justify-between relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <Zap v-if="promo.plan_tier === 'premium'" class="w-6 h-6 text-indigo-400" />
              <Globe v-else-if="promo.plan_tier === 'enterprise'" class="w-6 h-6 text-purple-400" />
              <Sparkles v-else class="w-6 h-6 text-emerald-400" />
            </div>
            <div :class="['px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-[0.2em]', promo.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400']">
              {{ promo.status }}
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="text-xl font-black italic uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">{{ promo.title }}</h3>
            <p class="text-xs font-medium text-slate-500 leading-relaxed truncate">{{ promo.description }}</p>
          </div>

          <div class="flex items-center justify-between pt-6 border-t border-[var(--border-primary)]">
            <div class="space-y-1">
              <p class="text-[9px] font-black uppercase tracking-widest text-slate-500">Descuento</p>
              <p class="text-2xl font-black text-indigo-400 italic">{{ promo.discount_percent }}%</p>
            </div>
            <div class="text-right space-y-1">
               <p class="text-[9px] font-black uppercase tracking-widest text-slate-500">Plan Nivel</p>
               <p class="text-[10px] font-bold text-white uppercase tracking-widest">{{ promo.plan_tier }}</p>
            </div>
          </div>
        </div>

        <button 
          @click="deletePromotion(promo.id)"
          class="w-full py-4 bg-rose-500/10 border-t border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98]"
        >
          Retirar Oferta
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && promotions.length === 0" class="stat-card p-20 flex flex-col items-center justify-center gap-6 text-center border-dashed opacity-50">
      <TicketPercent class="w-16 h-16 text-slate-500" />
      <div class="space-y-2">
        <h4 class="text-lg font-black uppercase italic tracking-widest text-slate-400">Sin Ofertas Activas</h4>
        <p class="text-sm italic text-slate-500">Comienza creando una nueva promoción estratégica para tus clientes.</p>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div class="max-w-xl w-full glass-panel border border-indigo-500/30 rounded-3xl p-8 md:p-10 space-y-8 shadow-3xl animate-slide-up relative">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Plus class="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 class="text-xl font-black italic uppercase tracking-tighter text-white">Nueva Promoción</h3>
              <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Nexus Marketing System</p>
            </div>
          </div>
          <button @click="showModal = false" class="text-slate-500 hover:text-white transition-colors">Cerrar</button>
        </div>

        <form @submit.prevent="createPromotion" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2 md:col-span-2">
            <label class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Título de la Oferta</label>
            <input v-model="newPromo.title" type="text" required placeholder="Ej: Black Friday Nexora" class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/40 transition-all font-medium text-white" />
          </div>
          
          <div class="space-y-2 md:col-span-2">
            <label class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Descripción</label>
            <textarea v-model="newPromo.description" rows="3" placeholder="Describe los beneficios..." class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/40 transition-all font-medium text-white resize-none"></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Descuento (%)</label>
            <input v-model="newPromo.discount_percent" type="number" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/40 transition-all text-white" />
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Plan Tier</label>
            <select v-model="newPromo.plan_tier" class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/40 transition-all text-white appearance-none">
              <option value="basic">BASIC</option>
              <option value="premium">PREMIUM</option>
              <option value="enterprise">ENTERPRISE</option>
            </select>
          </div>

          <button type="submit" class="md:col-span-2 btn-primary py-4 font-black italic uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
            Lanzar Promoción Global
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
