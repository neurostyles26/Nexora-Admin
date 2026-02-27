import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        session: null,
        loading: false,
    }),
    getters: {
        isAuthenticated: (state) => !!state.user
    },
    actions: {
        async initialize() {
            const { data: { session } } = await supabase.auth.getSession()
            this.session = session
            this.user = session?.user || null

            supabase.auth.onAuthStateChange((_event, session) => {
                this.session = session
                this.user = session?.user || null
            })
        },
        async signIn(email, password, rememberMe = false) {
            this.loading = true
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            this.loading = false
            if (error) throw error

            this.user = data.user
            this.session = data.session

            if (rememberMe) {
                localStorage.setItem('nexora_remember_me', 'true')
                sessionStorage.removeItem('nexora_volatile_session')
            } else {
                localStorage.removeItem('nexora_remember_me')
                sessionStorage.setItem('nexora_volatile_session', 'true')
            }
        },
        async signUp(email, password, fullName) {
            this.loading = true
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } }
            })
            this.loading = false
            if (error) throw error
            this.user = data.user
            this.session = data.session
        },
        async signOut() {
            await supabase.auth.signOut()
            this.user = null
            this.session = null
        },
        setUser(user) {
            this.user = user
        },
        setSession(session) {
            this.session = session
        },
        async checkVolatileSession() {
            // If there's a session but nexora_volatile_session is missing, 
            // it means the browser was closed (sessionStorage cleared) 
            // but localStorage persisted the Supabase session.
            const isVolatile = localStorage.getItem('supabase.auth.token') // simplified check
            if (!sessionStorage.getItem('nexora_volatile_session') && isVolatile && !localStorage.getItem('nexora_remember_me')) {
                // This is a bit complex due to how Supabase handles its own localStorage.
                // For "Ojo eso debe ser muy seguro", we'll check our own 'remember' flag.
                if (!localStorage.getItem('nexora_remember_me')) {
                    await this.signOut()
                    return true
                }
            }
            return false
        }
    },
})

