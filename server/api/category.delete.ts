import { createError } from 'h3'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const query = getQuery(event)

  async function findCategoryById(id: number) {
    const { data: category, error } = await client
      .from('categories')
      .select('*')
      .eq('id', id)

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return category
  }

  async function deleteCategory(id: number) {
    const { data, error } = await client.from('categories').delete().eq(
      'id',
      id,
    )
    if (error) {
      throw createError({ statusMessage: error.message })
    }
    return data
  }

  if (!query.id) {
    throw createError({ statusMessage: 'id is required', statusCode: 400 })
  }
  const queryId = Number(query.id)
  if (!Number.isInteger(queryId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }

  const category = await findCategoryById(queryId)
  if (!category || category.length === 0) {
    throw createError({ statusMessage: `category ${queryId} not found.`, statusCode: 404 })
  }

  if (category[0].level === 2) {
    const deleteResult = await deleteCategory(queryId)

    return { ok: true, data: deleteResult }
  }

  // 删除一级分类时，需要删除其下的二级分类
  await client
    .from('categories')
    .delete()
    .eq('parent_id', queryId)

  await deleteCategory(queryId)

  return { ok: true }
})
