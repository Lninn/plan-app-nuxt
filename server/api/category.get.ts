import { createError } from 'h3'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const query = getQuery(event)

  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('name', query.name as string)

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { ok: true, query, data }
})
