import type { CascaderOption } from 'element-plus'
import type { Database, Tables } from '~/database.types'

interface NestedCategory {
  id: number
  name: string
  level: number
  createdAt: string
  children?: NestedCategory[]
}

function convertToNestedList<T extends { children?: T[] }>(
  items: Tables<'categories'>[],
  transform: (item: Tables<'categories'>) => T,
): T[] {
  const map: Record<number, T> = {}

  for (const item of items) {
    if (item.parent_id === null) {
      map[item.id] = {
        ...transform(item),
        children: [],
      }
    }
    else {
      const parent = map[item.parent_id]
      if (parent) {
        parent.children?.push(
          transform(item),
        )
      }
      else {
        items.push(item)
      }
    }
  }

  return Object.values(map)
}

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

  const nestedCategories = computed(() => {
    return convertToNestedList<NestedCategory>(
      categories.value,
      item => ({
        id: item.id,
        name: item.name,
        level: item.level,
        createdAt: item.created_at,
      }),
    )
  })

  const cascadeCategories = computed(() => {
    return convertToNestedList<CascaderOption>(
      categories.value,
      item => ({
        value: item.id,
        label: item.name,
      }),
    )
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
    nestedCategories,
    cascaderCategories: cascadeCategories,
    refreshCategories,
  }
}
