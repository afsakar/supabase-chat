<script setup>
import { ref, toRefs, watch } from 'vue'
import { supabase } from '@/supabase'

const prop = defineProps(['path', 'size'])
const { path, size } = toRefs(prop)

const src = ref('')

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(path.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
    console.error('Error downloading image: ', error.message)
  }
}

watch(path, () => {
  if (path.value) downloadImage()
})
</script>

<template>
  <div>
    <img
        v-if="src"
        :src="src"
        alt="Avatar"
        class="avatar image"
        :style="{ height: size + 'em', width: size + 'em' }"
    />
    <div v-else class="avatar no-image" :style="{ height: size + 'em', width: size + 'em' }" />
  </div>
</template>