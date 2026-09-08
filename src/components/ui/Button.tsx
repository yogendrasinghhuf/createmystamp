import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-accent',
  secondary: 'bg-transparent border border-line text-ink hover:border-ink',
  ghost: 'bg-transparent text-ink hover:bg-line/50',
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
