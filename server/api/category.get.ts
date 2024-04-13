import { createError } from 'h3'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const queryParams = getQuery<{ id: number, name: string }>(event)

  const filterById = queryParams.id
  const filterByName = queryParams.name

  let query = client
    .from('categories')
    .select('*')

  if (filterById) {
    query = query.eq('id', filterById)
  }
  if (filterByName) {
    query = query.eq('name', filterByName)
  }

  const { data, error } = await query

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { ok: true, data }
})
