import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

// type UnpackPromise<T extends Promise<unknown>> = T extends Promise<infer U> ? U : never
// type User = UnpackPromise<ReturnType<typeof serverSupabaseUser>>

export async function requireAuth(event: H3Event) {
  const user = await serverSupabaseUser(event)

  if (!user)
    throw createError({
      statusCode: 401,
      statusText: 'Unauthorized!',
    })

  return user
}
