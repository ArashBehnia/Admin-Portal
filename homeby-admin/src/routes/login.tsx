import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login('demo-token', 'superadmin', 'Admin User')
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-page">
      <div className="bg-card p-8 rounded-lg shadow-sm border border-border w-96">
        <h1 className="text-2xl font-bold text-text mb-6 text-center">HomeBy Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-border rounded-md px-3 h-form" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-border rounded-md px-3 h-form" required />
          </div>
          <button type="submit" className="w-full bg-accent text-white h-form rounded-md font-medium hover:bg-blue-700 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
