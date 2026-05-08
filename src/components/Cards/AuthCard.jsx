import { Link } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const AuthCard = ({ title, description, children, footerText, footerLinkText, footerTo }) => {
  return (
    <Card className="w-full border-slate-200 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.08)] transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      <CardHeader className="items-center gap-2 px-6 pt-10 pb-8 text-center sm:px-10">
        <CardTitle className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</CardTitle>
        <CardDescription className="max-w-md text-base leading-7 text-slate-500 dark:text-slate-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-7 pt-0 sm:px-10">{children}</CardContent>
      {footerText ? (
        <CardFooter className="justify-center px-6 pb-10 pt-0 text-base text-slate-500 dark:text-slate-300 sm:px-10">
          {footerText}
          <Link className="ml-1 font-medium text-slate-950 hover:underline dark:text-white" to={footerTo}>
            {footerLinkText}
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  )
}

export default AuthCard
