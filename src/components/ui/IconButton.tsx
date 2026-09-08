import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  active?: boolean
}

export default function IconButton({ icon, label, active, className = '', ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl2 border transition-colors ${
        active ? 'border-accent bg-accent/10 text-accent' : 'border-line text-ink hover:border-ink'
      } ${className}`}
      {...props}
    >
      {icon}
    </button>
  )
}
