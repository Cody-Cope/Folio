'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * My projects component for showing user's own projects
 * Replace with your existing code
 */
export function MyProjects() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Button>Create Project</Button>
      </div>
      <div className="grid gap-4" />
    </div>
  )
}
