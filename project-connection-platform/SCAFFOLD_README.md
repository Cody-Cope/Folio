# Project Collaboration Platform - Scaffolding Guide

This is a prepared scaffolding structure for your project collaboration platform. All files are organized and ready for you to paste your existing code.

## Folder Structure

```
app/
  ├── feed/              # Main feed page
  ├── auth/              # Authentication page
  ├── profile/           # User profile page
  ├── projects/          # My projects list
  │   ├── create/        # Create project form
  │   └── [id]/          # Project detail view
  └── api/               # API routes
      └── auth/          # Auth endpoints
          ├── login
          └── signup
      └── projects/      # Project endpoints
          ├── route.ts   # GET all, POST create
          ├── [id]/      # Dynamic project routes
          │   ├── route.ts (GET, PUT, DELETE)
          │   └── join/   # Join project endpoint
          
components/
  ├── feed/              # Feed-related components
  ├── project/           # Project-related components
  ├── auth/              # Auth components
  ├── profile/           # Profile components
  └── ui/                # shadcn/ui components
  
lib/
  ├── types.ts           # TypeScript interfaces
  └── api.ts             # API utility functions
```

## How to Use

1. **Replace Component Files**: Open each component file in `components/` and paste your existing component code where indicated by the `/* Paste your... */` comments.

2. **Implement API Routes**: Update each file in `app/api/` with your actual backend logic. Comments indicate what needs to be implemented.

3. **Update Types**: Modify `lib/types.ts` to match your data structure if needed.

4. **Configure API Calls**: The `lib/api.ts` file contains utility functions for calling your API endpoints. Adjust as needed.

## Pages Overview

- **`/feed`** - Main Instagram-like feed showing all projects
- **`/auth`** - Login/signup page
- **`/profile`** - User profile page
- **`/projects`** - List of user's own projects
- **`/projects/create`** - Form to create a new project
- **`/projects/[id]`** - Detailed view of a specific project

## Component Locations

- `ProjectFeed` - Main feed component (`components/feed/project-feed.tsx`)
- `ProjectCard` - Individual project card for the feed (`components/project/project-card.tsx`)
- `AuthForm` - Login/signup form (`components/auth/auth-form.tsx`)
- `UserProfile` - User profile view (`components/profile/user-profile.tsx`)
- `MyProjects` - User's projects list (`components/project/my-projects.tsx`)
- `CreateProjectForm` - New project form (`components/project/create-project-form.tsx`)
- `ProjectDetail` - Project detail view (`components/project/project-detail.tsx`)

## Next Steps

1. Start replacing the placeholder components with your existing code
2. Implement the API routes with your backend logic
3. Set up authentication (choose your method: sessions, JWT, etc.)
4. Connect to a database (Neon, Supabase, etc.)
5. Style components to match your Instagram-like design

Good luck! 🚀
