
import { Link, Routes, Route } from 'react-router-dom'
import Register from './Register.jsx'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminApplicationDetails from './AdminApplicationDetails.jsx'
import ForgotPassword from './ForgotPassword.jsx'
import ResetPassword from './ResetPassword.jsx'
import AuthCallback from './AuthCallback.jsx'
import {
  HeartHandshake,
  ShieldCheck,
  ClipboardList,
  Users,
  Heart,
  ArrowRight,
  Info,
  LifeBuoy,
  House,
  FileText,
  Search,
  UserRound,
  CircleCheck,
  Mail,
  Globe,
} from 'lucide-react'

const features = [
  {
    Icon: ShieldCheck,
    title: 'Safe & Secure',
    description: 'Your information is protected with privacy-focused security.',
  },
  {
    Icon: ClipboardList,
    title: 'Simple Application',
    description: 'Easy steps to apply for the support you need.',
  },
  {
    Icon: Users,
    title: 'Fair Review Process',
    description: 'Every application is reviewed carefully.',
  },
  {
    Icon: Heart,
    title: 'Real Impact',
    description: 'Helping individuals and families move forward.',
  },
]

const programs = [
  {
    Icon: LifeBuoy,
    title: 'Emergency Financial Assistance',
    description:
      'Explore potential support for eligible people experiencing unexpected financial hardship or urgent expenses.',
  },
  {
    Icon: ClipboardList,
    title: 'Essential Household Expenses',
    description:
      'Learn about possible assistance with essential household costs during a difficult period.',
  },
  {
    Icon: House,
    title: 'Housing and Emergency Needs',
    description:
      'Find out whether assistance may be available for eligible applicants facing urgent housing-related hardship.',
  },
]

const steps = [
  {
    Icon: Search,
    title: 'Review Programs',
    description: 'Check eligibility and program details.',
  },
  {
    Icon: UserRound,
    title: 'Create Account',
    description: 'Sign up and verify your email.',
  },
  {
    Icon: FileText,
    title: 'Submit Application',
    description: 'Complete the form and upload required documents.',
  },
  {
    Icon: CircleCheck,
    title: 'Track Your Status',
    description: 'Check your dashboard for updates.',
  },
]

