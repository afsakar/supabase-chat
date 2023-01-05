<script setup>
import {ref} from 'vue'
import {useAuthStore} from '@/composables/useAuthStore.js'
import {supabase} from "@/supabase.js";

const auth = useAuthStore()

const loading = ref(false)
const email = ref('')
const successResp = ref(false)
const errorResp = ref(false)
const message = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const {error} = await supabase.auth.signInWithOtp({
      email: email.value,
    })
    if (error) throw error
    successResp.value = true
    message.value = 'Check your email for the login link!'
    errorResp.value = false
  } catch (error) {
    if (error instanceof Error) {
      errorResp.value = true
      message.value = error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- component -->
  <div class="flex flex-col items-center justify-center bg-gray-600 w-screen min-h-screen bg-gray-100 text-gray-800 ">
    <div class="flex justify-center my-2 mx-4 md:mx-0">
      <form class="max-w-md bg-gray-300 rounded-lg shadow-md p-6" @submit.prevent="handleLogin">
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-full px-3 mb-6">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for='Password'>Email
              address</label>
            <input v-model="email"
                   class="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                   type='email'>
          </div>
          <div class="w-full md:w-full px-3 mb-6">
            <button type="submit"
                    :disabled="loading"
                    class="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500">
              {{ loading ? 'Loading' : 'Send magic link' }}
            </button>
          </div>
          <div v-if="errorResp || successResp" :class="{'bg-emerald-600': successResp, 'bg-red-600': errorResp}"
               class="w-11/12 mx-auto px-2 py-1 rounded text-white text-center">
            {{ message }}
          </div>
        </div>
      </form>
    </div>
    <div class="bg-transparent w-full h-10 flex items-center justify-center">
      <span class="text-gray-500">Made with ❤️ by <a href="https://afsakar.dev" target="_blank" class="text-blue-500">Azad Furkan ŞAKAR</a></span>
    </div>
  </div>
</template>