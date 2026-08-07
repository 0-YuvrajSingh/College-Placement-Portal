const Message = ({ variant = "danger", children }) => {
  if (!children) return null

  return <div className={`alert alert-${variant} mt-3`}>{children}</div>
}

export default Message
