import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-paper shadow-soft hover:bg-accent',
  secondary: 'bg-paper border border-line text-ink shadow-card hover:border-accent hover:text-accent',
  ghost: 'bg-transparent text-ink hover:bg-line/50',
  accent: 'bg-[#1F5C3D] text-paper shadow-soft hover:bg-[#1A4E34]',
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-all duration-150 disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
