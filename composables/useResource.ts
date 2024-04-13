import mockjs from 'mockjs'
import type { Database, Tables } from '~/database.types'

function createRandomResource() {
  const data = mockjs.mock({
    'list|10': [{
      'id|+1': 1,
      'name': '@cname',
      'age|18-25': 0,
      'address': '@county(true)',
      'date': '@datetime',
      'isMale': '@boolean',
      'isVip': '@boolean',
      'isAdmin': '@boolean',
      'isSuperAdmin': '@boolean',
      'isDeleted': '@boolean',
      'isDisabled': '@boolean',
      'isLocked': '@boolean',
      'isOnline': '@boolean',
    }],
  })

  return data.list
}

export default function useCategories({ random }: { random: boolean }) {
  const supabase = useSupabaseClient<Database>()

  const loading = ref(false)
  const resources = ref<Tables<'resources'>[]>([])

  const randomResource = createRandomResource()

  async function queryResources() {
    try {
      loading.value = true
      const { data } = await supabase
        .from('resources')
        .select('*')

      resources.value = data || []
    }
    catch (error) {
      console.log('error', error)
    }
    finally {
      loading.value = false
    }
  }

  onMounted(() => {
    queryResources()
  })

  return {
    loading,
    resources: random ? randomResource : resources,
    mutate: () => queryResources(),
  }
}
