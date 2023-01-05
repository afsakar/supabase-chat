<script setup>
import Message from "./Message.vue";
import {useAuthStore} from "@/composables/useAuthStore.js";
import {onMounted, ref} from "vue";
import {supabase} from "@/supabase.js";
import {useRouter} from "vue-router";
import Avatar from "@/components/Avatar.vue";
import {useChatStore} from "@/composables/useChatStore.js";

const chat = useChatStore();
const input = ref('');
const router = useRouter();
const message = ref(null);
const auth = useAuthStore();
const userID = ref(null);
const show = ref(false);
const formData = ref({
  id: userID.value,
  email: '',
  username: '',
  full_name: '',
  website: '',
  avatar_url: '',
});

onMounted(async () => {
  userID.value = auth.sessionData.user.id;
  await loadMessagesBatch();
  await chat.onNewMessage((newMessage) => {
    messages.value = [newMessage, ...messages.value];
    messagesCount.value += 1;
  });
});


  const messages = ref([]);
  const messagesCount = ref(0);
  const maxMessagesPerRequest = 50;
  const loadMessagesBatch = async () => {
    const loadedMessages = await chat.getMessages(
        messagesCount.value,
        maxMessagesPerRequest - 1
    );

    messages.value = [...loadedMessages, ...messages.value];
    messagesCount.value += loadedMessages.length;
  };

  async function signOut() {
    try {
      let {error} = await supabase.auth.signOut()
      if (error) throw error
      await router.push({name: 'Login'})
    } catch (error) {
      alert(error.message)
    }
  }

  async function toggleModal() {
    show.value = !show.value;
    await supabase
        .from('profiles')
        .select('*')
        .eq('id', userID.value)
        .single()
        .then(({data, error}) => {
          formData.value = {
            id: data.id,
            username: data.username,
            full_name: data.full_name,
            website: data.website,
            avatar_url: data.avatar_url,
          };
        })
  }

  function closeModal() {
    message.value = null;
    show.value = false;
  }

  async function updateProfile() {
    try {
      let {error} = await supabase.from('profiles').upsert(formData.value)
      message.value = 'Profile updated successfully!'
      setTimeout(() => {
        closeModal()
      }, 2000)
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

  const handleScroll = (event) => {
    if (event.target.scrollTop === 0) {
      return loadMessagesBatch();
    }
  };
  const handleSend = async (event) => {
    if (!event.key || event.key === "Enter") {
      if (input.value) {
        await chat.createNewMessage(userID.value, input.value);
        input.value = "";
      }
    }
  }
</script>

<template>
  <!-- Component Start -->
  <div class="relative">
    <div class="absolute bg-emerald-600 px-2 py-2 top-0 right-0 w-full shadow-lg">
      <div class="flex items-center justify-between gap-2">
       <div class="flex items-center justify-between gap-2">
         <img src="/chat.png" class="h-10" />
         <span class="text-white font-semibold">SupabaseChat</span>
       </div>
        <div class="flex items-center justify-between gap-2">
          <button @click="toggleModal"
                  class="bg-blue-500 text-blue-100 hover:bg-blue-600 px-2 py-1 rounded shadow-lg">Profile
          </button>
          <button @click="signOut" class="bg-red-500 text-red-100 hover:bg-red-600 px-2 py-1 rounded shadow-lg">
            Logout
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 pt-14 md:pt-16">
      <div class="flex flex-col flex-grow w-full max-w-xl bg-white overflow-hidden">
        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto" @scroll="handleScroll">
          <Message v-for="message in messages.slice().reverse()"
                   :username="message.user_id"
                   :personal="message.user_id === userID"
                   :timestamp="message.timestamp"
                   :text="message.text"/>
        </div>

        <div class="bg-gray-300 p-4">
          <input class="flex items-center h-10 w-full rounded px-3 text-sm" type="text" placeholder="Type your message…"
                 v-model="input" @keydown="handleSend">
        </div>
      </div>
      <div class="bg-transparent w-full h-10 flex items-center justify-center">
        <span class="text-gray-500">Made with ❤️ by <a href="https://afsakar.dev" target="_blank" class="text-blue-500">Azad Furkan ŞAKAR</a></span>
      </div>
    </div>
  </div>
  <!-- Component End  -->
  <teleport to="body">
    <div v-show="show"
         class="md:px-0 px-3 bg-slate-800 bg-opacity-30 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
      <form class="relative bg-white px-5 py-10 rounded-md w-full md:w-auto" @submit.prevent="updateProfile">
        <Avatar v-model:path="formData.avatar_url" @upload="updateProfile" size="10"/>
        <label class="block">
          <span class="block">Email</span>
          <input class="w-full md:w-96 border border-gray-300 rounded-md px-4 py-2 mb-4" type="email"
                 v-model="auth.sessionData.user.email" disabled>
        </label>
        <label class="block">
          <span class="block">Username</span>
          <input class="w-full md:w-96 border border-gray-300 rounded-md px-4 py-2 mb-4" type="text"
                 v-model="formData.username">
        </label>
        <label class="block">
          <span class="block">Full Name</span>
          <input class="w-full md:w-96 border border-gray-300 rounded-md px-4 py-2 mb-4" type="text"
                 v-model="formData.full_name">
        </label>
        <label class="block">
          <span class="block">Website</span>
          <input class="w-full md:w-96 border border-gray-300 rounded-md px-4 py-2 mb-4" type="text"
                 v-model="formData.website">
        </label>
        <div class="flex items-center justify-start gap-2">
          <button type="submit" class="bg-emerald-500 text-white px-4 py-2 rounded-md">Save</button>
          <div v-show="message" class="bg-emerald-600 text-white px-4 py-2 rounded text-center">
            {{ message }}
          </div>
        </div>
        <div @click="closeModal" class="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600">Close</div>
      </form>
    </div>
  </teleport>
</template>

<style scoped>

</style>