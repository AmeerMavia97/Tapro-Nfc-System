import { cn } from "@/lib/utils"

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-2 p-6 pb-4", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <h1
      data-slot="card-title"
      className={cn("text-2xl font-semibold tracking-normal text-foreground", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
