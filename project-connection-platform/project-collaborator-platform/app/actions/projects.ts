'use server'

import { db } from '@/lib/db'
import { projects, profiles, joinRequests } from '@/lib/db/schema'
import { ensureProfile, getUserId, getSessionUser } from '@/lib/session'
import { and, desc, eq, ilike, or, sql, count } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { CATEGORY_ALL } from '@/lib/constants'

export type FeedProject = {
  id: number
  title: string
  summary: string
  category: string
  tags: string[]
  lookingFor: string | null
  coverImageUrl: string
  status: string
  createdAt: Date
  authorName: string
  authorUsername: string | null
  authorAvatarUrl: string | null
}

type FeedFilters = {
  search?: string
  category?: string
}

/** Public: list projects for the discovery feed with optional search/filter. */
export async function getFeed(filters: FeedFilters = {}): Promise<FeedProject[]> {
  const conditions = []

  if (filters.category && filters.category !== CATEGORY_ALL) {
    conditions.push(eq(projects.category, filters.category))
  }

  if (filters.search && filters.search.trim()) {
    const q = `%${filters.search.trim()}%`
    conditions.push(
      or(
        ilike(projects.title, q),
        ilike(projects.summary, q),
        sql`array_to_string(${projects.tags}, ',') ILIKE ${q}`,
      ),
    )
  }

  const rows = await db
    .select({
      id: projects.id,
      title: projects.title,
      summary: projects.summary,
      category: projects.category,
      tags: projects.tags,
      lookingFor: projects.lookingFor,
      coverImageUrl: projects.coverImageUrl,
      status: projects.status,
      createdAt: projects.createdAt,
      authorName: profiles.displayName,
      authorUsername: profiles.username,
      authorAvatarUrl: profiles.avatarUrl,
    })
    .from(projects)
    .leftJoin(profiles, eq(profiles.userId, projects.userId))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(projects.createdAt))
    .limit(60)

  return rows.map((r) => ({
    ...r,
    authorName: r.authorName ?? 'Unknown',
  }))
}

/** Public: full project detail plus author info. */
export async function getProjectById(id: number) {
  const rows = await db
    .select({
      id: projects.id,
      userId: projects.userId,
      title: projects.title,
      summary: projects.summary,
      description: projects.description,
      category: projects.category,
      tags: projects.tags,
      lookingFor: projects.lookingFor,
      coverImageUrl: projects.coverImageUrl,
      status: projects.status,
      createdAt: projects.createdAt,
      authorName: profiles.displayName,
      authorUsername: profiles.username,
      authorAvatarUrl: profiles.avatarUrl,
      authorBio: profiles.bio,
    })
    .from(projects)
    .leftJoin(profiles, eq(profiles.userId, projects.userId))
    .where(eq(projects.id, id))
    .limit(1)

  return rows[0] ?? null
}

/** Public: all projects by a given username. */
export async function getProjectsByUsername(username: string) {
  const profileRows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1)

  const profile = profileRows[0]
  if (!profile) return null

  const projectRows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, profile.userId))
    .orderBy(desc(projects.createdAt))

  return { profile, projects: projectRows }
}

export type CreateProjectInput = {
  title: string
  summary: string
  description?: string
  category: string
  tags: string[]
  lookingFor?: string
  coverImageUrl: string
}

/** Create a new project owned by the current user. */
export async function createProject(input: CreateProjectInput) {
  const userId = await getUserId()
  await ensureProfile()

  if (!input.title?.trim()) throw new Error('Title is required')
  if (!input.summary?.trim()) throw new Error('Summary is required')
  if (!input.category?.trim()) throw new Error('Category is required')
  if (!input.coverImageUrl?.trim()) throw new Error('Cover image is required')

  const inserted = await db
    .insert(projects)
    .values({
      userId,
      title: input.title.trim(),
      summary: input.summary.trim(),
      description: input.description?.trim() || null,
      category: input.category,
      tags: input.tags.slice(0, 8),
      lookingFor: input.lookingFor?.trim() || null,
      coverImageUrl: input.coverImageUrl,
    })
    .returning({ id: projects.id })

  revalidatePath('/')
  return inserted[0].id
}

/** Delete a project owned by the current user (also removes its join requests). */
export async function deleteProject(id: number) {
  const userId = await getUserId()
  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
  await db.delete(joinRequests).where(eq(joinRequests.projectId, id))
  revalidatePath('/')
}

/** Toggle a project between open and closed (owner only). */
export async function setProjectStatus(id: number, status: 'open' | 'closed') {
  const userId = await getUserId()
  await db
    .update(projects)
    .set({ status })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
  revalidatePath(`/projects/${id}`)
}

/** Count of open join requests for the current user's projects (for nav badge). */
export async function getIncomingRequestCount(): Promise<number> {
  const user = await getSessionUser()
  if (!user) return 0
  const rows = await db
    .select({ value: count() })
    .from(joinRequests)
    .where(
      and(
        eq(joinRequests.ownerId, user.id),
        eq(joinRequests.status, 'pending'),
      ),
    )
  return rows[0]?.value ?? 0
}
