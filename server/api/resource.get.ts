import { createError } from 'h3'
import { requireAuth } from '../utils/auth'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const client = await serverSupabaseClient<Database>(event)
  const queryParams = getQuery<{ id: number, name: string, category: string, orderBy: string, orderType: 'desc' | 'asc' }>(event)

  const filterById = queryParams.id
  const filterByName = queryParams.name
  const filterByCategory = queryParams.category ?? ''

  const orderBy = queryParams.orderBy ?? 'created_at'
  const _orderType = queryParams.orderType ?? 'asc'
  const isAscending = _orderType === 'asc'

  const filterCategories = filterByCategory
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0)
    .map(c => parseInt(c))

  let query = client
    .from('resources')
    .select('*')

  if (filterById) {
    query = query.eq('id', filterById)
  }
  if (filterByName) {
    query = query.ilike('name', `%${filterByName}%`)
  }
  if (filterCategories.length > 0) {
    query = query.contains('categories', filterCategories)
  }

  query = query.order(orderBy, { ascending: isAscending })

  const { data, error } = await query

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { ok: true, data }
})
