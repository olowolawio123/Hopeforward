
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Clock,
  CircleCheck,
  CircleX,
  RefreshCw,
  ShieldCheck,
  ArrowLeft,
  Eye,
} from 'lucide-react'
import { supabase } from './supabase'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  async function loadDashboard() {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) throw sessionError

      if (!session) {
        setUser(null)
        setError(
          'Please log in before accessing the admin dashboard.'
        )
        setLoading(false)
        return
      }

      setUser(session.user)

      const { data: roleRecord, error: roleError } =
        await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle()

      if (roleError) {
        throw new Error(
          `Could not verify admin role: ${roleError.message}`
        )
      }

      if (!roleRecord) {
        throw new Error(
          'No admin role found for this account.'
        )
      }

      const { data, error: applicationsError } =
        await supabase
          .from('grant_applications')
          .select(
            'id, applicant_id, program_name, requested_amount, purpose, status, submitted_at, created_at'
          )
          .order('created_at', { ascending: false })

      if (applicationsError) throw applicationsError

      setApplications(data || [])
    } catch (loadError) {
      setError(
        loadError?.message ||
          'Could not load the admin dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  async function changeStatus(applicationId, newStatus) {
    const statusLabels = {
      under_review: 'Processing',
      approved: 'Approved',
      rejected: 'Rejected',
    }

    const label = statusLabels[newStatus] || newStatus

    const confirmed = window.confirm(
      `Are you sure you want to change this application to ${label}?`
    )

    if (!confirmed) return

    setUpdatingId(applicationId)
    setError('')
    setMessage('')

    try {
      const { data, error: updateError } = await supabase
        .from('grant_applications')
        .update({ status: newStatus })
        .eq('id', applicationId)
        .select('id, status')
        .maybeSingle()

      if (updateError) throw updateError

      if (!data) {
        throw new Error(
          'No application was updated. Check your database permissions.'
        )
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? { ...application, status: data.status }
            : application
        )
      )

      setMessage(
        `Application successfully changed to ${label}.`
      )
    } catch (updateError) {
      setError(
        updateError?.message ||
          'Could not update the application status.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const pending = applications.filter((application) =>
    ['draft', 'submitted', 'under_review'].includes(
      application.status
    )
  ).length

  const approved = applications.filter(
    (application) => application.status === 'approved'
  ).length

  const rejected = applications.filter(
    (application) => application.status === 'rejected'
  ).length

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-700">
        Loading HopeForward admin dashboard...
      </main>
    )
  }

  if (error && !applications.length) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
          <ShieldCheck
            size={40}
            className="mb-4 text-emerald-700"
          />

          <h1 className="text-2xl font-bold text-slate-900">
            HopeForward Admin
          </h1>

          {user && (
            <p className="mt-3 text-sm text-slate-500">
              Signed in as: {user.email}
            </p>
          )}

          <p className="mt-4 break-words text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white"
          >
            Try again
          </button>

          <div>
            <Link
              to="/login"
              className="mt-4 inline-block text-emerald-800 underline"
            >
              Go to login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-950">
                HopeForward Admin
              </h1>

              <p className="text-sm text-slate-500">
                Grant application management
              </p>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Applicant dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm font-semibold text-emerald-800">
          ADMINISTRATOR
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-950">
          Application overview
        </h2>

        <p className="mt-2 text-slate-600">
          Review applications and manage their current status.
        </p>

        {user && (
          <p className="mt-2 text-sm text-slate-500">
            Signed in as {user.email}
          </p>
        )}

        {error && (
          <div className="my-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {message && (
          <div className="my-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {message}
          </div>
        )}

        <section className="mb-8 mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total applications"
            value={applications.length}
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Pending review"
            value={pending}
            icon={<Clock size={22} />}
          />

          <StatCard
            title="Approved"
            value={approved}
            icon={<CircleCheck size={22} />}
          />

          <StatCard
            title="Rejected"
            value={rejected}
            icon={<CircleX size={22} />}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <div className="flex items-center gap-3">
              <LayoutDashboard
                className="text-emerald-700"
                size={23}
              />

              <div>
                <h3 className="font-bold text-slate-950">
                  Grant applications
                </h3>

                <p className="text-sm text-slate-500">
                  View details and update each application.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No applications were found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Program</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Applicant ID</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {applications.map((application) => {
                    const isDemo =
                      application.purpose?.startsWith(
                        '[DEMO DATA]'
                      )

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

                    const statusLabel =
                      statusLabels[application.status] ||
                      application.status ||
                      'Unknown'

                    const statusClass =
                      statusClasses[application.status] ||
                      'bg-slate-100 text-slate-700'

                    const isUpdating =
                      updatingId === application.id

                    return (
                      <tr
                        key={application.id}
                        className="align-top"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {application.program_name}
                          </p>

                          {isDemo && (
                            <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                              TEST DATA
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 font-semibold">
                          ${Number(
                            application.requested_amount
                          ).toLocaleString('en-US')}
                        </td>

                        <td className="max-w-xs break-all px-5 py-4 text-xs text-slate-600">
                          {application.applicant_id}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                          >
                            {statusLabel}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {application.created_at
                            ? new Date(
                                application.created_at
                              ).toLocaleDateString()
                            : '—'}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex min-w-36 flex-col gap-2">
                            <Link
                              to={`/admin/applications/${application.id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                            >
                              <Eye size={14} />
                              View Details
                            </Link>

                            <button
                              type="button"
                              disabled={
                                isUpdating ||
                                application.status === 'under_review'
                              }
                              onClick={() =>
                                changeStatus(
                                  application.id,
                                  'under_review'
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Clock size={14} />
                              {isUpdating
                                ? 'Updating...'
                                : application.status ===
                                    'under_review'
                                  ? 'Processing'
                                  : 'Set Processing'}
                            </button>

                            <button
                              type="button"
                              disabled={
                                isUpdating ||
                                application.status === 'approved'
                              }
                              onClick={() =>
                                changeStatus(
                                  application.id,
                                  'approved'
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CircleCheck size={14} />
                              Approve
                            </button>

                            <button
                              type="button"
                              disabled={
                                isUpdating ||
                                application.status === 'rejected'
                              }
                              onClick={() =>
                                changeStatus(
                                  application.id,
                                  'rejected'
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CircleX size={14} />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">
          {title}
        </p>

        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">
          {icon}
        </div>
      </div>

      <p className="text-3xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  )
}
