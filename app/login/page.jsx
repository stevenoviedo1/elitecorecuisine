'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // If already logged in, go straight to orders
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/orders')
    }
  }, [status, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/orders')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-eliteRed">Elite Core Cuisine</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Staff Login</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-eliteRed dark:bg-gray-800 dark:border-gray-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-eliteRed dark:bg-gray-800 dark:border-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-eliteRed py-3.5 text-lg font-semibold text-white transition hover:bg-eliteGold hover:text-black disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="font-medium">Staff Access Only</p>
          <p className="text-xs mt-1 text-gray-400">Use credentials provided by the restaurant manager.</p>
          <p className="text-[10px] mt-2 text-gray-400">Owner = full revenue + controls • Worker = kitchen workflow</p>
          <p className="text-[10px] mt-1 text-gray-400">Public customers order directly from the homepage (no login needed).</p>
        </div>
      </div>
    </div>
  )
}