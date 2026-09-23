import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { AuthShell } from '@/components/auth-shell'
import { AuthForm } from '@/components/auth-form'

export default async function SignUpPage() {
  const user = await getSessionUser()
  if (user) redirect('/')

  return (
    <AuthShell
      title="Join Collabr"
      subtitle="Create an account to share your project ideas and find collaborators."
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
  )
}
