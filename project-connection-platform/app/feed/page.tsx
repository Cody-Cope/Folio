'use client'

import { useState } from 'react'
import { ProjectCard } from '@/components/project/project-card'
import { ProjectFeed } from '@/components/feed/project-feed'

export default function FeedPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <ProjectFeed />
    </div>
  )
}
