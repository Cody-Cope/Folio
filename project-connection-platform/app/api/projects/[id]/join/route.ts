import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/projects/[id]/join
 * Body: { roleId?: string, message: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { roleId, message } = body

    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'Please write at least 10 characters in your message.' },
        { status: 400 }
      )
    }

    if (message.trim().length > 500) {
      return NextResponse.json(
        { success: false, message: 'Message cannot exceed 500 characters.' },
        { status: 400 }
      )
    }

    // TODO: check authentication, verify project exists, prevent duplicate requests,
    // persist join request to database, notify project owner
    const joinRequest = {
      id: crypto.randomUUID(),
      projectId: id,
      roleId: roleId ?? null,
      message: message.trim(),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: joinRequest }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to send join request.' },
      { status: 400 }
    )
  }
}
