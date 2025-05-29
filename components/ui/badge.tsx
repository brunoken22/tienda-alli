import type React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function Badge({ variant = "default", size = "md", className = "", children, ...props }: BadgeProps) {
  // Base styles
  const baseStyles = "inline-flex items-center rounded-full font-medium transition-colors"

  // Variant styles
  const variantStyles = {
    default: "bg-purple-600 text-white",
    secondary: "bg-gray-200 text-gray-900",
    destructive: "bg-red-500 text-white",
    outline: "border border-gray-300 bg-transparent text-gray-700",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
  }

  // Size styles
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  // Combine all styles
  const badgeStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  return (
    <div className={badgeStyles} {...props}>
      {children}
    </div>
  )
}
