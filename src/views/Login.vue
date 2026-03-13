<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-vue-next'

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
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-[#020617]">
    <!-- Dynamic Mesh Background -->
    <div class="mesh-gradient opacity-60"></div>
    
    <!-- Sophisticated Ambient Glows -->
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
    <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse-slow" style="animation-delay: -2s"></div>

    <div class="w-full max-w-[440px] relative z-10">
      <!-- Entrance Animation Group -->
      <div class="animate-card-entrance">
        
        <!-- Premium Glass Card -->
        <div class="glass-panel overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          <div class="relative p-6 sm:p-8 md:p-10">
            
            <!-- Abstract background pattern -->
            <div class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles class="w-32 h-32 text-indigo-400 rotate-12" />
            </div>

            <!-- Logo Section -->
            <div class="flex justify-center mb-6 sm:mb-8 animate-stagger-1">
              <div class="relative group">
                <div class="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                <div class="bg-white/90 backdrop-blur-sm p-2.5 rounded-2xl shadow-xl border border-white/20 relative z-10 hover:scale-110 active:scale-95 transition-all duration-500">
                  <img src="/Logo-Global-Nexora.png" alt="Nexora" class="h-8 sm:h-9 object-contain" />
                </div>
              </div>
            </div>
            
            <!-- Header Text -->
            <div class="text-center mb-6 sm:mb-8 animate-stagger-2">
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight italic uppercase block mb-1" style="color: var(--text-primary); font-family: 'Montserrat', sans-serif;">
                {{ loginRole === 'admin' ? 'Nexora Central' : 'Acceso Seguro' }}
              </h2>
              <div class="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-3"></div>
              <p class="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-400 opacity-80">
                {{ loginRole === 'admin' ? 'Portal de Gestión Global' : 'Ecosistema de Inteligencia' }}
              </p>
            </div>

            <!-- Enhanced Role Switcher -->
            <div class="flex p-1 bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl mb-6 sm:mb-8 animate-stagger-3">
              <button 
                type="button"
                @click="loginRole = 'user'"
                class="flex-1 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden"
                :class="loginRole === 'user' ? 'text-white' : 'text-slate-500 hover:text-slate-300'"
              >
                <div v-if="loginRole === 'user'" class="absolute inset-0 bg-indigo-600 shadow-lg animate-fade-in"></div>
                <span class="relative z-10">Usuario</span>
              </button>
              <button 
                type="button"
                @click="loginRole = 'admin'"
                class="flex-1 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden"
                :class="loginRole === 'admin' ? 'text-white' : 'text-slate-500 hover:text-slate-300'"
              >
                <div v-if="loginRole === 'admin'" class="absolute inset-0 bg-indigo-600 shadow-lg animate-fade-in"></div>
                <span class="relative z-10">Admin</span>
              </button>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4 sm:space-y-5 animate-stagger-4">
              <div v-if="errorMsg" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-[10px] text-center font-black uppercase tracking-widest animate-shake">
                {{ errorMsg }}
              </div>

              <!-- Input Group: Email -->
              <div class="space-y-1.5 group">
                <label class="text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-500 transition-colors group-focus-within:text-indigo-400">Identificador Vital</label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Mail class="w-full h-full" />
                  </div>
                  <input 
                    v-model="email"
                    type="email" 
                    required
                    class="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-600"
                    style="color: var(--text-primary);"
                    placeholder="INSTANCIA@NEXORA.APP"
                  />
                </div>
              </div>

              <!-- Input Group: Password -->
              <div class="space-y-1.5 group">
                <label class="text-[9px] font-black uppercase tracking-[0.3em] ml-1 text-slate-500 transition-colors group-focus-within:text-indigo-400">Código de Acceso</label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <Lock class="w-full h-full" />
                  </div>
                  <input 
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'" 
                    required
                    class="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-12 py-3 sm:py-4 text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-600"
                    style="color: var(--text-primary);"
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-indigo-400"
                  >
                    <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between px-1 pt-1">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative">
                    <input v-model="rememberMe" type="checkbox" class="sr-only peer" />
                    <div class="w-8 h-4 rounded-full bg-white/5 border border-white/10 peer-checked:bg-indigo-500/20 peer-checked:border-indigo-500/40 transition-all"></div>
                    <div class="absolute left-1 top-1 w-2 h-2 bg-slate-500 rounded-full peer-checked:left-5 peer-checked:bg-indigo-400 transition-all"></div>
                  </div>
                  <span class="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">Mantener Enlace</span>
                </label>
              </div>

              <!-- Primary Action -->
              <button 
                type="submit" 
                :disabled="loading"
                class="w-full relative group/btn overflow-hidden rounded-2xl p-0.5 mt-4"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 group-hover:animate-spin-slow opacity-100 transition-opacity"></div>
                <div class="relative bg-[#020617] rounded-[calc(1rem-2px)] py-3.5 sm:py-4 flex items-center justify-center gap-3 transition-colors group-hover/btn:bg-transparent">
                  <Loader2 v-if="loading" class="w-5 h-5 animate-spin text-white" />
                  <template v-else>
                    <span class="text-xs sm:text-[13px] font-black italic uppercase tracking-[0.25em] text-white">Sincronizar Panel</span>
                    <ArrowRight class="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </template>
                </div>
              </button>
            </form>

            <!-- Secondary Links -->
            <div class="mt-8 pt-8 border-t border-white/5 space-y-4 animate-stagger-5">
              <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[9px] font-black uppercase tracking-[0.25em]">
                <router-link to="/register" class="text-slate-500 hover:text-indigo-400 transition-colors">Solicitar Acceso</router-link>
                <span class="hidden sm:inline w-1 h-1 bg-white/10 rounded-full"></span>
                <button class="text-slate-500 hover:text-rose-400 transition-colors">Recuperar Código</button>
              </div>
              
              <div class="flex items-center justify-center gap-3 opacity-30">
                 <div class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                 <p class="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">Nexora Alpha v2.1</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-card-entrance {
  animation: cardIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-stagger-1 { animation: slideUpFade 0.8s ease-out 0.2s both; }
.animate-stagger-2 { animation: slideUpFade 0.8s ease-out 0.3s both; }
.animate-stagger-3 { animation: slideUpFade 0.8s ease-out 0.4s both; }
.animate-stagger-4 { animation: slideUpFade 0.8s ease-out 0.5s both; }
.animate-stagger-5 { animation: slideUpFade 0.8s ease-out 0.6s both; }

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake { animation: shake 0.4s ease-in-out; }

.animate-spin-slow {
  animation: spin 3s linear infinite;
}
</style>
