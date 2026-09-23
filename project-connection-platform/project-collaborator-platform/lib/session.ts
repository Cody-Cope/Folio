import 'server-only'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export type SessionUser = {
  id: string
  name: string
  email: string
  image?: string | null
}

/** Returns the current session user, or null if not signed in. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user as SessionUser
}

/** Returns the current user id, throwing if not signed in. */
export async function getUserId(): Promise<string> {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

function slugifyUsername(base: string): string {
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20)
  return cleaned || 'user'
}

/**
 * Ensures the signed-in user has a profile row, creating one lazily on first
 * access. Returns the profile. Throws if not signed in.
 */
export async function ensureProfile() {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')

  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1)

  if (existing.length > 0) return existing[0]

  // Generate a unique username from the email local part.
  const base = slugifyUsername(user.email.split('@')[0] ?? user.name)
  let username = base
  let suffix = 0
  // Loop until we find a free username. Bounded to avoid infinite loops.
  while (suffix < 1000) {
    const taken = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.username, username))
      .limit(1)
    if (taken.length === 0) break
    suffix += 1
    username = `${base}${suffix}`
  }

  const inserted = await db
    .insert(profiles)
    .values({
      userId: user.id,
      username,
      displayName: user.name || base,
      avatarUrl: user.image ?? null,
    })
    .returning()

  return inserted[0]
}

/** Returns a profile by userId, or null. */
export async function getProfileByUserId(userId: string) {
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1)
  return rows[0] ?? null
}
