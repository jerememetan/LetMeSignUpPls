// src/stores/items.js
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useItemsStore = defineStore('items', {
    state: () => ({
    items: [],
    }),
    actions: {
    async fetchItems() {
        const { data, error } = await supabase.from('items').select('*')
        if (error) throw error
        this.items = data
    },
    async addItem(item) {
        const { data, error } = await supabase.from('items').insert([item])
        if (error) throw error
        // Optionally, refetch items or update local state
    },
    // ... other actions for update, delete
    },
})