import type { Database, Tables } from '~/database.types'

export default function useCategories() {
  const supabase = useSupabaseClient<Database>()

  const loading = ref(false)
  const categories = ref<Tables<'categories'>[]>([])

  async function queryCategories() {
    try {
      loading.value = true
      let { data } = await supabase
        .from('categories')
        .select('*')
    
      categories.value = data || [];
    } catch (error) {
      console.log('error', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    queryCategories();
  });

  return {
    loading,
    categories,
  }
 }
