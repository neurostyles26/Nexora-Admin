<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const showPassword = ref(false)
const loginRole = ref('user') // 'admin' or 'user'

const rememberMe = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    await authStore.signIn(email.value, password.value, rememberMe.value)
    
    if (loginRole.value === 'admin' && !authStore.user.is_system_admin) {
      await authStore.signOut()
      throw new Error('No tienes permisos de Administrador Global.')
    }
    
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.message || 'Credenciales inválidas o error de conexión.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
    <!-- Mesh Background -->
    <div class="mesh-gradient"></div>
    
    <!-- Background Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="glass-panel p-0.5 w-full max-w-md rounded-3xl shadow-xl relative z-10">
      <div class="rounded-[calc(1.5rem-2px)] p-8 md:p-10 border border-[var(--border-primary)] transition-all duration-500" style="background: var(--glass-bg); backdrop-filter: blur(40px);">
        
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div class="bg-white p-2 rounded-xl shadow-lg shadow-indigo-500/10 active:scale-95 transition-transform cursor-pointer">
            <img src="/Logo-Global-Nexora.png" alt="Nexora" class="h-9" />
          </div>
        </div>
        
        <div class="text-center mb-8">
          <h2 class="text-2xl font-black tracking-tight italic uppercase" style="color: var(--text-primary);">
            {{ loginRole === 'admin' ? 'Nexora Central' : 'Acceso Seguro' }}
          </h2>
          <p class="text-sm mt-2 font-medium italic" style="color: var(--text-secondary);">
            {{ loginRole === 'admin' ? 'Portal de Gestión Global' : 'Gestiona tu núcleo inteligente' }}
          </p>
        </div>

        <div class="flex p-1.5 bg-white/5 border border-[var(--border-primary)] rounded-2xl mb-8">
          <button 
            type="button"
            @click="loginRole = 'user'"
            class="flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
            :class="loginRole === 'user' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'"
          >
            Usuario
          </button>
          <button 
            type="button"
            @click="loginRole = 'admin'"
            class="flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
            :class="loginRole === 'admin' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'"
          >
            Administrador
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div v-if="errorMsg" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-[11px] text-center font-bold uppercase tracking-wider">
            {{ errorMsg }}
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase tracking-[0.2em] ml-1" style="color: var(--text-muted);">Email</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" style="color: var(--text-muted);" />
              <input 
                v-model="email"
                type="email" 
                required
                class="relative w-full border rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                style="background: rgba(255,255,255,0.04); border-color: var(--border-primary); color: var(--text-primary);"
                placeholder="correo@empresa.com"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-bold uppercase tracking-[0.2em] ml-1" style="color: var(--text-muted);">Contraseña</label>
            <div class="relative group">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" style="color: var(--text-muted);" />
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'" 
                required
                class="relative w-full border rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                style="background: rgba(255,255,255,0.04); border-color: var(--border-primary); color: var(--text-primary);"
                placeholder="••••••••"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/5 transition-colors group/eye"
              >
                <component 
                  :is="showPassword ? EyeOff : Eye" 
                  class="w-4 h-4 text-slate-500 group-hover/eye:text-indigo-400 transition-colors"
                />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between px-1 pt-1">
            <label class="relative flex items-center gap-2.5 cursor-pointer group">
              <div class="relative">
                <input v-model="rememberMe" type="checkbox" class="sr-only peer" />
                <div class="w-9 h-[18px] rounded-full peer-checked:bg-indigo-500/20 peer-checked:border-indigo-500/50 transition-all" style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-primary);"></div>
                <div class="absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-[var(--text-muted)] rounded-full peer-checked:left-[18px] peer-checked:bg-indigo-400 transition-all"></div>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider group-hover:text-[var(--text-secondary)] transition-colors select-none" style="color: var(--text-muted);">Recordar</span>
            </label>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full btn-primary justify-center text-white py-4 shadow-lg shadow-indigo-600/20 disabled:opacity-50 active:scale-95 italic tracking-[0.15em]"
          >
            <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
            <span v-else class="flex items-center gap-2">
               INGRESAR <ArrowRight class="w-5 h-5" />
            </span>
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-[var(--border-primary)] flex flex-col items-center gap-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em]" style="color: var(--text-muted);">
            ¿Olvidaste tu contraseña?
          </p>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em]" style="color: var(--text-muted);">
            ¿No tienes cuenta? <router-link to="/register" class="text-indigo-400 hover:text-indigo-300 ml-1">Regístrate</router-link>
          </p>
          <div class="flex items-center gap-2">
             <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_6px_var(--accent-glow)]"></div>
             <p class="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40" style="color: var(--text-muted);">
               Nexora Admin v2.0
             </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
