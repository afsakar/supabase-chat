import {defineStore} from 'pinia'
import {supabase} from '@/supabase'
import {onMounted, ref} from 'vue'

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        user: null,
        session: null,
    }),
    getters: {
        sessionData: (state) => state.session
    },
    actions: {
        async getSession() {
            return supabase.auth.getSession().then(({data}) => {
                this.session = data.session
            })
        },
    },
})