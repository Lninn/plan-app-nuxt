import type { Database, Tables } from '~/database.types'

export default function useCategories() {
  const supabase = useSupabaseClient<Database>()

  const loading = ref(false)
  const categories = ref<Tables<'categories'>[]>([])

  async function queryCategories() {
    try {
      loading.value = true
      const { data } = await supabase
        .from('categories')
        .select('*')

      categories.value = data || []
    }
    catch (error) {
      console.log('error', error)
    }
    finally {
      loading.value = false
    }
  }

  onMounted(() => {
    queryCategories()
  })

  // 手动获取最新数据并更新
  async function refreshCategories() {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
      categories.value = data || []
    }
    catch (error) {
      console.log('error', error)
    }
  }

  return {
    loading,
    categories,
    refreshCategories,
  }
}
