import { defineRecipe } from "@pandacss/dev"

export const typography = defineRecipe({
	className: "typography",
	variants: {
		textStyle: {
			xs: {
				fontSize: "{fontSizes.xs}",
				lineHeight: "{lineHeights.normal}",
			},
			sm: {
				fontSize: "{fontSizes.sm}",
				lineHeight: "{lineHeights.normal}",
			},
			md: {
				fontSize: "{fontSizes.md}",
				lineHeight: "{lineHeights.normal}",
			},
			lg: {
				fontSize: "{fontSizes.lg}",
				lineHeight: "{lineHeights.tight}",
			},
			xl: {
				fontSize: "{fontSizes.xl}",
				lineHeight: "{lineHeights.tight}",
			},
			"2xl": {
				fontSize: "{fontSizes.2xl}",
				lineHeight: "{lineHeights.tight}",
			},
			"3xl": {
				fontSize: "{fontSizes.3xl}",
				lineHeight: "{lineHeights.tight}",
			},
			"4xl": {
				fontSize: "{fontSizes.4xl}",
				lineHeight: "{lineHeights.tight}",
			},
			"5xl": {
				fontSize: "{fontSizes.5xl}",
				lineHeight: "{lineHeights.tight}",
			},
		},
		weight: {
			regular: { fontWeight: "{fontWeights.regular}" },
			medium: { fontWeight: "{fontWeights.medium}" },
			semibold: { fontWeight: "{fontWeights.semibold}" },
			bold: { fontWeight: "{fontWeights.bold}" },
		},
		color: {
			text: { color: "{colors.neutral.900}" },
			muted: { color: "{colors.neutral.500}" },
			primary: { color: "{colors.primary}" },
			secondary: { color: "{colors.secondary}" },
			danger: { color: "{colors.danger}" },
		},
	},
	defaultVariants: {
		textStyle: "md",
		weight: "regular",
		color: "text",
	},
})
