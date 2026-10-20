
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HeartHandshake,
  LayoutDashboard,
  FileText,
  UserRound,
  LogOut,
  Clock,
  ShieldCheck,
  Send,
  CircleCheck,
  Wallet,
  IdCard,
  Plus,
  Trash2,
  CheckCircle,
  CircleX,
} from 'lucide-react'
import { supabase } from './supabase'

const initialForm = {
  full_name: '',
  phone: '',
  ssn: '',
  payment_method: 'bank_transfer',
  bank_name: '',
  account_name: '',
  account_number: '',
  check_recipient: '',
  mailing_address: '',
  program_name: 'Emergency Assistance',
  requested_amount: '',
  purpose: '',
}

const statusDetails = {
  draft: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-700',
    icon: FileText,
  },
  submitted: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800',
    icon: Clock,
  },
  under_review: {
    label: 'Processing',
    className: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800',
    icon: CircleX,
  },
}

function getStatusDetails(status) {
  return statusDetails[status] || {
    label: status || 'Pending',
    className: 'bg-slate-100 text-slate-700',
    icon: Clock,
  }
}

export default function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [applications, setApplications] = useState([])
  const [form, setForm] = useState(initialForm)
  const [idFiles, setIdFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (!active) return

      if (authError || !currentUser) {
        navigate('/login')
        return
      }

      setUser(currentUser)

      const { data, error: applicationError } = await supabase
        .from('grant_applications')
        .select('*')
        .eq('applicant_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (!active) return

      if (applicationError) {
        setError(applicationError.message)
      } else {
        setApplications(data || [])
      }

      setLoading(false)
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [navigate])

  function updateField(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  function handleFiles(event) {
    const selected = Array.from(event.target.files || [])
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (selected.some((file) => !allowedTypes.includes(file.type))) {
      setError('Choose JPG, PNG, or WebP image files.')
      event.target.value = ''
      return
    }

    if (selected.some((file) => file.size > 5 * 1024 * 1024)) {
      setError('Each image must be 5 MB or smaller.')
      event.target.value = ''
      return
    }

    if (selected.length + idFiles.length > 10) {
      setError('You can upload up to 10 images.')
      event.target.value = ''
      return
    }

    setError('')
    setIdFiles((previous) => [...previous, ...selected])
    event.target.value = ''
  }

  function removeFile(index) {
    setIdFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index),
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!user) {
      setError('Please sign in again.')
      return
    }

    if (!form.full_name.trim() || !form.phone.trim()) {
      setError('Enter your full name and phone number.')
      return
    }

    if (!form.purpose.trim()) {
      setError('Explain why you are applying for assistance.')
      return
    }

    if (
      form.payment_method === 'bank_transfer' &&
      (!form.bank_name.trim() ||
        !form.account_name.trim() ||
        !form.account_number.trim())
    ) {
      setError('Complete the bank payment details.')
      return
    }

    if (
      form.payment_method === 'mailed_check' &&
      (!form.check_recipient.trim() || !form.mailing_address.trim())
    ) {
      setError('Complete the cheque recipient and mailing address.')
      return
    }

    setSubmitting(true)

    try {
      const amount = Number(form.requested_amount)

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Enter a valid requested amount.')
      }

      const { data: application, error: applicationError } =
        await supabase
          .from('grant_applications')
          .insert({
            applicant_id: user.id,
            program_name: form.program_name,
            requested_amount: amount,
            purpose: form.purpose.trim(),
            status: 'submitted',
          })
          .select()
          .single()

      if (applicationError) throw applicationError

      const { error: detailsError } = await supabase
        .from('applicant_private_details')
        .insert({
          application_id: application.id,
          applicant_id: user.id,
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          test_ssn: form.ssn.trim() || null,
          payment_method: form.payment_method,
          bank_name:
            form.payment_method === 'bank_transfer'
              ? form.bank_name.trim()
              : null,
          account_name:
            form.payment_method === 'bank_transfer'
              ? form.account_name.trim()
              : null,
          account_number:
            form.payment_method === 'bank_transfer'
              ? form.account_number.trim()
              : null,
          check_recipient:
            form.payment_method === 'mailed_check'
              ? form.check_recipient.trim()
              : null,
          mailing_address:
            form.payment_method === 'mailed_check'
              ? form.mailing_address.trim()
              : null,
        })

      if (detailsError) throw detailsError

      const uploadedPaths = []

      for (const file of idFiles) {
        const extension =
          file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path =
          `${user.id}/${application.id}/` +
          `${crypto.randomUUID()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('applicant-id-cards')
          .upload(path, file, {
            upsert: false,
            contentType: file.type,
          })

        if (uploadError) throw uploadError

        uploadedPaths.push(path)
      }

      if (uploadedPaths.length > 0) {
        const { error: pathsError } = await supabase
          .from('applicant_private_details')
          .update({ id_card_paths: uploadedPaths })
          .eq('application_id', application.id)
          .eq('applicant_id', user.id)

        if (pathsError) throw pathsError
      }

      setApplications((previous) => [application, ...previous])
      setForm(initialForm)
      setIdFiles([])
      setMessage('Your application was submitted successfully.')
    } catch (submitError) {
      setError(
        submitError?.message ||
          'Unable to submit your application. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="bg-emerald-100 p-2 rounded-xl">
              <HeartHandshake className="text-emerald-700" size={26} />
            </span>
            <span className="text-xl font-bold text-slate-900">
              HopeForward
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-slate-500">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-50"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="space-y-2">
          <div className="bg-white border rounded-2xl p-5 mb-5">
            <div className="bg-emerald-100 rounded-xl w-12 h-12 flex items-center justify-center mb-3">
              <UserRound className="text-emerald-700" />
            </div>
            <h2 className="font-bold">Applicant account</h2>
            <p className="text-sm text-slate-500 break-all mt-1">
              {user?.email}
            </p>
          </div>

          <div className="bg-emerald-50 text-emerald-800 rounded-xl px-4 py-3 flex items-center gap-3">
            <LayoutDashboard size={18} />
            Dashboard
          </div>

          <a
            href="#applications"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white"
          >
            <FileText size={18} />
            My applications
          </a>

          <a
            href="#new-application"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white"
          >
            <Plus size={18} />
            New application
          </a>
        </aside>

        <main className="space-y-8">
          <section>
            <p className="text-emerald-700 font-semibold text-sm">
              APPLICANT DASHBOARD
            </p>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">
              Welcome to HopeForward
            </h1>
            <p className="text-slate-600 mt-2">
              Apply for assistance and keep track of your applications.
            </p>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex gap-2">
              <CircleCheck size={20} />
              {message}
            </div>
          )}

          <section
            id="applications"
            className="bg-white border rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <FileText className="text-emerald-700" />
              <h2 className="text-xl font-bold">My applications</h2>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText
                  className="mx-auto text-slate-300 mb-3"
                  size={38}
                />
                <p className="font-medium">No applications yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Complete the form below to submit your first application.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => {
                  const status = getStatusDetails(application.status)
                  const StatusIcon = status.icon

                  return (
                    <div
                      key={application.id}
                      className="border rounded-xl p-4 flex flex-wrap justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-semibold">
                          {application.program_name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Requested amount:{' '}
                          {Number(
                            application.requested_amount || 0,
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Submitted:{' '}
                          {application.created_at
                            ? new Date(
                                application.created_at,
                              ).toLocaleDateString()
                            : 'Recently'}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 h-fit rounded-full px-3 py-1 text-sm ${status.className}`}
                      >
                        <StatusIcon size={15} />
                        {status.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section
            id="new-application"
            className="bg-white border rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Send className="text-emerald-700" />
              <h2 className="text-xl font-bold">New grant application</h2>
            </div>
            <p className="text-slate-500 text-sm mb-7">
              Complete the form and submit your application for review.
            </p>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <h3 className="font-bold mb-4">Application details</h3>

                <div className="grid md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="block text-sm font-medium mb-2">
                      Assistance programme
                    </span>
                    <select
                      name="program_name"
                      value={form.program_name}
                      onChange={updateField}
                      className="w-full border rounded-xl px-3 py-3 bg-white"
                      required
                    >
                      <option>Emergency Assistance</option>
                      <option>Food Assistance</option>
                      <option>Housing Support</option>
                      <option>Medical Assistance</option>
                      <option>Education Support</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium mb-2">
                      Amount requested
                    </span>
                    <input
                      type="number"
                      name="requested_amount"
                      value={form.requested_amount}
                      onChange={updateField}
                      min="1"
                      step="0.01"
                      className="w-full border rounded-xl px-3 py-3"
                      placeholder="Enter amount"
                      required
                    />
                  </label>
                </div>

                <label className="block mt-5">
                  <span className="block text-sm font-medium mb-2">
                    Why are you applying?
                  </span>
                  <textarea
                    name="purpose"
                    value={form.purpose}
                    onChange={updateField}
                    rows="4"
                    className="w-full border rounded-xl px-3 py-3"
                    placeholder="Describe the assistance you need"
                    required
                  />
                </label>
              </div>

              <hr />

              <div>
                <h3 className="font-bold mb-4">Applicant information</h3>

                <div className="grid md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="block text-sm font-medium mb-2">
                      Full name
                    </span>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={updateField}
                      className="w-full border rounded-xl px-3 py-3"
                      placeholder="Full name"
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium mb-2">
                      Phone number
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={updateField}
                      className="w-full border rounded-xl px-3 py-3"
                      placeholder="Phone number"
                      autoComplete="tel"
                      required
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="block text-sm font-medium mb-2">
                      SSN
                    </span>
                    <input
                      name="ssn"
                      value={form.ssn}
                      onChange={updateField}
                      className="w-full border rounded-xl px-3 py-3"
                      placeholder="Enter ssn "
                      autoComplete="off"
                    />
                  </label>
                </div>
              </div>

              <hr />

              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Wallet size={20} className="text-emerald-700" />
                  Payment details
                </h3>

                <div className="flex flex-wrap gap-5 mb-5">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank_transfer"
                      checked={form.payment_method === 'bank_transfer'}
                      onChange={updateField}
                    />
                    Bank transfer
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="mailed_check"
                      checked={form.payment_method === 'mailed_check'}
                      onChange={updateField}
                    />
                    Mailed cheque
                  </label>
                </div>

                {form.payment_method === 'bank_transfer' ? (
                  <div className="grid md:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="block text-sm font-medium mb-2">
                        Bank name
                      </span>
                      <input
                        name="bank_name"
                        value={form.bank_name}
                        onChange={updateField}
                        className="w-full border rounded-xl px-3 py-3"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-medium mb-2">
                        Account name
                      </span>
                      <input
                        name="account_name"
                        value={form.account_name}
                        onChange={updateField}
                        className="w-full border rounded-xl px-3 py-3"
                        required
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="block text-sm font-medium mb-2">
                        Account number
                      </span>
                      <input
                        name="account_number"
                        value={form.account_number}
                        onChange={updateField}
                        className="w-full border rounded-xl px-3 py-3"
                        inputMode="numeric"
                        required
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <label className="block">
                      <span className="block text-sm font-medium mb-2">
                        Cheque recipient
                      </span>
                      <input
                        name="check_recipient"
                        value={form.check_recipient}
                        onChange={updateField}
                        className="w-full border rounded-xl px-3 py-3"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="block text-sm font-medium mb-2">
                        Mailing address
                      </span>
                      <textarea
                        name="mailing_address"
                        value={form.mailing_address}
                        onChange={updateField}
                        rows="3"
                        className="w-full border rounded-xl px-3 py-3"
                        required
                      />
                    </label>
                  </div>
                )}
              </div>

              <hr />

              <div>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <IdCard size={20} className="text-emerald-700" />
                  ID card images
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Select JPG, PNG, or WebP images. Maximum 10 files,
                  5 MB per file.
                </p>

                <label className="flex cursor-pointer items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 hover:bg-slate-50">
                  <Plus size={20} />
                  Choose image files
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFiles}
                    className="sr-only"
                  />
                </label>

                {idFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {idFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-3 border rounded-lg p-3"
                      >
                        <span className="text-sm truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Remove ${file.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto bg-emerald-700 text-white rounded-xl px-7 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-800 disabled:opacity-60"
              >
                <Send size={18} />
                {submitting ? 'Submitting...' : 'Submit application'}
              </button>
            </form>
          </section>

          <footer className="text-center text-sm text-slate-400 pb-5">
            <ShieldCheck size={16} className="inline mr-1" />
            HopeForward applicant portal
          </footer>
        </main>
      </div>
    </div>
  )
}
