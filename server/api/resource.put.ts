import { createError } from 'h3'
import type { Database, Tables } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const postData = await readBody(event)

  const updateData = getUpdateData(postData)

  async function ensureResourceExists(id: number) {
    const { data, error } = await client.from('resources').select().eq('id', id)
    if (error) {
      throw createError({ statusMessage: error.message })
    }

    if (!data || data.length === 0) {
      throw createError({ statusMessage: `resource ${postData.id} not found.` })
    }
  }

  // 分类信息处理
  async function ensureCategoryExists(categories: number[] | null) {
    if (!categories || Array.isArray(categories) === false) {
      throw createError({ statusMessage: 'categories filed is required.' })
    }

    const [firstCategory, secondCategory] = categories
    if (firstCategory) {
      const { data, error } = await client
        .from('categories')
        .select()
        .eq('id', firstCategory)
        .eq('level', 1)

      if (error) {
        throw createError({ statusMessage: error.message })
      }
      if (!data || data.length === 0) {
        throw createError({ statusMessage: `category ${firstCategory} not found.` })
      }
    }
    if (secondCategory) {
      const { data, error } = await client
        .from('categories')
        .select()
        .eq('id', secondCategory)
        .eq('parent_id', firstCategory)
        .eq('level', 2)

      if (error) {
        throw createError({ statusMessage: error.message })
      }
      if (!data || data.length === 0) {
        throw createError({ statusMessage: `category ${secondCategory} not found.` })
      }
    }
  }

  await ensureResourceExists(postData.id)
  await ensureCategoryExists(postData.categories)

  const { data, error } = await client
    .from('resources')
    .update(updateData)
    .eq('id', postData.id)
    .select()
    .single()

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { ok: true, data }
})

function getUpdateData(postData: Tables<'resources'> | null) {
  if (!postData) {
    throw createError({ statusMessage: 'data filed is required.' })
  }

  if (!Number.isInteger(postData.id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }

  const {
    name,
    icon,
    label,
    categories,
  } = postData

  return {
    name,
    icon,
    label,
    categories,
  }
}
