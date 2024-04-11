<script setup lang="ts">
import type { Database } from '~/database.types'
const supabase = useSupabaseClient<Database>()

import mockjs from 'mockjs'

const loading = ref(false)

let { data: categories, error } = await supabase
  .from('categories')
  .select('*')

const randomCategory: {
  name: string,
  level: 1 | 2,
} = mockjs.mock({
  'name': '@ctitle(4, 8)',
  'level|1': [1],
})

async function addCategory() {
  loading.value = true
  try {
    const { data, error } = await supabase
    .from('categories')
    .insert([
      randomCategory,
    ])
    .select()

    console.log('addCategory-data', { data, error  })
  } catch (error) {} finally {
    loading.value = false
  }
}

console.log('categories', {
  randomCategory, categories, error
})
</script>

<template>
  <div>
    <p class="u-text-black">
      Tasks
    </p>
    <button @click="addCategory">
      {{ loading ? 'Loading...' : 'add a new category' }}
    </button>
  </div>
</template>