const faqs = [
  {
    question: 'How do I apply for a grant?',
    answer:
      'Review the published eligibility requirements, create an account, and complete the application when the relevant program is open.',
  },
  {
    question: 'How can I track my application?',
    answer:
      'You will be able to check your application status through your account dashboard once that feature is available.',
  },
  {
    question: 'Is submitting an application a guarantee of funding?',
    answer:
      'No. Applications are subject to eligibility checks, review, and actual program funding availability.',
  },
  {
    question: 'What documents might I need?',
    answer:
      'Requirements depend on the program. Review the official instructions before submitting personal information or supporting documents.',
  },
]

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
      {children}
    </p>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen bg-[#F1F6FC] text-[#0B2345]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <HeartHandshake size={29} strokeWidth={2.4} />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-tight">
                HopeForward
              </span>
              <span className="block text-xs text-slate-500">
                Community Grants
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#home" className="hover:text-blue-700">Home</a>
            <a href="#about" className="hover:text-blue-700">About</a>
            <a href="#grants" className="hover:text-blue-700">Grants</a>
            <a href="#faq" className="hover:text-blue-700">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 sm:block"
            >
              Login
            </Link>
            <Link
              to="/apply"
              className="rounded-lg bg-[#1769E8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section
          id="home"
          className="mx-auto grid max-w-7xl overflow-hidden bg-white md:grid-cols-2"
        >
          <div className="flex flex-col justify-center px-7 py-14 sm:px-12 lg:px-16">
            <span className="mb-5 w-fit rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              Hope for a brighter future
            </span>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Financial Support for a Brighter Future
            </h1>

            <p className="mt-5 max-w-lg leading-7 text-slate-600">
              HopeForward helps eligible applicants explore financial hardship
              and emergency assistance opportunities and understand how to apply.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1769E8] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800"
              >
                Apply for a Grant <ArrowRight size={18} />
              </Link>
              <a
                href="#about"
                className="rounded-lg border border-slate-200 px-6 py-3 font-semibold transition hover:bg-slate-50"
              >
                Learn More
              </a>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <Info size={15} className="shrink-0 text-blue-600" />
              Review eligibility and program terms before applying.
            </p>
          </div>

          <div className="relative min-h-80 overflow-hidden bg-gradient-to-br from-blue-100 via-sky-50 to-blue-200">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85"
              alt="Community members supporting children"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-blue-950/10" />
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/70 bg-white/95 p-4 shadow-lg sm:bottom-8 sm:left-8 sm:right-auto">
              <p className="flex items-center gap-2 text-sm font-bold">
                <Users size={19} className="text-blue-700" />
                Stronger Families
              </p>
              <p className="mt-1 pl-7 text-xs text-slate-500">
                Healthier Communities
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-2 gap-px border-y border-slate-200 bg-slate-200 md:grid-cols-4">
          {features.map(({ Icon, title, description }) => (
            <article key={title} className="bg-white px-5 py-8 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#1769E8]">
                <Icon size={25} strokeWidth={2} />
              </span>
              <h2 className="mt-3 font-bold">{title}</h2>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                {description}
              </p>
            </article>
          ))}
        </section>

        <section id="about" className="bg-white px-6 py-14">
          <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2">
            <div>
              <SectionLabel>About HopeForward</SectionLabel>
              <h2 className="mt-3 text-3xl font-extrabold">
                Helping People Take Their Next Step
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">
                Our goal is to make grant opportunities easier to understand
                and applications easier to navigate. Applicants can review
                requirements, submit information through a secure process,
                and follow their application progress.
              </p>
              <a
                href="#grants"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline"
              >
                Explore grant information <ArrowRight size={17} />
              </a>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-[#F8FBFF] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <HeartHandshake size={27} />
              </div>
              <h3 className="mt-4 text-xl font-bold">
                Support During Difficult Times
              </h3>
              <p className="mt-3 leading-7 text-slate-600">
                Learn about potential assistance, review official program
                criteria, and understand the application process before sharing
                personal information.
              </p>
              <Link
                to="/apply"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1769E8] px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Get Started <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section id="grants" className="bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Grant Programs</SectionLabel>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Support When Life Takes an Unexpected Turn
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Explore information about financial hardship and emergency
                assistance. Review eligibility and program availability before
                applying.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {programs.map(({ Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1769E8]">
                    <Icon size={25} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                  <a
                    href="#eligibility"
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline"
                  >
                    Check eligibility <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-8 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-slate-600">
              <Info size={20} className="mt-0.5 shrink-0 text-blue-700" />
              <p>
                These categories describe potential areas of assistance, not
                confirmed funding programs. Availability, eligibility, and
                funding amounts must be established before applications open.
                Applying does not guarantee funding.
              </p>
            </div>
          </div>
        </section>

        <section id="eligibility" className="bg-[#F1F6FC] px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
            <div>
              <SectionLabel>Before You Apply</SectionLabel>
              <h2 className="mt-3 text-3xl font-extrabold">
                Is HopeForward Right for You?
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Eligibility requirements depend on the assistance program.
                Review published requirements before creating an account or
                sharing personal information.
              </p>
              <Link
                to="/apply"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1769E8] px-6 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Explore Applying <ArrowRight size={17} />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="flex items-center gap-3 text-xl font-bold">
                <ClipboardList className="text-blue-700" size={25} />
                What to Review
              </h3>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                {[
                  'Whether the program serves your state or location',
                  'The financial hardship and eligibility criteria',
                  'Which supporting documents are required',
                  'Application deadlines and funding availability',
                  'How application reviews and decisions work',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CircleCheck size={18} className="mt-0.5 shrink-0 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
                These are items to review, not confirmed eligibility rules.
                Official program requirements must be published before
                applications open.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="mt-3 text-3xl font-extrabold">
                A Simple Four-Step Process
              </h2>
              <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
                Review the program, create your account, complete your
                application, and check your dashboard for updates.
              </p>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ Icon, title, description }, index) => (
                <article key={title} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1769E8] text-white shadow-md">
                    <Icon size={25} />
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-700">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#F1F6FC] px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <SectionLabel>Frequently Asked Questions</SectionLabel>
              <h2 className="mt-3 text-3xl font-extrabold">
                Common Questions
              </h2>
            </div>

            <div className="mt-8 space-y-3">
              {faqs.map(({ question, answer }) => (
                <details
                  key={question}
                  className="group rounded-xl border border-slate-200 bg-white p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {question}
                    <span className="text-xl text-blue-700 group-open:hidden">+</span>
                    <span className="hidden text-xl text-blue-700 group-open:inline">−</span>
                  </summary>
                  <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0B2345] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="inline-flex items-center gap-2">
                <HeartHandshake size={31} />
                <span>
                  <span className="block text-lg font-extrabold">HopeForward</span>
                  <span className="block text-xs text-blue-200">Community Grants</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-6 text-blue-100">
                Helping eligible applicants explore grant opportunities and
                take steps toward a brighter future.
              </p>
              <div className="mt-5 flex gap-4 text-blue-100">
                <a href="#footer" aria-label="Website" className="hover:text-white">
                  <Globe size={18} />
                </a>
                <a href="mailto:support@hopeforward.org" aria-label="Email" className="hover:text-white">
                  <Mail size={18} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Quick Links</h3>
              <ul className="mt-4 space-y-3 text-sm text-blue-100">
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#grants" className="hover:text-white">Grant Programs</a></li>
                <li><a href="#faq" className="hover:text-white">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">Applicant Support</h3>
              <ul className="mt-4 space-y-3 text-sm text-blue-100">
                <li><Link to="/apply" className="hover:text-white">Apply for a Grant</Link></li>
                <li><Link to="/login" className="hover:text-white">Applicant Login</Link></li>
                <li><a href="#faq" className="hover:text-white">Application Questions</a></li>
              </ul>
            </div>

            <div id="footer">
              <h3 className="font-bold">Policies & Contact</h3>
              <ul className="mt-4 space-y-3 text-sm text-blue-100">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Use</a></li>
                <li>
                  <a href="mailto:support@hopeforward.org" className="inline-flex items-center gap-2 hover:text-white">
                    <Mail size={16} /> Contact Support
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs leading-5 text-blue-200">
                Replace example contact details with your verified official contact information before launch.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-blue-900 pt-6 text-xs text-blue-200 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} HopeForward. All rights reserved.</p>
            <p>Together, we build stronger communities.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apply" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route
        path="/admin/applications/:id"
        element={<AdminApplicationDetails />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Page Not Found
            </h1>
            <p className="mt-3 text-slate-600">
              The page you requested does not exist.
            </p>
            <Link
              to="/"
              className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
            >
              Return Home
            </Link>
          </div>
        }
      />
    </Routes>
  )
}
