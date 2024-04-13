import { createError } from 'h3'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const postParams = await readBody(event)

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

  if (!postParams.id) {
    throw createError({ statusMessage: 'id is required', statusCode: 400 })
  }
  const queryId = Number(postParams.id)
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

  const { data, error } = await client
    .from('categories')
    .update({ name: postParams.name })
    .eq('id', queryId)
    .select()

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { ok: true, data }
})
