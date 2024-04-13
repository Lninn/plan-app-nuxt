import { createError } from 'h3'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const queryParams = getQuery<{ id: string }>(event)

  if (!queryParams.id) {
    throw createError({ statusCode: 400, statusMessage: 'id is required' })
  }

  const queryIdList = queryParams.id.split(',').map(id => parseInt(id))

  const { data, error } = await client
    .from('resources')
    .delete()
    .in('id', queryIdList)

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { ok: true, data }
})
