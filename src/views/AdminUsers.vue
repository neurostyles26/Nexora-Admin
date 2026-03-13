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
  ChevronDown,
  Building2,
  Check,
  X as XIcon
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

const acceptUser = async (user) => {
  try {
    loading.value = true
    // If we are verifying a new client, we should create their business first
    if (!user.is_system_admin) {
        const businessName = user.metadata?.business_name || `Empresa de ${user.full_name}`
        const slug = businessName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7)
        
        // 1. Create Business
        const { data: business, error: busError } = await supabase
            .from('businesses')
            .insert({ name: businessName, slug: slug })
            .select()
            .single()
            
        if (busError) throw busError
        
        // 2. Link User to Business as Business Admin
        const { error: linkError } = await supabase
            .from('business_users')
            .insert({ 
                business_id: business.id, 
                user_id: user.id,
                role: 'business_admin'
            })
            
        if (linkError) throw linkError
    }

    const { error } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', user.id)
      
    if (error) throw error
    await fetchUsers()
  } catch (err) {
    console.error('Error accepting user:', err)
    alert('Error al aceptar usuario: ' + err.message)
  } finally {
    loading.value = false
  }
}

const rejectUser = async (user) => {
  if (!confirm(`¿Estás seguro de que deseas rechazar y eliminar a ${user.full_name}?`)) return
  try {
    loading.value = true
    // Deleting the user will trigger cascade if properly configured, 
    // but in many setups we just delete the user record.
    const { error } = await supabase.from('users').delete().eq('id', user.id)
    if (error) throw error
    await fetchUsers()
  } catch (err) {
    console.error('Error rejecting user:', err)
    alert('Error al rechazar usuario: ' + err.message)
  } finally {
    loading.value = false
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
                    <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <Mail class="w-3 h-3" />
                          {{ user.email || 'SIN EMAIL' }}
                        </div>
                        <div v-if="user.metadata?.business_name" class="flex items-center gap-2 text-[9px] font-black text-indigo-400/60 uppercase tracking-wider italic">
                          <Building2 class="w-3 h-3" />
                          {{ user.metadata.business_name }}
                        </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div 
                  class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all"
                  :class="user.is_verified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'"
                >
                  <div class="w-1.5 h-1.5 rounded-full" :class="user.is_verified ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'"></div>
                  <span class="text-[9px] font-black uppercase tracking-[0.2em]">
                    {{ user.is_verified ? 'VERIFICADO' : 'PENDIENTE' }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center justify-end gap-3">
                  <template v-if="!user.is_system_admin">
                    <template v-if="!user.is_verified">
                         <button 
                            @click="acceptUser(user)"
                            class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                            title="Aceptar Usuario"
                          >
                            <Check class="w-4 h-4" />
                          </button>
                    </template>
                    <button 
                        @click="rejectUser(user)"
                        class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                        title="Rechazar/Eliminar"
                      >
                        <XIcon class="w-4 h-4" />
                      </button>
                    <button 
                      class="p-2.5 rounded-xl bg-white/5 border border-[var(--border-primary)] hover:border-indigo-500/40 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 transition-all active:scale-90"
                      title="Reset Contraseña"
                    >
                      <Key class="w-4 h-4" />
                    </button>
                  </template>
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
