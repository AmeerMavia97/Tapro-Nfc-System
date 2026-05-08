import { LockKeyhole } from "lucide-react"
import { Link } from "react-router-dom"

import authImage from "@/assets/Mobile-login.png"
import ThemeToggle from "@/components/ui/ThemeToggle"

const AuthLayout = ({ children }) => {
  return (
    <main className=" bg-slate-50 text-slate-950 transition-colors ">
      <div className="mx-auto flex  w-full max-w-7xl flex-col px-4  sm:px-6 lg:px-8">

        <div className="grid flex-1 items-center gap-10  lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
          <section className="relative p-11 h-full overflow-hidden rounded-2xl  lg:block">
            <img
              alt="TapRoCard NFC dashboard preview"
              className=" h-full w-full object-cover"
              src={authImage}
            />
           
          </section>

          <section className="flex w-full items-center justify-center">
            <div className="w-full max-w-md">{children}</div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
