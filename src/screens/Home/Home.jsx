import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import Navbar from '@/components/Layout/Navbar/Navbar'
import { getDashboardPath, logoutUser } from '@/services/authApi'
import { AUTH_USER_QUERY_KEY, useAuthUser } from '@/components/hooks/useAuthUser'
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Wifi,
  Zap,
} from "lucide-react"



const Home = () => {

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data = {}, isLoading } = useAuthUser()
  // const { user , profile  } = data;
  const user = data?.user;
  const profile = data?.profile;
  const isAuthenticated = !!user;
  const dashboardPath = getDashboardPath(profile)



  return (
    <>
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
          {isAuthenticated ? (
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="h-11 bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                <Link to={dashboardPath}>Dashboard</Link>
              </Button>
              <Button
                className="h-11 border-slate-300 px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={async () => {
                  await logoutUser()
                  queryClient.setQueryData(AUTH_USER_QUERY_KEY, null)
                  navigate("/login", { replace: true })
                }}
                variant="outline"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="h-11 bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild className="h-11 border-slate-300 px-5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" variant="outline">
                <Link to="/register">Create account</Link>
              </Button>
            </div>
          )}
        </section>


      </main>

      <main className="overflow-hidden bg-[#0b0b10] text-white">
        <section className="relative mx-auto min-h-[calc(100vh-40px)] max-w-[1440px] overflow-hidden px-6 py-8">
          <div className="relative min-h-[760px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070710]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(168,85,247,0.45),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(236,72,153,0.35),transparent_26%),radial-gradient(circle_at_50%_78%,rgba(124,58,237,0.55),transparent_34%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.65)_70%,#050509)]" />

            <div className="absolute inset-0 opacity-25">
              <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-8 lg:px-10">
              <div className="flex items-center justify-center">
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-xl">
                  {["Products", "How It Works", "Activation", "Analytics", "Support"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="rounded-full px-5 py-2 text-sm font-medium text-white/80 transition hover:bg-white hover:text-slate-950"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-24 max-w-5xl text-center">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-white/90 backdrop-blur-xl">
                  <Sparkles className="size-4 text-yellow-300" />
                  NFC Google Review System
                </div>

                <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                  Turn every tap into a{" "}
                  <span className="bg-gradient-to-r from-white via-white to-purple-300 bg-clip-text text-transparent">
                    Google review
                  </span>
                </h1>

                <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                  TAPro gives every NFC stand one permanent smart URL. Business owners activate once, customers tap or scan, and the review page opens instantly.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-950 shadow-2xl transition hover:scale-105"
                  >
                    Activate Your Stand
                    <ArrowRight className="ml-2 size-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
                  >
                    Login
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto mt-20 max-w-5xl">
                <div className="absolute left-8 top-10 z-20 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
                  ✦ 75 to 80% tap-to-review rate
                </div>

                <div className="absolute right-8 top-16 z-20 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
                  ✦ Owner locked activation
                </div>

                <div className="absolute left-1/2 top-28 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
                  ✦ Permanent smart URL
                </div>

                <div className="relative mx-auto h-[300px] max-w-4xl overflow-hidden rounded-t-[14rem] border border-purple-400/20 bg-gradient-to-b from-purple-600/40 via-purple-950/20 to-transparent">
                  <div className="absolute inset-x-20 top-10 h-32 rounded-full border-t border-purple-300/40" />
                  <div className="absolute inset-x-28 top-20 h-32 rounded-full border-t border-purple-300/30" />
                  <div className="absolute inset-x-36 top-32 h-32 rounded-full border-t border-purple-300/20" />

                  <div className="absolute bottom-0 left-1/2 w-[280px] -translate-x-1/2 rounded-[2rem] bg-white p-5 text-center text-slate-950 shadow-2xl">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Wifi className="size-8" />
                    </div>
                    <p className="mt-4 text-2xl font-black">TAP HERE</p>
                    <p className="text-sm text-slate-500">Review us on Google</p>
                    <div className="mt-4 flex justify-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="size-5 fill-current" />
                      ))}
                    </div>
                    <QrCode className="mx-auto mt-5 size-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-300">
              Simple by design
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              From first scan to live reviews in minutes.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
              Admin generates the permanent URL. The business owner activates the physical stand. Customers tap and go straight to the review destination.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: QrCode,
                title: "Admin generates permanent URLs",
                text: "Every QR and NFC product gets one unique code that never changes.",
              },
              {
                icon: Smartphone,
                title: "Business owner activates",
                text: "First scan opens login, then activation with business name and Google review destination.",
              },
              {
                icon: Zap,
                title: "Customers tap and review",
                text: "After activation, every future scan redirects instantly to the saved review page.",
              },
            ].map((item, index) => (
              <div key={item.title} className="group flex gap-6 border-b border-white/10 pb-8">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950">
                  <item.icon className="size-6" />
                </div>
                <div>
                  <span className="text-sm font-black text-purple-300">0{index + 1}</span>
                  <h3 className="mt-2 text-2xl font-black">{item.title}</h3>
                  <p className="mt-2 leading-7 text-white/55">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative bg-white py-24 text-slate-950">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
                Why businesses use TAPro
              </p>
              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
                No chasing. No monthly software. Just tap-to-review.
              </h2>
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Owner locked",
                  text: "Once activated, the product is tied to the correct business owner account.",
                },
                {
                  icon: Wifi,
                  title: "NFC + QR ready",
                  text: "Works with tap or scan, so every customer can open the review page easily.",
                },
                {
                  icon: CheckCircle2,
                  title: "Permanent asset",
                  text: "The printed QR and NFC chip keep the same smart URL forever.",
                },
              ].map((item) => (
                <div key={item.title} className="border-t border-slate-200 pt-8">
                  <item.icon className="size-9 text-purple-600" />
                  <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[3rem] bg-gradient-to-br from-purple-600 via-fuchsia-600 to-yellow-300 p-1">
            <div className="rounded-[2.8rem] bg-slate-950 px-8 py-16 text-center">
              <h2 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
                Make every counter, table, and checkout review-ready.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">
                Activate your TAPro smart stand and start turning real customer moments into trusted Google reviews.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-black text-slate-950 transition hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>


    </>
  )
}

export default Home
