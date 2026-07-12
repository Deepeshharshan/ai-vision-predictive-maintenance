import * as React from "react"
import { cn } from "../../utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    primary: "bg-emerald-600 text-white hover:bg-emerald-500 shadow",
    destructive: "bg-red-600 text-slate-50 hover:bg-red-600/90",
    outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-800/80 border border-slate-700",
    ghost: "hover:bg-slate-800 hover:text-slate-100 text-slate-300",
    link: "text-slate-100 underline-offset-4 hover:underline",
  }
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-sm px-3 text-xs",
    lg: "h-10 rounded-sm px-8",
    icon: "h-9 w-9",
  }
  return (
    <button ref={ref} className={cn("inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)} {...props} />
  )
})
Button.displayName = "Button"
export { Button }
