import { createError } from 'h3'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const postData = await readBody(event)

  if (!postData) {
    throw createError({ statusMessage: 'Invalid post data' })
  }

  const { data, error } = await client
    .from('resources')
    .insert([postData])
    .select()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true, data }
})
