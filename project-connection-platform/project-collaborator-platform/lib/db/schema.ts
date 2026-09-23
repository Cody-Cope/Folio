import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Each app table carries a plain `userId` column for per-user scoping. No FK
// constraints so the schema stays easy to iterate on.

// One profile per user. `userId` mirrors the Better Auth user id.
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('displayName').notNull(),
  bio: text('bio'),
  avatarUrl: text('avatarUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Project ideas people post for others to discover and join.
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  tags: text('tags').array().notNull().default([]),
  lookingFor: text('lookingFor'),
  coverImageUrl: text('coverImageUrl').notNull(),
  status: text('status').notNull().default('open'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// A request from a user to join a project. `ownerId` denormalizes the project
// owner so the owner can query incoming requests without a join.
export const joinRequests = pgTable('join_requests', {
  id: serial('id').primaryKey(),
  projectId: integer('projectId').notNull(),
  userId: text('userId').notNull(),
  ownerId: text('ownerId').notNull(),
  message: text('message'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
