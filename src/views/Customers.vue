<script setup>
import { Search, UserPlus, MoreVertical, Mail, Phone, Users, UserCheck, UserX } from 'lucide-vue-next'

const customers = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '+54 11 2233 4455', status: 'Activo' },
  { id: 2, name: 'María García', email: 'maria@example.com', phone: '+54 11 9988 7766', status: 'Activo' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', phone: '+54 11 5544 3322', status: 'Inactivo' },
]
</script>

<template>
  <div class="space-y-8 md:space-y-12 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 py-4 md:py-8">
      <div class="space-y-3">
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">Gestiona tu base de datos de clientes y comunidad.</p>
      </div>
      <button class="btn-primary py-3.5 px-8 text-xs font-black tracking-[0.15em] shadow-xl active:scale-95 flex items-center justify-center gap-3 italic self-start md:self-auto">
        <UserPlus class="w-4 h-4" /> NUEVO CLIENTE
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div v-for="stat in [
        { name: 'Total Clientes', value: '1,280', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
        { name: 'Activos', value: '1,185', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
        { name: 'Inactivos', value: '95', icon: UserX, color: 'text-rose-400', bg: 'bg-rose-500/5' }
      ]" :key="stat.name" class="stat-card">
        <div class="flex items-center gap-4">
          <div :class="['stat-icon', stat.bg]">
            <component :is="stat.icon" :class="['w-5 h-5 md:w-6 md:h-6', stat.color]" />
          </div>
          <div class="min-w-0">
            <p class="stat-label">{{ stat.name }}</p>
            <p class="stat-value">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative w-full md:max-w-md group">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" style="color: var(--text-muted);" />
      <input 
        type="text" 
        placeholder="Buscar clientes..." 
        class="w-full border rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/40 transition-all font-medium"
        style="background: rgba(255,255,255,0.03); border-color: var(--border-primary); color: var(--text-primary);"
      />
    </div>

    <!-- Desktop Table -->
    <div class="hidden lg:block table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Estado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in customers" :key="user.id" class="group">
            <td>
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 shrink-0 text-sm border border-indigo-500/10">
                  {{ user.name.charAt(0) }}
                </div>
                <span class="text-sm font-bold truncate" style="color: var(--text-primary);">{{ user.name }}</span>
              </div>
            </td>
            <td>
              <div class="space-y-1.5 min-w-0">
                <div class="flex items-center gap-2 text-xs truncate" style="color: var(--text-secondary);">
                  <Mail class="w-3 h-3 opacity-40 shrink-0" /> <span class="truncate">{{ user.email }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs truncate" style="color: var(--text-secondary);">
                  <Phone class="w-3 h-3 opacity-40 shrink-0" /> <span class="truncate">{{ user.phone }}</span>
                </div>
              </div>
            </td>
            <td>
              <span :class="user.status === 'Activo' ? 'badge-success' : 'badge-danger'">
                {{ user.status }}
              </span>
            </td>
            <td class="text-right">
              <button class="p-2.5 rounded-xl transition-colors hover:bg-[var(--border-primary)]" style="color: var(--text-muted);">
                <MoreVertical class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div 
        v-for="user in customers" 
        :key="user.id"
        class="glass-panel p-5 rounded-2xl border border-[var(--border-primary)] space-y-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 shrink-0 text-sm border border-indigo-500/10">
              {{ user.name.charAt(0) }}
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-bold truncate" style="color: var(--text-primary);">{{ user.name }}</h3>
              <p class="text-xs truncate" style="color: var(--text-muted);">{{ user.email }}</p>
            </div>
          </div>
          <span :class="user.status === 'Activo' ? 'badge-success' : 'badge-danger'">
            {{ user.status }}
          </span>
        </div>
        
        <div class="flex items-center gap-2 text-xs pt-2 border-t border-[var(--border-primary)]" style="color: var(--text-secondary);">
          <Phone class="w-3 h-3 opacity-40 shrink-0" /> {{ user.phone }}
        </div>
      </div>
    </div>
  </div>
</template>
