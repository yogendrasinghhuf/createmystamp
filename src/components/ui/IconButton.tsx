import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  active?: boolean
  ref?: Ref<HTMLButtonElement>
}

export default function IconButton({ icon, label, active, className = '', ref, ...props }: IconButtonProps) {
  return (
    <button
      ref={ref}
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
