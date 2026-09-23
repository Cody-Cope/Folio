import { type NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // TODO: return authenticated user profile from database
  return NextResponse.json({
    id: 'user-1',
    name: 'Alex Rivera',
    bio: 'Full-stack developer building at the intersection of AI and productivity.',
    location: 'San Francisco, CA',
    website: 'https://alexrivera.dev',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML'],
    avatar: '',
    joinedAt: '2024-01-15T00:00:00.000Z',
  })
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, bio, location, website, skills, avatar } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }
    if (bio && bio.length > 200) {
      return NextResponse.json({ error: 'Bio must be 200 characters or fewer.' }, { status: 400 })
    }
    if (skills && (!Array.isArray(skills) || skills.length > 10)) {
      return NextResponse.json({ error: 'Maximum 10 skills allowed.' }, { status: 400 })
    }

    // TODO: persist to database, scoped to authenticated user

    return NextResponse.json({
      success: true,
      data: { name: name.trim(), bio, location, website, skills, avatar },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 400 })
  }
}
