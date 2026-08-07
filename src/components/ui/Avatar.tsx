interface AvatarProps {
  initials: string
  size?: "sm" | "lg" | number
}

export default function Avatar({ initials, size = "sm" }: AvatarProps) {
  const numeric = typeof size === "number"
  const sizeClass = size === "lg" ? "avatar-lg" : "avatar-sm"
  return (
    <span
      className={`avatar ${sizeClass}`}
      style={
        numeric
          ? {
              width: size,
              height: size,
              borderRadius: Math.round(size / 2),
              fontSize: Math.round(size * 0.42),
            }
          : undefined
      }
    >
      {initials}
    </span>
  )
}
