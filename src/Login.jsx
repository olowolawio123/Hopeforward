
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HeartHandshake,
  Mail,
  LockKeyhole,
} from 'lucide-react'
import { supabase } from './supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError) throw loginError

      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 text-xl font-bold text-slate-900"
        >
          <HeartHandshake className="text-blue-600" />
          HopeForward
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your applicant account.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="loginEmail"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-3">
                <Mail size={18} className="text-slate-400" />

                <input
                  id="loginEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full py-3 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="loginPassword"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-3">
                <LockKeyhole size={18} className="text-slate-400" />

                <input
                  id="loginPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full py-3 outline-none"
                  placeholder="Enter your password"
                />
              </div>

              <div className="mt-2 flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/apply"
              className="font-semibold text-blue-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
