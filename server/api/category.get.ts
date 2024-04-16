import { createError } from 'h3'
import { requireAuth } from '../utils/auth'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const client = await serverSupabaseClient<Database>(event)
  const queryParams = getQuery<{ id: number, name: string, level: 1 | 2 }>(event)

  const filterById = queryParams.id
  const filterByName = queryParams.name
  const filterByLevel = queryParams.level

  let query = client
    .from('categories')
    .select('*')

  if (filterById) {
    query = query.eq('id', filterById)
  }
  if (filterByName) {
    query = query.eq('name', filterByName)
  }
  if (filterByLevel) {
    query = query.eq('level', filterByLevel)
  }

  const { data, error } = await query

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { ok: true, data }
})
