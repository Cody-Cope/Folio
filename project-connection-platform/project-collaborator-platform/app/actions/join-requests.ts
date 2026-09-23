'use server'

import { db } from '@/lib/db'
import { joinRequests, projects, profiles } from '@/lib/db/schema'
import { ensureProfile, getSessionUser, getUserId } from '@/lib/session'
import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

/** Current user requests to join a project. */
export async function requestToJoin(projectId: number, message?: string) {
  const userId = await getUserId()
  await ensureProfile()

  const projectRows = await db
    .select({ id: projects.id, userId: projects.userId, status: projects.status })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1)

  const project = projectRows[0]
  if (!project) throw new Error('Project not found')
  if (project.userId === userId) throw new Error('You own this project')
  if (project.status !== 'open') throw new Error('This project is not accepting requests')

  // Upsert-style guard: don't allow duplicate requests.
  const existing = await db
    .select({ id: joinRequests.id })
    .from(joinRequests)
    .where(
      and(
        eq(joinRequests.projectId, projectId),
        eq(joinRequests.userId, userId),
      ),
    )
    .limit(1)

  if (existing.length > 0) throw new Error('You already requested to join')

  await db.insert(joinRequests).values({
    projectId,
    userId,
    ownerId: project.userId,
    message: message?.trim() || null,
  })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/requests')
}

/** Get the current user's join request status for a project, if any. */
export async function getMyRequestForProject(projectId: number) {
  const user = await getSessionUser()
  if (!user) return null
  const rows = await db
    .select()
    .from(joinRequests)
    .where(
      and(
        eq(joinRequests.projectId, projectId),
        eq(joinRequests.userId, user.id),
      ),
    )
    .limit(1)
  return rows[0] ?? null
}

/** Requests the current user has sent. */
export async function getSentRequests() {
  const userId = await getUserId()
  return db
    .select({
      id: joinRequests.id,
      status: joinRequests.status,
      message: joinRequests.message,
      createdAt: joinRequests.createdAt,
      projectId: projects.id,
      projectTitle: projects.title,
      projectCover: projects.coverImageUrl,
    })
    .from(joinRequests)
    .innerJoin(projects, eq(projects.id, joinRequests.projectId))
    .where(eq(joinRequests.userId, userId))
    .orderBy(desc(joinRequests.createdAt))
}

/** Requests received for the current user's projects. */
export async function getReceivedRequests() {
  const userId = await getUserId()
  return db
    .select({
      id: joinRequests.id,
      status: joinRequests.status,
      message: joinRequests.message,
      createdAt: joinRequests.createdAt,
      projectId: projects.id,
      projectTitle: projects.title,
      projectCover: projects.coverImageUrl,
      requesterName: profiles.displayName,
      requesterUsername: profiles.username,
      requesterAvatar: profiles.avatarUrl,
    })
    .from(joinRequests)
    .innerJoin(projects, eq(projects.id, joinRequests.projectId))
    .leftJoin(profiles, eq(profiles.userId, joinRequests.userId))
    .where(eq(joinRequests.ownerId, userId))
    .orderBy(desc(joinRequests.createdAt))
}

/** Owner accepts or declines a join request. */
export async function respondToRequest(
  requestId: number,
  status: 'accepted' | 'declined',
) {
  const userId = await getUserId()
  await db
    .update(joinRequests)
    .set({ status })
    .where(
      and(eq(joinRequests.id, requestId), eq(joinRequests.ownerId, userId)),
    )
  revalidatePath('/requests')
}
