/**
 * Type definitions for the project collaboration app
 */

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  createdAt: Date
}

export interface Role {
  id: string
  title: string
  description?: string
  filled?: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  image?: string
  coverUrl?: string
  authorId: string
  author?: User
  tags: string[]
  roles: Role[]
  createdAt: Date
  updatedAt: Date
  members?: User[]
  memberCount: number
}

export interface JoinRequest {
  id: string
  projectId: string
  userId: string
  user?: User
  roleId?: string
  role?: Role
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

/** @deprecated Use JoinRequest */
export interface ProjectRequest extends JoinRequest {}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  token?: string
}
