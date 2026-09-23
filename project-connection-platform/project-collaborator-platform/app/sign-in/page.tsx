import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { AuthShell } from '@/components/auth-shell'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const user = await getSessionUser()
  if (user) redirect('/')

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to post ideas and join projects."
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  )
}
