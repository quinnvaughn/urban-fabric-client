import { defineRecipe } from "@pandacss/dev"

export const input = defineRecipe({
	className: "input",
	base: {
		w: "full",
		borderRadius: "md",
		borderWidth: "1",
		borderStyle: "solid",
		borderColor: "border.default",
		bg: "bg.subtle",
		color: "fg.default",
		px: "3",
		fontSize: "md",
		lineHeight: "snug",
		transition: "colors 0.12s ease",

		_placeholder: {
			color: "fg.subtle",
		},
		_hover: {
			borderColor: "border.strong",
		},
		"&[data-focused]": {
			borderColor: "brand.default",
			boxShadow: "0 0 0 3px token(colors.teal.100)",
			bg: "white",
			outline: "none",
		},
		"&[data-disabled]": {
			opacity: "50",
			cursor: "not-allowed",
			bg: "bg.muted",
			_hover: {
				borderColor: "border.default",
			},
		},
		"&[data-read-only]": {
			bg: "bg.muted",
			cursor: "default",
			_hover: {
				borderColor: "border.default",
			},
		},
	},
	variants: {
		size: {
			sm: {
				py: "1.5",
				minH: "9",
				fontSize: "sm",
			},
			md: {
				py: "2",
				minH: "10",
				fontSize: "md",
			},
			lg: {
				py: "2.5",
				minH: "12",
				fontSize: "md",
			},
		},
		invalid: {
			true: {
				borderColor: "danger.default",
				"&[data-focused]": {
					borderColor: "danger.default",
					boxShadow: "0 0 0 3px token(colors.danger.subtle)",
				},
			},
		},
	},
	defaultVariants: {
		size: "md",
	},
})
