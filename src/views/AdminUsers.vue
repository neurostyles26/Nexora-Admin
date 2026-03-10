<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../services/supabase'
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Trash2, 
  Key, 
  Search,
  Filter,
  MoreVertical,
  ChevronDown
} from 'lucide-vue-next'

const users = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filterStatus = ref('all') // 'all', 'verified', 'pending'

onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  try {
    loading.value = true
    let query = supabase.from('users').select('*').order('created_at', { ascending: false })
    
    if (filterStatus.value === 'verified') query = query.eq('is_verified', true)
    if (filterStatus.value === 'pending') query = query.eq('is_verified', false)
    
    const { data, error } = await query
    if (error) throw error
    users.value = data
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const toggleVerification = async (user) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_verified: !user.is_verified })
      .eq('id', user.id)
    if (error) throw error
    await fetchUsers()
  } catch (err) {
    console.error('Error toggling verification:', err)
  }
}

const deleteUser = async (userId) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción es irreversible.')) return
  try {
    const { error } = await supabase.from('users').delete().eq('id', userId)
    if (error) throw error
    await fetchUsers()
  } catch (err) {
    console.error('Error deleting user:', err)
  }
}
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-4 md:py-8">
      <div class="space-y-3">
        <h1 class="page-title">Gestión Global de Usuarios</h1>
        <p class="page-subtitle">Administra todos los operadores del ecosistema Nexora.</p>
      </div>
      
      <div class="flex items-center gap-3 px-4 py-2 bg-indigo-500/5 border border-indigo-500/20 rounded-xl shadow-lg">
         <ShieldCheck class="w-4 h-4 text-indigo-400" />
         <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">ACCESO TOTAL</span>
      </div>
    </div>

    <!-- Filters & Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3 glass-panel p-6 rounded-3xl border border-[var(--border-primary)] flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-1 w-full">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar por nombre o email..."
            class="w-full bg-white/5 border border-[var(--border-primary)] rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/40 transition-all"
          />
        </div>
        
        <div class="flex items-center gap-2 w-full md:w-auto">
          <select 
            v-model="filterStatus"
            @change="fetchUsers"
            class="bg-white/5 border border-[var(--border-primary)] rounded-2xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/40 appearance-none min-w-[160px]"
          >
            <option value="all">TODOS LOS ESTADOS</option>
            <option value="verified">VERIFICADOS</option>
            <option value="pending">PENDIENTES</option>
          </select>
        </div>
      </div>

      <div class="stat-card p-6 flex flex-col justify-center gap-2">
        <p class="stat-label">Total Usuarios</p>
        <p class="stat-value text-indigo-400">{{ users.length }}</p>
      </div>
    </div>

    <!-- Users Table -->
    <div class="glass-panel overflow-hidden rounded-3xl border border-[var(--border-primary)] shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 border-b border-[var(--border-primary)]">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Usuario</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Estado</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--border-primary)]">
            <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
              <td colspan="3" class="px-8 py-10">
                <div class="h-12 bg-white/5 rounded-2xl w-full"></div>
              </td>
            </tr>
            
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-white/[0.02] transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="grow-0 shrink-0">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
                      <ShieldCheck v-if="user.is_system_admin" class="w-6 h-6 text-indigo-400" />
                      <User v-else class="w-6 h-6 text-slate-400" />
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <p class="text-sm font-black italic uppercase text-white group-hover:text-indigo-400 transition-colors">{{ user.full_name }}</p>
                        <span v-if="user.is_system_admin" class="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[8px] font-black text-indigo-300 uppercase tracking-widest">FUNDADOR</span>
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <Mail class="w-3 h-3" />
                      {{ user.email || 'SIN EMAIL' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div 
                  @click="!user.is_system_admin && toggleVerification(user)"
                  class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all"
                  :class="[
                    user.is_verified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400',
                    user.is_system_admin ? 'cursor-default' : 'cursor-pointer active:scale-95'
                  ]"
                >
                  <div class="w-1.5 h-1.5 rounded-full" :class="user.is_verified ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></div>
                  <span class="text-[9px] font-black uppercase tracking-[0.2em]">
                    {{ user.is_verified ? 'VERIFICADO' : 'PENDIENTE' }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center justify-end gap-3">
                  <button 
                    v-if="!user.is_system_admin"
                    class="p-3 rounded-xl bg-white/5 border border-[var(--border-primary)] hover:border-indigo-500/40 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 transition-all active:scale-90"
                    title="Reset Contraseña"
                  >
                    <Key class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="!user.is_system_admin"
                    @click="deleteUser(user.id)"
                    class="p-3 rounded-xl bg-white/5 border border-[var(--border-primary)] hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all active:scale-90"
                    title="Eliminar Usuario"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <div v-else class="text-[10px] font-black text-indigo-400/30 uppercase tracking-widest italic px-3">PROTEGIDO</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
