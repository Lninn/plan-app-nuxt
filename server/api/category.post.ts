import { createError } from 'h3'
import { requireAuth } from '../utils/auth'
import type { Database } from '~/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const client = await serverSupabaseClient<Database>(event)
  const newCategory = await readBody(event)

  async function findCategory(name: string, level: 1 | 2) {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .eq('level', level)
      .eq('name', name)

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return data
  }

  async function findCategoryById(id: number, level: 1 | 2) {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .eq('level', level)
      .eq('id', id)

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return data
  }

  if (!newCategory.name) {
    throw createError({ statusCode: 400, statusMessage: 'Missing category name' })
  }

  if (newCategory.level === 1) {
    const firstCategories = await findCategory(newCategory.name, 1)
    if (firstCategories && firstCategories.length > 0) {
      throw createError({ statusCode: 409, statusMessage: `Category ${newCategory.name} already exists` })
    }
  }
  else if (newCategory.level === 2) {
    if (!newCategory.parent_id) {
      throw createError({ statusCode: 400, statusMessage: 'Missing parent category id' })
    }

    const firstCategories = await findCategoryById(newCategory.parent_id, 1)
    if (!firstCategories || firstCategories.length === 0) {
      throw createError({ statusCode: 409, statusMessage: `Category ${newCategory.parent_id} not found` })
    }

    const secondCategories = await findCategory(newCategory.name, 2)
    if (secondCategories && secondCategories.length > 0) {
      const firstCategoryName = firstCategories[0].name
      throw createError({ statusCode: 409, statusMessage: `Category ${newCategory.name} already exists in category ${firstCategoryName}` })
    }
  }
  else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid category level' })
  }

  const { data, error } = await client
    .from('categories')
    .insert([newCategory])
    .select()

  if (error) {
    throw createError({ statusCode: Number(error.code), statusMessage: error.message })
  }

  return { ok: true, data }
})
