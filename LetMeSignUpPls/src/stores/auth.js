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
            // First, look up the email associated with this username
            const { data: userData, error: lookupError } = await supabase
                .from('Users')
                .select('email')
                .eq('username', username)
                .single()
            
            if (lookupError) throw new Error('Invalid username or password')
            
            // Then sign in with the email
            const { data, error } = await supabase.auth.signInWithPassword({ 
                email: userData.email, 
                password 
            })
            if (error) throw error
            this.user = data.user
        },
        async signUp(email, password, username) {
            // Sign up with email and password
            const { data, error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/home`
                }
            })
            if (error) throw error
            
            // Store username in a separate users table
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({ 
                        id: data.user.id, 
                        email: email,
                        username: username 
                    })
                
                if (profileError) throw profileError
            }
            
            this.user = data.user
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