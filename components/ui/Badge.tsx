interface BadgeProps {
  label: string
  light?: boolean
}

export default function Badge({ label, light = false }: BadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium w-fit ${
      light
        ? 'border-white/30 text-white bg-white/10'
        : 'border-brand-border text-brand-black bg-white'
    }`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        light ? 'bg-white' : 'bg-brand-black'
      }`}>
        <span className={`w-2.5 h-2.5 rounded-full ${light ? 'bg-brand-black' : 'bg-white'}`} />
      </span>
      {label}
    </div>
  )
}
