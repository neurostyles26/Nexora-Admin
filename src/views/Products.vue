<script setup>
import { Search, Plus, MoreVertical, Package, Layers, AlertCircle } from 'lucide-vue-next'

const products = [
  { id: 1, name: 'Premium Coffee Beans', sku: 'COF-001', price: '$24.99', stock: 156 },
  { id: 2, name: 'Artisan Mug Set', sku: 'MUG-012', price: '$45.00', stock: 42 },
  { id: 3, name: 'Digital Scale v2', sku: 'SCA-054', price: '$120.00', stock: 12 },
]
</script>

<template>
  <div class="space-y-8 md:space-y-12 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 py-4 md:py-8">
      <div class="space-y-3">
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">Gestión estratégica de activos y control de inventario global en tiempo real.</p>
      </div>
      <button class="btn-primary py-3.5 px-8 text-xs font-black tracking-[0.15em] shadow-xl active:scale-95 flex items-center justify-center gap-3 italic self-start md:self-auto group">
        <Plus class="w-4 h-4 group-hover:rotate-90 transition-transform" /> AGREGAR ACTIVO
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
       <div 
         v-for="stat in [
           { name: 'Total Items', value: '1,420', icon: Package, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
           { name: 'En Stock', value: '1,284', icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
           { name: 'Bajo Stock', value: '36', icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/5' }
         ]"
         :key="stat.name"
         class="stat-card"
       >
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
         placeholder="Buscar por nombre o SKU..." 
         class="w-full border rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500/40 transition-all font-medium italic"
         style="background: rgba(255,255,255,0.03); border-color: var(--border-primary); color: var(--text-primary);"
       />
    </div>

    <!-- Desktop Table -->
    <div class="hidden lg:block table-container">
      <table>
        <thead>
          <tr>
            <th>Activo / SKU</th>
            <th>Precio</th>
            <th>Estado de Stock</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id" class="group">
            <td>
              <div class="flex flex-col gap-0.5 min-w-0">
                <span class="text-sm font-bold italic uppercase tracking-tight group-hover:text-indigo-400 transition-colors truncate" style="color: var(--text-primary);">{{ p.name }}</span>
                <span class="text-[10px] font-mono tracking-widest" style="color: var(--text-muted);">{{ p.sku }}</span>
              </div>
            </td>
            <td>
              <span class="text-lg font-bold text-indigo-400 italic">{{ p.price }}</span>
            </td>
            <td>
              <div class="flex items-center gap-4">
                 <div class="flex-1 max-w-[120px] h-1.5 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.05);">
                    <div 
                      :class="['h-full transition-all duration-700', p.stock < 20 ? 'bg-rose-500' : 'bg-emerald-500']" 
                      :style="{ width: (p.stock / 2) + '%' }"
                    ></div>
                 </div>
                 <span class="text-xs font-bold tabular-nums" style="color: var(--text-secondary);">{{ p.stock }} UNIT</span>
              </div>
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
         v-for="p in products" 
         :key="p.id"
         class="glass-panel p-5 rounded-2xl border border-[var(--border-primary)] space-y-4 group"
       >
          <div class="flex justify-between items-start">
             <div class="min-w-0 flex-1">
                <h3 class="text-base font-bold italic uppercase tracking-tight truncate" style="color: var(--text-primary);">{{ p.name }}</h3>
                <p class="text-[10px] font-mono tracking-widest" style="color: var(--text-muted);">{{ p.sku }}</p>
             </div>
             <button class="p-2 rounded-lg shrink-0 ml-2" style="background: rgba(255,255,255,0.04); color: var(--text-muted);">
                <MoreVertical class="w-4 h-4" />
             </button>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
             <div class="space-y-0.5">
                <p class="text-[9px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Precio</p>
                <p class="text-lg font-bold text-indigo-400 italic">{{ p.price }}</p>
             </div>
             <div class="text-right space-y-1.5">
                <p class="text-[9px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Stock</p>
                <div class="flex items-center gap-2">
                   <span :class="['text-xs font-bold tabular-nums', p.stock < 20 ? 'text-rose-400' : 'text-emerald-400']">{{ p.stock }}</span>
                   <div class="w-12 h-1.5 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.05);">
                      <div :class="['h-full', p.stock < 20 ? 'bg-rose-500' : 'bg-emerald-500']" :style="{width: (p.stock / 2) + '%'}"></div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>
