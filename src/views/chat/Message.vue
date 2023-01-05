<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {supabase} from "@/supabase.js";
import ProfileImage from "@/views/chat/ProfileImage.vue";

const props = defineProps({
  personal: Boolean,
  username: String,
  text: String,
  timestamp: String
})

const user = ref(null);
const avatar = ref(null);

onMounted(async () => {
  await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', props.username)
      .single()
      .then(({data, error}) => {
        user.value = data.username ? data.username : props.username;
        avatar.value = data.avatar_url ? data.avatar_url : `https://avatars.dicebear.com/api/bottts/${props.username}.svg`;
      })
})

const messageHour = computed(() => {
  return new Date(props.timestamp).toLocaleTimeString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
  });
})
</script>

<template>
  <!-- Other -->
  <div v-if="!personal" class="flex w-full mt-2 space-x-3 max-w-xs">
    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
      <ProfileImage v-model:path="avatar" />
    </div>
    <div>
      <span class="font-bold text-sm">{{ user }}</span>
      <div class="bg-blue-600 text-white p-3 rounded-r-lg rounded-bl-lg">
        <p class="text-sm">{{ text }}</p>
      </div>
      <span class="text-xs text-gray-500 leading-none">{{ messageHour }}</span>
    </div>
  </div>
  <!-- Current -->
  <div v-else class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
    <div>
      <div class="bg-emerald-600 text-white p-3 rounded-l-lg rounded-br-lg">
        <p class="text-sm">{{ text }}</p>
      </div>
      <span class="text-xs text-gray-500 leading-none">{{ messageHour }}</span>
    </div>
    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
      <ProfileImage v-model:path="avatar" />
    </div>
  </div>
</template>
