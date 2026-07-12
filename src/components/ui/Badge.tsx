import * as React from "react"
import { cn } from "../../utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline" | "slate";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-800 text-slate-100 hover:bg-slate-700 border-transparent",
    success: "bg-emerald-900/50 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/80",
    warning: "bg-amber-900/50 text-amber-400 border-amber-800/50 hover:bg-amber-900/80",
    destructive: "bg-red-900/50 text-red-400 border-red-800/50 hover:bg-red-900/80",
    outline: "text-slate-100 border-slate-700",
    slate: "bg-slate-800 text-slate-300 border-slate-700"
  }
  return (
    <div ref={ref} className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2", variants[variant], className)} {...props} />
  )
})
Badge.displayName = "Badge"
export { Badge }
