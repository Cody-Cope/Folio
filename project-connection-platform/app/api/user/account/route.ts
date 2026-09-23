import { type NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    // Email update
    if (body.email !== undefined) {
      const { email } = body
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
      }
      // TODO: update email in database, re-send verification if needed
      return NextResponse.json({ success: true, message: 'Email updated.' })
    }

    // Password update
    if (body.newPassword !== undefined) {
      const { currentPassword, newPassword } = body
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required.' }, { status: 400 })
      }
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters.' },
          { status: 400 }
        )
      }
      // TODO: verify currentPassword against hash, update with new hash
      return NextResponse.json({ success: true, message: 'Password updated.' })
    }

    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Failed to update account.' }, { status: 400 })
  }
}

export async function DELETE() {
  // TODO: delete authenticated user and all their data
  return NextResponse.json({ success: true, message: 'Account deleted.' })
}
