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

  ensureResourceExists(postData.id)

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
