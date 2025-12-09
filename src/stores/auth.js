import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient.js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        initialised: false
    }),
    getters: {
        isAuthenticated: (state) => state.user !== null
    },
    actions: {
        async initAuth() {
            const { data: { user } } = await supabase.auth.getUser()
            this.user = user
            this.initialised = true
        },
        async signIn(username, password) {
            try {
                // First, look up the email associated with this username
                const { data: userData, error: lookupError } = await supabase
                    .from('Users')
                    .select('email')
                    .eq('username', username)
                    .maybeSingle()
                
                if (lookupError) {
                    throw new Error('Database query failed')
                }
                
                if (!userData) {
                    throw new Error('Invalid username or password')
                }
                
                // Then sign in with the email
                const { data, error } = await supabase.auth.signInWithPassword({ 
                    email: userData.email, 
                    password 
                })
                
                if (error) throw new Error('Invalid username or password')
                
                this.user = data.user
            } catch (error) {
                throw error
            }
        },
        async signUp(email, password, username) {
            // Sign up with email and password
            // Username is stored in metadata and automatically inserted into Users table via database trigger
            const { data, error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/LetMeSignUpPls/login`,
                    data: {
                        username: username
                    }
                }
            })
            if (error) throw error
            
            this.user = data.user
            return data
        },
        async signOut() {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            this.user = null
        },
        async fetchUser() {
            const { data: { user } } = await supabase.auth.getUser()
            this.user = user
        }
    },
})