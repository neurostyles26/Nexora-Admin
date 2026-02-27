<script setup>
import { ShoppingCart, DollarSign, ArrowUpRight, Clock, XCircle } from 'lucide-vue-next'

const orders = [
  { id: '#ORD-9921', date: '21 Feb 2026', total: '$1,240.00', status: 'Pagado' },
  { id: '#ORD-9920', date: '21 Feb 2026', total: '$450.50', status: 'Pendiente' },
  { id: '#ORD-9919', date: '20 Feb 2026', total: '$89.00', status: 'Cancelado' },
]
</script>

<template>
  <div class="space-y-8 md:space-y-12 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 py-4 md:py-8">
      <div class="space-y-3">
        <h1 class="page-title">Ventas</h1>
        <p class="page-subtitle">Historial de transacciones y facturación del ecosistema.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div class="stat-card border-indigo-500/10">
        <div class="flex items-start justify-between">
          <div class="stat-icon bg-indigo-500/5">
            <DollarSign class="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
          </div>
          <ArrowUpRight class="w-4 h-4 text-emerald-400" />
        </div>
        <div class="mt-4">
          <p class="stat-label">Ingresos del Mes</p>
          <p class="stat-value">$12,450</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-start justify-between">
          <div class="stat-icon bg-amber-500/5">
            <Clock class="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
          </div>
        </div>
        <div class="mt-4">
          <p class="stat-label">Pendientes</p>
          <p class="stat-value">12</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-start justify-between">
          <div class="stat-icon bg-rose-500/5">
            <XCircle class="w-5 h-5 md:w-6 md:h-6 text-rose-400" />
          </div>
        </div>
        <div class="mt-4">
          <p class="stat-label">Cancelados</p>
          <p class="stat-value">3</p>
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="hidden md:block table-container">
      <table>
        <thead>
          <tr>
            <th>Orden ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id" class="group">
            <td>
              <span class="text-sm font-bold" style="color: var(--text-primary);">{{ o.id }}</span>
            </td>
            <td>
              <span class="text-xs" style="color: var(--text-secondary);">{{ o.date }}</span>
            </td>
            <td>
              <span class="text-sm font-bold" style="color: var(--text-primary);">{{ o.total }}</span>
            </td>
            <td>
              <span 
                :class="{
                  'badge-success': o.status === 'Pagado',
                  'badge-warning': o.status === 'Pendiente',
                  'badge-danger': o.status === 'Cancelado',
                }"
              >
                {{ o.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden grid grid-cols-1 gap-4">
      <div 
        v-for="o in orders" 
        :key="o.id"
        class="glass-panel p-5 rounded-2xl border border-[var(--border-primary)] space-y-3"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold" style="color: var(--text-primary);">{{ o.id }}</span>
          <span 
            :class="{
              'badge-success': o.status === 'Pagado',
              'badge-warning': o.status === 'Pendiente',
              'badge-danger': o.status === 'Cancelado',
            }"
          >
            {{ o.status }}
          </span>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
          <span class="text-xs" style="color: var(--text-muted);">{{ o.date }}</span>
          <span class="text-base font-bold text-indigo-400">{{ o.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
