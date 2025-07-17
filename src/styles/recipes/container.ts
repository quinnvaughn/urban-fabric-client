import { defineRecipe } from "@pandacss/dev"

export const container = defineRecipe({
	className: "container",
	base: {
		width: "100%",
		mx: "auto",
		px: { base: "md", md: "lg" },
	},
	variants: {
		size: {
			xs: { maxWidth: "{sizes.xs}" },
			sm: { maxWidth: "{sizes.sm}" },
			md: { maxWidth: "{sizes.md}" },
			lg: { maxWidth: "{sizes.lg}" },
			xl: { maxWidth: "{sizes.xl}" },
			"2xl": { maxWidth: "{sizes.2xl}" },
			"3xl": { maxWidth: "{sizes.3xl}" },
			"4xl": { maxWidth: "{sizes.4xl}" },
			full: { maxWidth: "100%" },
		},
	},
	defaultVariants: { size: "4xl" },
})
