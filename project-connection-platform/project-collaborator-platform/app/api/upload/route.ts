import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 },
      )
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image must be smaller than 8MB' },
        { status: 400 },
      )
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const key = `${user.id}/${crypto.randomUUID()}.${ext}`

    const blob = await put(key, file, {
      access: 'private',
      contentType: file.type,
    })

    // Return the pathname; images are served through /api/file.
    return NextResponse.json({ pathname: blob.pathname })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
