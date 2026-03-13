<script setup>
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles,
  PanelLeft,
  Shield,
  TicketPercent,
  History,
  Database,
  FileSpreadsheet,
  PanelLeftClose
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLayoutStore } from '../stores/layout'

const router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const menuItems = [
  { name: 'Inteligencia', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Comunidad', icon: Users, path: '/dashboard/customers' },
  { name: 'Catálogo', icon: Package, path: '/dashboard/products' },
  { name: 'Transacciones', icon: ShoppingCart, path: '/dashboard/orders' },
  { name: 'Convertidor PDF', icon: FileSpreadsheet, path: '/dashboard/pdf-converter' },
  { name: 'Ecosistema', icon: BarChart2, path: '/dashboard/integrations' },
]

const adminItems = [
  { name: 'Usuarios Global', icon: Shield, path: '/dashboard/admin/users' },
  { name: 'Promociones', icon: TicketPercent, path: '/dashboard/admin/promotions' },
  { name: 'Historial', icon: History, path: '/dashboard/admin/logs' },
  { name: 'Bases de Datos', icon: Database, path: '/dashboard/admin/databases' },
]

const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Fallback redirect even if signOut fails
    router.push('/login')
  }
}
</script>

<template>
  <!-- Mobile Backdrop -->
  <div 
    v-if="layoutStore.isMobileMenuOpen" 
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden animate-fade-in"
    @click="layoutStore.closeMobileMenu"
  ></div>

  <aside 
    :class="[
      'h-screen overflow-hidden flex flex-col fixed lg:sticky top-0 bg-[var(--bg-primary)] border-r border-[var(--border-primary)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-50',
      layoutStore.isSidebarCollapsed ? 'w-[72px]' : 'w-72 lg:w-64 xl:w-72',
      layoutStore.isMobileMenuOpen ? 'translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none"></div>

    <!-- Sidebar Header -->
    <div 
      :class="[
        'flex flex-col items-center transition-all duration-500 shrink-0',
        layoutStore.isSidebarCollapsed ? 'p-4 pt-8' : 'p-6 pb-8'
      ]"
    >
      <div class="relative group cursor-pointer active:scale-95 transition-all w-full flex justify-center" @click="layoutStore.closeMobileMenu">
         
         <!-- Logo Container -->
         <div 
           :class="[
             'relative z-10 flex items-center justify-center transition-all duration-700 w-full',
             layoutStore.isSidebarCollapsed ? 'w-11 h-11' : 'h-11'
           ]"
         >
            <div v-if="!layoutStore.isSidebarCollapsed" class="flex items-center justify-between w-full px-3">
                <div class="flex items-center gap-3">
                   <div class="logo-badge !w-10 !h-10 !rounded-xl group-hover:rotate-3 transition-all duration-500 shrink-0 border border-white/10">
                      <img src="/Logo-Global-Nexora.png" alt="Nexora" class="w-full h-full object-contain p-1" />
                   </div>
                   <span class="text-2xl font-black italic tracking-tighter uppercase truncate sidebar-logo-text" style="font-family: 'Montserrat', sans-serif;">Nexora</span>
                </div>
               
               <!-- Toggle -->
               <button 
                 @click.stop="layoutStore.toggleSidebar"
                 class="hidden lg:flex p-1.5 rounded-lg transition-all active:scale-90 hover:bg-[var(--border-primary)]"
                 style="color: var(--text-muted);"
                 title="Minimizar Panel"
               >
                  <PanelLeftClose class="w-4 h-4" />
               </button>
            </div>
             <div v-else class="flex flex-col items-center gap-4">
                <div class="logo-badge !w-11 !h-11 !rounded-xl group-hover:scale-110 transition-all shrink-0 border border-white/10">
                   <img src="/Logo-Global-Nexora.png" alt="Nexora" class="w-full h-full object-contain p-1" />
                </div>
               <button 
                 @click.stop="layoutStore.toggleSidebar"
                 class="hidden lg:flex p-1.5 rounded-lg transition-all active:scale-90 hover:bg-[var(--border-primary)]"
                 style="color: var(--text-muted);"
               >
                  <PanelLeft class="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
      
      <!-- Status Badge -->
      <transition name="fade">
        <div v-if="!layoutStore.isSidebarCollapsed" class="mt-5 flex items-center gap-2 animate-fade-in px-3 py-1.5 rounded-full border" style="background: rgba(255,255,255,0.03); border-color: var(--border-primary);">
           <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_6px_#10b981]"></div>
           <p class="text-[9px] font-black tracking-[0.25em] uppercase" style="color: var(--text-muted);">
             {{ authStore.user?.is_system_admin ? 'FUNDADOR NEXORA' : 'Panel Activo' }}
           </p>
        </div>
      </transition>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-hide py-2">
      <!-- Global Admin Section (Núcleo Fundador) -->
      <div v-if="authStore.user?.is_system_admin" class="space-y-1.5 pb-6 mb-4 border-b border-indigo-500/10">
        <div v-if="!layoutStore.isSidebarCollapsed" class="px-4 py-3 mb-2 flex items-center gap-2">
          <Shield class="w-3.5 h-3.5 text-indigo-400" />
          <p class="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">Núcleo Fundador</p>
        </div>
        
        <router-link 
          v-for="item in adminItems" 
          :key="item.name"
          :to="item.path"
          @click="layoutStore.closeMobileMenu"
          :class="[
            'flex items-center rounded-2xl transition-all duration-300 group border border-transparent hover:border-indigo-500/20 active:scale-[0.98] relative',
            layoutStore.isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3.5'
          ]"
          active-class="nav-active-admin"
        >
          <div class="flex items-center gap-4 min-w-0">
             <div 
               class="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 bg-indigo-500/5 shadow-[0_4px_12px_rgba(99,102,241,0.05)]"
             >
                <component :is="item.icon" class="w-[18px] h-[18px] transition-all text-indigo-400 group-hover:text-indigo-300" />
             </div>
             <transition name="fade">
               <span v-if="!layoutStore.isSidebarCollapsed" class="font-bold text-[11px] uppercase tracking-[0.15em] transition-all truncate text-slate-400 group-hover:text-indigo-100">
                 {{ item.name }}
               </span>
             </transition>
          </div>
          <ChevronRight v-if="!layoutStore.isSidebarCollapsed" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-30 transition-all -translate-x-1 group-hover:translate-x-0 text-indigo-400" />
        </router-link>
      </div>

      <div v-if="!layoutStore.isSidebarCollapsed" class="px-4 py-3 mb-2">
        <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Principal</p>
      </div>

      <router-link 
        v-for="item in menuItems" 
        :key="item.name"
        :to="item.path"
        @click="layoutStore.closeMobileMenu"
        :class="[
          'flex items-center rounded-2xl transition-all duration-300 group border border-transparent hover:border-[var(--border-primary)] active:scale-[0.98] relative',
          layoutStore.isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3.5'
        ]"
        active-class="nav-active"
      >
        <div class="flex items-center gap-4 min-w-0">
           <div 
             class="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0"
             style="background: rgba(255,255,255,0.04);"
           >
              <component :is="item.icon" class="w-[18px] h-[18px] transition-all nav-icon" />
           </div>
           <transition name="fade">
             <span v-if="!layoutStore.isSidebarCollapsed" class="font-bold text-[11px] uppercase tracking-[0.15em] transition-all truncate nav-text">
               {{ item.name }}
             </span>
           </transition>
        </div>
        <ChevronRight v-if="!layoutStore.isSidebarCollapsed" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-30 transition-all -translate-x-1 group-hover:translate-x-0" />
      </router-link>
    </nav>

    <!-- Bottom Actions -->
    <div 
      :class="[
        'border-t space-y-2 mt-auto transition-all shrink-0',
        layoutStore.isSidebarCollapsed ? 'p-3 items-center' : 'p-4'
      ]"
      style="border-color: var(--border-primary);"
    >
      <router-link 
        to="/dashboard/settings" 
        @click="layoutStore.closeMobileMenu"
        :class="[
          'flex items-center gap-3 rounded-2xl transition-all hover:bg-[var(--border-primary)] group relative overflow-hidden',
          layoutStore.isSidebarCollapsed ? 'p-3 justify-center' : 'px-4 py-3'
        ]"
      >
        <Settings class="w-[18px] h-[18px] group-hover:rotate-45 transition-transform shrink-0" style="color: var(--text-muted);" />
        <transition name="fade">
          <span v-if="!layoutStore.isSidebarCollapsed" class="font-bold text-[10px] uppercase tracking-widest group-hover:text-[var(--text-primary)] transition-colors truncate nav-text-muted">Preferencias</span>
        </transition>
      </router-link>
      
      <button 
        @click="handleLogout" 
        :class="[
          'w-full flex items-center gap-3 rounded-2xl transition-all hover:bg-rose-500/10 group text-[var(--text-muted)] hover:text-rose-400',
          layoutStore.isSidebarCollapsed ? 'p-3 justify-center' : 'px-4 py-3'
        ]"
      >
        <LogOut class="w-[18px] h-[18px] group-hover:-translate-x-0.5 transition-transform shrink-0" />
        <transition name="fade">
          <span v-if="!layoutStore.isSidebarCollapsed" class="font-bold text-[10px] uppercase tracking-widest truncate">Desconectar</span>
        </transition>
      </button>

      <div v-if="!layoutStore.isSidebarCollapsed" class="pt-3 flex items-center justify-between px-2">
         <p class="text-[9px] font-bold uppercase tracking-widest" style="color: var(--text-muted); opacity: 0.4;">v2.1</p>
         <Sparkles class="w-3 h-3" style="color: var(--accent-primary); opacity: 0.2;" />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.nav-active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent);
  border-color: rgba(99, 102, 241, 0.15) !important;
}

.nav-active span {
  color: var(--text-primary);
  opacity: 1 !important;
}

.nav-active div {
  background: var(--accent-primary) !important;
  box-shadow: 0 4px 16px var(--accent-glow);
}

.nav-active svg {
  opacity: 1 !important;
}

.nav-active-admin {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), transparent);
  border-color: rgba(99, 102, 241, 0.3) !important;
}

.nav-active-admin span {
  color: white !important;
}

.nav-active-admin div {
  background: var(--accent-primary) !important;
  box-shadow: 0 4px 16px var(--accent-glow);
}

.nav-active-admin svg {
  color: white !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
