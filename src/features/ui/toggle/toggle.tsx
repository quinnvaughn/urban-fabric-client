import { cva, cx } from "@/styles/styled-system/css"

const toggle = cva({
	base: {
		position: "relative",
		display: "inline-flex",
		flexShrink: 0,
		width: "28px",
		height: "16px",
		borderRadius: "full",
		cursor: "pointer",
		border: "none",
		padding: 0,
		transition: "background 200ms",
		bg: "teal.500",
		_disabled: {
			opacity: 0.4,
			cursor: "not-allowed",
		},
		_checked: {
			bg: "teal.500",
		},
		"&[aria-checked='false']": {
			bg: "stone.300",
		},
		"& span": {
			position: "absolute",
			top: "2px",
			left: "2px",
			width: "12px",
			height: "12px",
			borderRadius: "full",
			bg: "white",
			boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
			transition: "transform 200ms {easings.spring}",
		},
		"&[aria-checked='true'] span": {
			transform: "translateX(12px)",
		},
	},
})

export interface ToggleProps {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
	disabled?: boolean
	className?: string
	"aria-label"?: string
}

export function Toggle({
	checked,
	onCheckedChange,
	disabled,
	className,
	"aria-label": ariaLabel,
}: ToggleProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={ariaLabel}
			disabled={disabled}
			className={cx(toggle(), className)}
			onClick={() => {
				if (!disabled) onCheckedChange(!checked)
			}}
		>
			<span aria-hidden="true" />
		</button>
	)
}
