import { defineSlotRecipe } from "@pandacss/dev"

export const stepper = defineSlotRecipe({
	className: "stepper",
	slots: ["group", "label", "root", "btn", "value"],
	base: {
		group: {
			display: "flex",
			flexDirection: "column",
			gap: "1",
			border: "none",
			p: "0",
			m: "0",
			minInlineSize: "0",
		},
		label: {
			fontSize: "xs",
			fontWeight: "medium",
			color: "stone.600",
			letterSpacing: "snug",
		},
		root: {
			display: "flex",
			alignItems: "center",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.default",
			borderRadius: "md",
			overflow: "hidden",
			bg: "bg.subtle",
			"&[data-disabled]": {
				opacity: "50",
				pointerEvents: "none",
			},
		},
		btn: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: "0",
			border: "none",
			bg: "transparent",
			color: "fg.muted",
			cursor: "pointer",
			fontWeight: "light",
			lineHeight: "none",
			transition: "all 150ms ease",
			_hover: {
				bg: "bg.muted",
				color: "fg.default",
			},
			_disabled: {
				cursor: "not-allowed",
				color: "fg.subtle",
				_hover: {
					bg: "transparent",
					color: "fg.subtle",
				},
			},
		},
		value: {
			flex: "1",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontWeight: "semibold",
			color: "fg.default",
			borderLeftWidth: "1",
			borderRightWidth: "1",
			borderStyle: "solid",
			borderColor: "border.subtle",
			userSelect: "none",
		},
	},
	variants: {
		size: {
			sm: {
				btn: { width: "7", height: "7", fontSize: "md" },
				value: { fontSize: "xs" },
			},
			md: {
				btn: { width: "9", height: "9", fontSize: "lg" },
				value: { fontSize: "sm" },
			},
			lg: {
				btn: { width: "10", height: "10", fontSize: "md" },
				value: { fontSize: "md" },
			},
		},
	},
	defaultVariants: {
		size: "md",
	},
})
