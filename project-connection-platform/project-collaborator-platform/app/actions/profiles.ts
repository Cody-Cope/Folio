'use server'

import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { ensureProfile, getUserId } from '@/lib/session'
import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

/** Ensure a profile exists for the current user and return it. */
export async function getOrCreateMyProfile() {
  return ensureProfile()
}

export type UpdateProfileInput = {
  displayName: string
  username: string
  bio?: string
  avatarUrl?: string | null
}

/** Update the current user's profile. */
export async function updateProfile(input: UpdateProfileInput) {
  const userId = await getUserId()
  await ensureProfile()

  const displayName = input.displayName.trim()
  const username = input.username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

  if (!displayName) throw new Error('Display name is required')
  if (!username || username.length < 3)
    throw new Error('Username must be at least 3 characters')

  // Ensure username is not taken by another user.
  const clash = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(and(eq(profiles.username, username), ne(profiles.userId, userId)))
    .limit(1)
  if (clash.length > 0) throw new Error('That username is taken')

  await db
    .update(profiles)
    .set({
      displayName,
      username,
      bio: input.bio?.trim() || null,
      avatarUrl: input.avatarUrl ?? null,
    })
    .where(eq(profiles.userId, userId))

  revalidatePath('/settings')
  revalidatePath(`/u/${username}`)
}
