import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import Navbar from '@/components/Layout/Navbar/Navbar'

const Home = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-28 transition-colors dark:bg-slate-950">
      <Navbar />
      <section className="w-full max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">TapRoCard</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-6xl">
          Smart NFC access starts with secure auth.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Manage sign in, registration, password recovery, and account password changes with a polished
          Supabase-backed flow.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-11 bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild className="h-11 border-slate-300 px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" variant="outline">
            <Link to="/register">Create account</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

export default Home
