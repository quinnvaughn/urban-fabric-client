import { defineSlotRecipe } from "@pandacss/dev"

export const menu = defineSlotRecipe({
	className: "menu",
	slots: ["content", "item", "checkItem", "checkBox", "separator", "filterTrigger"],

	base: {
		content: {
			display: "flex",
			flexDirection: "column",
			p: "1",
			borderRadius: "lg",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.subtle",
			bg: "white",
			boxShadow: "lg",
			backdropFilter: "blur(16px)",
			"&[data-state=open]": {
				animation: "menuFadeUp 0.18s {easings.spring} both",
			},
		},
		item: {
			display: "flex",
			alignItems: "center",
			gap: "2",
			w: "full",
			px: "2.5",
			py: "1.5",
			borderRadius: "md",
			border: "none",
			background: "transparent",
			fontSize: "sm",
			fontWeight: "medium",
			color: "fg.default",
			cursor: "pointer",
			textAlign: "left",
			whiteSpace: "nowrap",
			transition: "colors 0.12s ease",
			userSelect: "none",

			_hover: {
				bg: "bg.muted",
				color: "fg.default",
			},
			_disabled: {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					bg: "transparent",
				},
			},
			"& [data-slot=icon]": {
				color: "fg.subtle",
				flexShrink: "0",
			},
			"&:hover [data-slot=icon]": {
				color: "fg.muted",
			},
			"& [data-slot=kbd]": {
				marginLeft: "auto",
				fontSize: "xxs",
				fontWeight: "semibold",
				color: "fg.subtle",
				bg: "bg.muted",
				borderRadius: "sm",
				px: "1",
				py: "0.5",
				flexShrink: "0",
			},
		},
		checkItem: {
			display: "flex",
			alignItems: "center",
			gap: "2",
			w: "full",
			px: "2.5",
			py: "1.5",
			borderRadius: "md",
			border: "none",
			background: "transparent",
			fontSize: "sm",
			fontWeight: "medium",
			color: "fg.default",
			cursor: "pointer",
			textAlign: "left",
			whiteSpace: "nowrap",
			transition: "colors 0.12s ease",
			userSelect: "none",

			_hover: {
				bg: "stone.100",
				color: "fg.default",
			},
			// Checked state — color shifts to brand
			_checked: {
				color: "brand.emphasis",
				// Explicitly re-assert checked color on hover so it always wins
				_hover: {
					bg: "stone.100",
					color: "brand.emphasis",
				},
			},
			_disabled: {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					bg: "transparent",
				},
			},
		},
		checkBox: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: "0",
			w: "3.5",
			h: "3.5",
			borderRadius: "sm",
			borderWidth: "1.5",
			borderStyle: "solid",
			borderColor: "border.strong",
			color: "transparent",
			transition: "all 0.12s ease",

			// Filled when parent checkItem carries data-checked
			"[data-checked] &": {
				bg: "brand.default",
				borderColor: "brand.default",
				color: "brand.fg",
			},
		},
		separator: {
			height: "px",
			bg: "border.subtle",
			my: "1",
		},
		filterTrigger: {
			display: "flex",
			alignItems: "center",
			gap: "2",
			px: "2",
			py: "1.5",
			borderRadius: "full",
			border: "none",
			background: "transparent",
			color: "stone.600",
			cursor: "pointer",
			fontSize: "xs",
			fontWeight: "medium",
			transition: "background 150ms, color 150ms",
			_hover: { color: "fg.default", bg: "stone.100" },
		},
	},

	variants: {
		intent: {
			neutral: {},
			danger: {
				item: {
					color: "danger.default",
					_hover: {
						bg: "danger.subtle",
						color: "danger.emphasis",
					},
					"& [data-slot=icon]": {
						color: "danger.default",
					},
					"&:hover [data-slot=icon]": {
						color: "danger.emphasis",
					},
				},
			},
		},
	},

	defaultVariants: {
		intent: "neutral",
	},
})
