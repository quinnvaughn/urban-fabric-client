import { defineRecipe } from "@pandacss/dev"

export const link = defineRecipe({
	className: "link",
	base: {
		textDecoration: "none",
		cursor: "pointer",
		fontWeight: "medium",
		_hover: { textDecoration: "underline" },
	},
	variants: {
		variant: {
			primary: {
				color: "{colors.primary}",
			},
			secondary: {
				color: "{colors.secondary}",
			},
			text: {
				color: "{colors.neutral.900}",
			},
		},
		size: {
			sm: { fontSize: "{fontSizes.sm}" },
			md: { fontSize: "{fontSizes.md}" },
			lg: { fontSize: "{fontSizes.lg}" },
		},
	},
	defaultVariants: {
		variant: "text",
		size: "md",
	},
})
