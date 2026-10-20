
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  UserRound,
  Wallet,
  IdCard,
  FileText,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { supabase } from './supabase'

const inputLabel = 'text-sm font-medium text-slate-500'
const valueClass = 'mt-1 font-medium text-slate-900 break-words'

const statusLabels = {
  draft: 'Draft',
  submitted: 'Pending',
  under_review: 'Processing',
  approved: 'Approved',
  rejected: 'Rejected',
}

const statusClasses = {
  draft: 'bg-slate-100 text-slate-700',
  submitted: 'bg-amber-100 text-amber-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function AdminApplicationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [privateDetails, setPrivateDetails] = useState(null)
  const [idImages, setIdImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadDetails = useCallback(async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError

      if (!user) {
        navigate('/login')
        return
      }

      const { data: roleRecord, error: roleError } =
        await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle()

      if (roleError) throw roleError

      if (!roleRecord) {
        throw new Error('You do not have administrator access.')
      }

      const { data: applicationData, error: applicationError } =
        await supabase
          .from('grant_applications')
          .select('*')
          .eq('id', id)
          .single()

      if (applicationError) throw applicationError

      const { data: detailsData, error: detailsError } =
        await supabase
          .from('applicant_private_details')
          .select(
            [
              'full_name',
              'phone',
              'test_ssn',
              'payment_method',
              'bank_name',
              'account_name',
              'account_number',
              'check_recipient',
              'mailing_address',
              'id_card_paths',
              'created_at',
            ].join(', ')
          )
          .eq('application_id', id)
          .maybeSingle()

      if (detailsError) throw detailsError

      setApplication(applicationData)
      setPrivateDetails(detailsData)

      const paths = detailsData?.id_card_paths || []
      const images = []

      for (const path of paths) {
        const { data, error: imageError } = await supabase.storage
          .from('applicant-id-cards')
          .createSignedUrl(path, 300)

        if (!imageError && data?.signedUrl) {
          images.push({
            path,
            url: data.signedUrl,
          })
        }
      }

      setIdImages(images)
    } catch (loadError) {
      setError(
        loadError?.message ||
          'Unable to load application details.'
      )
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    loadDetails()
  }, [loadDetails])

  async function updateStatus(newStatus) {
    if (!application || updating) return

    const label = statusLabels[newStatus] || newStatus

    const confirmed = window.confirm(
      `Are you sure you want to change this application to ${label}?`
    )

    if (!confirmed) return

    setUpdating(true)
    setError('')
    setMessage('')

    try {
      const { data, error: updateError } = await supabase
        .from('grant_applications')
        .update({ status: newStatus })
        .eq('id', application.id)
        .select('*')
        .single()

      if (updateError) throw updateError

      setApplication(data)
      setMessage(`Application status updated to ${label}.`)
    } catch (updateError) {
      setError(
        updateError?.message ||
          'Unable to update application status.'
      )
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          Loading application details...
        </p>
      </div>
    )
  }

  if (error && !application) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6">
          <p className="mb-5 text-red-600">{error}</p>

          <button
            type="button"
            onClick={loadDetails}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-white"
          >
            Try again
          </button>

          <Link
            to="/admin"
            className="ml-4 text-emerald-700 underline"
          >
            Back to admin
          </Link>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <p>Application not found.</p>
        <Link
          to="/admin"
          className="text-emerald-700 underline"
        >
          Back to admin
        </Link>
      </div>
    )
  }

  const status = application.status || 'submitted'
  const statusLabel = statusLabels[status] || status
  const statusClass =
    statusClasses[status] || 'bg-slate-100 text-slate-700'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link
            to="/admin"
            className="text-xl font-bold text-emerald-800"
          >
            HopeForward Admin
          </Link>

          <button
            type="button"
            onClick={loadDetails}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-emerald-700 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to applications
        </Link>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            {message}
          </div>
        )}

        <section className="rounded-2xl border bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                APPLICATION REVIEW
              </p>

              <h1 className="mt-2 text-2xl font-bold md:text-3xl">
                {privateDetails?.full_name || 'Applicant details'}
              </h1>

              <p className="mt-2 break-all text-sm text-slate-500">
                Application ID: {application.id}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${statusClass}`}
            >
              <Clock size={16} />
              {statusLabel}
            </span>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className={inputLabel}>Programme</p>
              <p className={valueClass}>
                {application.program_name || 'Not provided'}
              </p>
            </div>

            <div>
              <p className={inputLabel}>Amount requested</p>
              <p className={valueClass}>
                {Number(
                  application.requested_amount || 0
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className={inputLabel}>Application date</p>
              <p className={valueClass}>
                {application.created_at
                  ? new Date(
                      application.created_at
                    ).toLocaleString()
                  : 'Not available'}
              </p>
            </div>

            <div>
              <p className={inputLabel}>Status</p>
              <p className={valueClass}>{statusLabel}</p>
            </div>

            <div>
              <p className={inputLabel}>Applicant ID</p>
              <p className={valueClass}>
                {application.applicant_id || 'Not available'}
              </p>
            </div>
          </div>

          <div className="mt-7 border-t pt-6">
            <p className={inputLabel}>Reason for assistance</p>
            <p className="mt-2 whitespace-pre-wrap leading-7">
              {application.purpose || 'Not provided'}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <UserRound
              className="text-emerald-700"
              size={23}
            />
            <h2 className="text-xl font-bold">
              Applicant information
            </h2>
          </div>

          {privateDetails ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className={inputLabel}>Full name</p>
                <p className={valueClass}>
                  {privateDetails.full_name || 'Not provided'}
                </p>
              </div>

              <div>
                <p className={inputLabel}>Phone number</p>
                <p className={valueClass}>
                  {privateDetails.phone || 'Not provided'}
                </p>
              </div>

              <div>
                <p className={inputLabel}>SSN test value</p>
                <p className={valueClass}>
                  {privateDetails.test_ssn || 'Not provided'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">
              No applicant details were found for this application.
            </p>
          )}
        </section>

        <section className="rounded-2xl border bg-white p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Wallet className="text-emerald-700" size={23} />
            <h2 className="text-xl font-bold">Payment details</h2>
          </div>

          {privateDetails ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className={inputLabel}>Payment method</p>
                <p className={`${valueClass} capitalize`}>
                  {(privateDetails.payment_method || '')
                    .replace('_', ' ') || 'Not provided'}
                </p>
              </div>

              {privateDetails.payment_method === 'bank_transfer' && (
                <>
                  <div>
                    <p className={inputLabel}>Bank name</p>
                    <p className={valueClass}>
                      {privateDetails.bank_name || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className={inputLabel}>Account name</p>
                    <p className={valueClass}>
                      {privateDetails.account_name || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className={inputLabel}>Account number</p>
                    <p className={valueClass}>
                      {privateDetails.account_number || 'Not provided'}
                    </p>
                  </div>
                </>
              )}

              {privateDetails.payment_method === 'mailed_check' && (
                <>
                  <div>
                    <p className={inputLabel}>Cheque recipient</p>
                    <p className={valueClass}>
                      {privateDetails.check_recipient || 'Not provided'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className={inputLabel}>Mailing address</p>
                    <p className={valueClass}>
                      {privateDetails.mailing_address || 'Not provided'}
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-slate-500">
              No payment details available.
            </p>
          )}
        </section>

        <section className="rounded-2xl border bg-white p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <IdCard className="text-emerald-700" size={23} />
            <h2 className="text-xl font-bold">
              Identity documents
            </h2>
          </div>

          {idImages.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {idImages.map((image) => (
                <a
                  key={image.path}
                  href={image.url}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-xl border hover:shadow-md"
                >
                  <img
                    src={image.url}
                    alt="Applicant ID document"
                    className="h-64 w-full bg-slate-100 object-contain"
                  />

                  <div className="p-3 text-sm text-emerald-700">
                    Open image
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed py-8 text-center">
              <FileText
                size={36}
                className="mx-auto mb-3 text-slate-300"
              />
              <p className="font-medium">
                No ID images available
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Uploaded images will appear here when available.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-white p-6 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck
              className="text-emerald-700"
              size={23}
            />
            <h2 className="text-xl font-bold">
              Review application
            </h2>
          </div>

          <p className="mb-5 text-slate-600">
            Review the application details before changing its status.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateStatus('under_review')}
              disabled={updating || status === 'under_review'}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Clock size={18} />
              {updating ? 'Updating...' : 'Set Processing'}
            </button>

            <button
              type="button"
              onClick={() => updateStatus('approved')}
              disabled={updating || status === 'approved'}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle size={18} />
              {updating ? 'Updating...' : 'Approve'}
            </button>

            <button
              type="button"
              onClick={() => updateStatus('rejected')}
              disabled={updating || status === 'rejected'}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle size={18} />
              {updating ? 'Updating...' : 'Reject'}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
