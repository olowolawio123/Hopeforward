
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, LoaderCircle, XCircle } from 'lucide-react'
import { supabase } from './supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Verifying your email...')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function verifyEmail() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const tokenHash = params.get('token_hash')
      const type = params.get('type')
      const urlError = params.get('error_description')

      if (urlError) {
        if (active) {
          setError(urlError.replace(/\+/g, ' '))
          setMessage('')
        }
        return
      }

      let authError = null

      if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code)
        authError = result.error
      } else if (tokenHash && type) {
        const result = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        })
        authError = result.error
      } else {
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          if (active) {
            setMessage('Your email has been confirmed. You can now sign in.')
            window.setTimeout(() => {
              if (active) navigate('/login', { replace: true })
            }, 1800)
          }
          return
        }

        authError = new Error(
          'This confirmation link is invalid or has expired. Please request a new email.'
        )
      }

      if (!active) return

      if (authError) {
        setError(authError.message)
        setMessage('')
        return
      }

      setMessage('Your email has been confirmed. You can now sign in.')

      window.setTimeout(() => {
        if (active) navigate('/login', { replace: true })
      }, 1800)
    }

    verifyEmail().catch((err) => {
      if (active) {
        setError(err.message || 'Unable to verify your email. Please try again.')
        setMessage('')
      }
    })

    return () => {
      active = false
    }
  }, [navigate])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {error ? (
          <XCircle className="mx-auto mb-5 text-red-600" size={48} />
        ) : message ? (
          <CheckCircle className="mx-auto mb-5 text-emerald-600" size={48} />
        ) : (
          <LoaderCircle className="mx-auto mb-5 animate-spin text-blue-600" size={48} />
        )}

        <h1 className="text-2xl font-bold text-slate-900">
          Email Confirmation
        </h1>

        {message && (
          <p role="status" className="mt-4 text-slate-600">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <Link
          to="/login"
          className="mt-6 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Go to login
        </Link>
      </section>
    </main>
  )
}
