
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, CheckCircle, ArrowLeft } from 'lucide-react'
import { supabase } from './supabase'

export default function ResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function prepareReset() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const urlError = params.get('error_description')

      if (urlError) {
        throw new Error(urlError.replace(/\+/g, ' '))
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) throw error
      }

      const { data, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) throw sessionError

      if (!data.session) {
        throw new Error(
          'This reset link is invalid or has expired. Please request a new one.'
        )
      }

      if (active) setReady(true)
    }

    prepareReset().catch((err) => {
      if (active) {
        setError(err.message || 'Unable to verify the reset link.')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return

      if (event === 'PASSWORD_RECOVERY' && session) {
        setReady(true)
        setError('')
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 8) {
      setError('Your new password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setMessage('Your password has been changed successfully.')

      await supabase.auth.signOut()

      window.setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1800)
    } catch (err) {
      setError(err.message || 'Unable to update your password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} />
          Back to login
        </Link>

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <LockKeyhole size={28} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Create a new password
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Choose a new password for your HopeForward account.
        </p>

        {message ? (
          <div className="mt-7 rounded-xl bg-emerald-50 p-5 text-emerald-800">
            <CheckCircle className="mb-2" size={25} />
            <p className="font-semibold">{message}</p>
            <p className="mt-2 text-sm">Returning you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                disabled={!ready || loading}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                disabled={!ready || loading}
                placeholder="Enter your new password again"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 disabled:bg-slate-100"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!ready || loading}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Updating password...'
                : ready
                  ? 'Update password'
                  : 'Checking reset link...'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
