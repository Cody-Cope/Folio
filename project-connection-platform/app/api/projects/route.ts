import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/projects - Get all projects
 * POST /api/projects - Create a new project
 */

export async function GET(request: NextRequest) {
  try {
    // Paste your get all projects logic here
    // TODO: Query database for all projects with filters, pagination

    return NextResponse.json(
      {
        success: true,
        data: [],
        message: 'GET /api/projects - add your logic here',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, tags, roles, coverUrl } = body

    if (!title?.trim()) {
      return NextResponse.json({ success: false, message: 'Title is required.' }, { status: 400 })
    }
    if (!description?.trim()) {
      return NextResponse.json({ success: false, message: 'Description is required.' }, { status: 400 })
    }

    // TODO: persist to database, associate with authenticated user
    const project = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      tags: Array.isArray(tags) ? tags : [],
      roles: Array.isArray(roles) ? roles : [],
      coverUrl: coverUrl ?? null,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create project' },
      { status: 400 }
    )
  }
}
