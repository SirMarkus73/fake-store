import type { MouseEventHandler } from "preact/compat"

export function Button({
  disabled,
  onClick,
}: { disabled?: boolean; onClick?: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button
      type="button"
      className={
        "cursor-pointer rounded-md bg-gray-500 p-2 text-white transition-[transform_colors] hover:scale-110 hover:bg-gray-700 disabled:cursor-default disabled:bg-gray-300"
      }
      disabled={disabled}
      onClick={onClick}
    >
      Refresh products
    </button>
  )
}
