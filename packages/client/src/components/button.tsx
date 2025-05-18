import type { MouseEventHandler } from "preact/compat"

export function Button({
  disabled,
  onClick,
  children,
  type,
  className,
}: {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  children: preact.ComponentChildren
  className?: string
  type: "button" | "submit" | "reset"
}) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-md bg-gray-500 p-2 text-white transition-[transform_colors] hover:scale-110 hover:bg-gray-700 disabled:cursor-default disabled:bg-gray-300 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
