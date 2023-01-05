import {defineStore} from 'pinia'
import {supabase} from '@/supabase'

export const useChatStore = defineStore('chatStore', {
    state: () => ({
        messages: [],
    }),
    getters: {
        messageList: (state) => state.messages,
    },
    actions: {
        async getMessages(from, to) {
            const {data} = await supabase
                .from("messages")
                .select()
                .range(from, to)
                .order("timestamp", {ascending: false});
            return data;
        },
        async onNewMessage(handler) {
            supabase
                .channel('*')
                .on('postgres_changes', {event: '*', schema: '*'}, payload => {
                    handler(payload.new);
                })
                .subscribe()
        },
        async createNewMessage(user_id, text) {
            const {data} = await supabase
                .from("messages")
                .insert({user_id, text});
            return data;
        }
    },
})