import { defineSlotRecipe } from "@pandacss/dev"

export const input = defineSlotRecipe({
	className: "input",
	slots: [
		"root",
		"label",
		"labelText",
		"counter",
		"field",
		"input",
		"adornment",
		"description",
		"error",
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "1",
		},
		label: {
			display: "flex",
			alignItems: "center",
		},
		labelText: {
			fontSize: "xs",
			fontWeight: "semibold",
			color: "stone.700",
			letterSpacing: "normal",
		},
		counter: {
			marginLeft: "auto",
			fontSize: "xxs",
			fontWeight: "normal",
			color: "fg.subtle",
			fontVariantNumeric: "tabular-nums",
			letterSpacing: "normal",
			textTransform: "none",
			transition: "colors 0.12s ease",
			"&[data-warn]": {
				color: "warning.default",
			},
			"&[data-over]": {
				color: "danger.default",
			},
		},
		field: {
			display: "flex",
			alignItems: "center",
			gap: "2",
			w: "full",
			borderRadius: "md",
			borderWidth: "1.5",
			borderStyle: "solid",
			borderColor: "border.default",
			bg: "rgba(253, 252, 250, 0.6)",
			color: "fg.default",
			px: "3",
			transition:
				"border-color 160ms {easings.inOut}, background 160ms {easings.inOut}, box-shadow 160ms {easings.inOut}",
			_hover: {
				borderColor: "border.strong",
				bg: "rgba(235, 230, 220, 0.5)", // stone.200 at 50%
			},
			"&[data-focused]": {
				borderColor: "teal.500",
				boxShadow: "0 0 0 3px rgba(39, 141, 117, 0.10)",
				bg: "white",
				outline: "none",
				_hover: {
					borderColor: "teal.500",
					bg: "white",
				},
			},
			"&[data-disabled]": {
				opacity: "50",
				cursor: "not-allowed",
				bg: "bg.muted",
				_hover: {
					borderColor: "border.default",
					bg: "bg.muted",
				},
			},
			"&[data-read-only]": {
				bg: "bg.muted",
				cursor: "default",
				_hover: {
					borderColor: "border.default",
					bg: "bg.muted",
				},
			},
		},
		input: {
			flex: "1 1 auto",
			minWidth: 0,
			width: "full",
			border: "none",
			outline: "none",
			background: "transparent",
			padding: 0,
			appearance: "none",
			font: "inherit",
			fontSize: "inherit",
			lineHeight: "inherit",
			color: "fg.default",
			_placeholder: {
				fontSize: "sm",
				color: "stone.400",
			},
		},
		adornment: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			color: "fg.subtle",
			flex: "0 0 auto",
		},
		description: {
			fontSize: "xxs",
			color: "fg.subtle",
		},
		error: {
			fontSize: "xxs",
			color: "danger.default",
		},
	},
	variants: {
		size: {
			sm: {
				field: { py: "1.5", minH: "9", fontSize: "sm", lineHeight: "snug" },
				input: { fontSize: "sm" },
			},
			md: {
				field: { py: "2", minH: "10", fontSize: "md", lineHeight: "snug" },
				input: { fontSize: "md" },
			},
			lg: {
				field: { py: "2.5", minH: "12", fontSize: "md", lineHeight: "snug" },
				input: { fontSize: "md" },
			},
		},
		invalid: {
			true: {
				field: {
					borderColor: "danger.default",
					"&[data-focused]": {
						borderColor: "danger.default",
						boxShadow: "0 0 0 3px token(colors.danger.subtle)",
					},
				},
			},
		},
	},
	defaultVariants: {
		size: "md",
	},
})
