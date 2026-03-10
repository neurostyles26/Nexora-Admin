<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Mail, Lock, Loader2, ArrowRight, User, Eye, EyeOff, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const fullName = ref('')
const loading = ref(false)
const showPassword = ref(false)
const registered = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    await authStore.signUp(email.value, password.value, fullName.value)
    registered.value = true
  } catch (err) {
    errorMsg.value = err.message || 'Error al crear la cuenta. Inténtalo de nuevo.'
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

        <div v-if="!registered">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-black tracking-tight italic" style="color: var(--text-primary);">Registro Admin</h2>
            <p class="text-sm mt-2 font-medium italic" style="color: var(--text-secondary);">Únete al ecosistema inteligente</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5">
            <div v-if="errorMsg" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-[11px] text-center font-bold uppercase tracking-wider">
              {{ errorMsg }}
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.2em] ml-1" style="color: var(--text-muted);">Nombre Completo</label>
              <div class="relative group">
                <User class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" style="color: var(--text-muted);" />
                <input 
                  v-model="fullName"
                  type="text" 
                  required
                  class="relative w-full border rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                  style="background: rgba(255,255,255,0.04); border-color: var(--border-primary); color: var(--text-primary);"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.2em] ml-1" style="color: var(--text-muted);">Email Corporativo</label>
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

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full btn-primary justify-center text-white py-4 shadow-lg shadow-indigo-600/20 disabled:opacity-50 active:scale-95 italic tracking-[0.15em]"
            >
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <span v-else class="flex items-center gap-2">
                 REGISTRARSE <ArrowRight class="w-5 h-5" />
              </span>
            </button>
          </form>

          <div class="mt-8 text-center border-t border-[var(--border-primary)] pt-6">
            <p class="text-[10px] font-bold uppercase tracking-[0.2em]" style="color: var(--text-muted);">
              ¿Ya tienes cuenta? 
              <router-link to="/login" class="text-indigo-400 hover:text-indigo-300 ml-1">Inicia Sesión</router-link>
            </p>
          </div>
        </div>

        <!-- Success Message -->
        <div v-else class="text-center space-y-6 animate-fade-in">
          <div class="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 class="w-10 h-10 text-emerald-400" />
          </div>
          <h2 class="text-2xl font-black tracking-tight italic" style="color: var(--text-primary);">¡Registro Exitoso!</h2>
          <div class="space-y-4">
            <p class="text-sm italic leading-relaxed" style="color: var(--text-secondary);">
              Tu solicitud ha sido enviada al <span class="text-indigo-400 font-bold">Administrador General</span>.
            </p>
            <p class="text-xs italic bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10" style="color: var(--text-muted);">
              Recibirás un correo una vez que tu cuenta haya sido verificada. Este proceso suele tardar menos de 24 horas.
            </p>
          </div>
          <router-link 
            to="/login" 
            class="block w-full py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-white/5 active:scale-95 italic"
            style="border-color: var(--border-primary); color: var(--text-primary);"
          >
            Volver al Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
