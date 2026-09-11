import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  active?: boolean
  showLabel?: boolean
  ref?: Ref<HTMLButtonElement>
}

export default function IconButton({
  icon,
  label,
  active,
  showLabel = false,
  className = '',
  ref,
  ...props
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={`flex min-h-11 items-center rounded-xl2 border transition-colors ${
        showLabel ? 'w-full justify-start gap-2 px-3' : 'min-w-11 justify-center'
      } ${active ? 'border-accent bg-accent/10 text-accent' : 'border-line text-ink hover:border-ink'} ${className}`}
      {...props}
    >
      {icon}
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </button>
  )
}
