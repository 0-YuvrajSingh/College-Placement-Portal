import type { ReactNode } from "react"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import Spinner from "../components/ui/Spinner"
import type { Page } from "../App"
import { IconAlert, IconWifi } from "../components/ui/Icons"

interface Props {
  nav: (p: Page) => void
}

function EmptyState({
  nav,
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  nav: (p: Page) => void
  icon: ReactNode
  title: string
  body: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="page">
      <Navbar nav={nav} variant="public" />
      <div
        className="flex-center"
        style={{ padding: "64px 24px", minHeight: "calc(100vh - 72px)" }}
      >
        <div
          className="flex-col"
          style={{ alignItems: "center", textAlign: "center", maxWidth: 420 }}
        >
          <div
            className="avatar-sm"
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "var(--color-primary-light)",
              color: "var(--color-primary)",
              marginBottom: 20,
            }}
          >
            {icon}
          </div>
          <h2 className="h4" style={{ margin: "0 0 8px" }}>
            {title}
          </h2>
          <p
            className="small"
            style={{
              color: "var(--color-muted)",
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            {body}
          </p>
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      </div>
    </div>
  )
}

function NotFound({ nav }: Props) {
  return (
    <EmptyState
      nav={nav}
      icon={
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "var(--color-primary)",
          }}
        >
          404
        </span>
      }
      title="Page not found"
      body="The page you are looking for doesn't exist or may have been moved. Let's get you back on track."
      actionLabel="Back to Home"
      onAction={() => nav("home")}
    />
  )
}

function EmptyProfile({ nav }: Props) {
  return (
    <EmptyState
      nav={nav}
      icon={<IconAlert size={28} />}
      title="No profile yet"
      body="You haven't created your student profile yet. Create one to unlock placements."
      actionLabel="Create Profile"
      onAction={() => nav("create-profile")}
    />
  )
}

function NetworkError({ nav }: Props) {
  return (
    <EmptyState
      nav={nav}
      icon={<IconWifi size={28} />}
      title="Connection lost"
      body="We couldn't reach the server. Check your internet connection and try again."
      actionLabel="Retry"
      onAction={() => nav("dashboard")}
    />
  )
}

function Loading({ nav }: Props) {
  return (
    <div className="page">
      <Navbar nav={nav} variant="public" />
      <div
        className="flex-center"
        style={{ padding: "80px 24px", minHeight: "calc(100vh - 72px)" }}
      >
        <div className="flex-col" style={{ alignItems: "center", gap: 16 }}>
          <Spinner size="lg" />
          <p
            className="small"
            style={{ color: "var(--color-muted)", margin: 0 }}
          >
            Loading your placement portal…
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ErrorStates({ nav }: Props) {
  return (
    <div className="flex-col" style={{ gap: 8 }}>
      <NotFound nav={nav} />
      <EmptyProfile nav={nav} />
      <NetworkError nav={nav} />
      <Loading nav={nav} />
    </div>
  )
}
