'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Authentication form component (login/signup)
 * Replace with your existing code
 */
export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Card className="w-full max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isLogin ? 'Login' : 'Sign Up'}
      </h1>
    </Card>
  )
}
