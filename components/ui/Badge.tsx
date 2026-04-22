interface BadgeProps {
  label: string
  light?: boolean
}

export default function Badge({ label, light = false }: BadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium w-fit ${
      light
        ? 'border-linen/30 text-linen bg-linen/10'
        : 'border-stone/30 text-onyx bg-parchment'
    }`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        light ? 'bg-linen' : 'bg-onyx'
      }`}>
        <span className={`w-2.5 h-2.5 rounded-full ${light ? 'bg-onyx' : 'bg-linen'}`} />
      </span>
      {label}
    </div>
  )
}
