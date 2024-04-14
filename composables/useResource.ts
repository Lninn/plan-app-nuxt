import mockjs from 'mockjs'
import { FetchError } from 'ofetch'
import type { Tables } from '~/database.types'

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

export default function useResource({ random }: { random: boolean }) {
  const loading = ref(false)
  const resources = ref<Tables<'resources'>[]>([])

  const randomResource = createRandomResource()

  async function queryResources() {
    try {
      loading.value = true
      const queryRes = await $fetch('/api/resource', {
        method: 'GET',
        params: {
          orderBy: 'created_at',
          orderType: 'desc',
        },
      })

      if (queryRes.ok) {
        resources.value = queryRes.data || []
      }
    }
    catch (error) {
      if (error instanceof FetchError) {
        ElMessage.error(error.statusMessage)
      }
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
    mutate: async () => queryResources(),
  }
}
