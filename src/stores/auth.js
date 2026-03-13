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

            supabase.auth.onAuthStateChange(async (_event, session) => {
                this.session = session
                if (session?.user) {
                    await this.refreshProfile(session.user)
                } else {
                    this.user = null
                }
            })
        },
        async refreshProfile(user = null) {
            const currentUser = user || this.user
            if (!currentUser) return
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('is_verified, is_system_admin, full_name')
                    .eq('id', currentUser.id)
                    .single()

                if (error && error.code !== 'PGRST116') throw error

                // Fetch business if not system admin
                let business = null
                if (data && !data.is_system_admin) {
                    const { data: busData } = await supabase
                        .from('business_users')
                        .select('business_id, role, businesses(*)')
                        .eq('user_id', currentUser.id)
                        .single()
                    business = busData
                }

                this.user = {
                    ...currentUser,
                    full_name: data?.full_name || currentUser.user_metadata?.full_name,
                    is_verified: data?.is_verified || false,
                    is_system_admin: data?.is_system_admin || false,
                    business: business
                }
            } catch (err) {
                console.error('Error refreshing profile:', err)
                // If profile fetch fails, we still keep the basic user info
                this.user = { ...currentUser }
            }
        },
        async signIn(email, password, rememberMe = false) {
            this.loading = true
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            this.loading = false
            if (error) throw error

            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('is_verified, is_system_admin')
                .eq('id', data.user.id)
                .single()

            if (profileError && profileError.code !== 'PGRST116') throw profileError

            if (profile && !profile.is_verified && !profile.is_system_admin) {
                // If not verified and NOT a system admin, we sign out
                await supabase.auth.signOut()
                throw new Error('Tu cuenta está pendiente de verificación por un administrador.')
            }

            await this.refreshProfile(data.user)
            this.session = data.session

            if (rememberMe) {
                localStorage.setItem('nexora_remember_me', 'true')
                sessionStorage.removeItem('nexora_volatile_session')
            } else {
                localStorage.removeItem('nexora_remember_me')
                sessionStorage.setItem('nexora_volatile_session', 'true')
            }
        },
        async signUp(email, password, fullName, businessName = '') {
            this.loading = true
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { 
                    data: { 
                        full_name: fullName,
                        business_name: businessName
                    } 
                }
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

