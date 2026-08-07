interface IconProps {
  size?: number
  strokeWidth?: number
  className?: string
}

const svgProps = (size: number, strokeWidth: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  className,
})

export const IconHome = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

export const IconUser = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

export const IconPencil = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

export const IconDocument = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

export const IconUpload = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

export const IconDownload = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
)

export const IconTrash = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <polyline points="3 6 5 6 21 6" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"
    />
  </svg>
)

export const IconBell = ({
  size = 20,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.73 21a2 2 0 01-3.46 0"
    />
  </svg>
)

export const IconMail = ({
  size = 16,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
    />
  </svg>
)

export const IconLock = ({
  size = 16,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

export const IconPhone = ({
  size = 16,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

export const IconBuilding = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

export const IconChart = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

export const IconCheck = ({
  size = 18,
  strokeWidth = 2.5,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const IconAlert = ({
  size = 16,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

export const IconShield = ({
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

export const IconPlus = ({
  size = 18,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

export const IconClose = ({
  size = 20,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

export const IconLogout = ({
  size = 24,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

export const IconSkills = ({
  size = 16,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
)

export const IconWifi = ({
  size = 44,
  strokeWidth = 1.5,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    />
  </svg>
)

export const IconCalendar = ({
  size = 16,
  strokeWidth = 2,
  className,
}: IconProps) => (
  <svg {...svgProps(size, strokeWidth, className)}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)
