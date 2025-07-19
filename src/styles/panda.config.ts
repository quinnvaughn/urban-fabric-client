import { defineConfig } from "@pandacss/dev"
import { recipes, staticCssRecipes } from "./recipes"

export default defineConfig({
	staticCss: {
		recipes: staticCssRecipes,
	},
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: ["./src/**/*.{js,jsx,ts,tsx}"],

	// Files to exclude
	exclude: [],
	conditions: {
		hover: "&:hover",
		focus: "&:focus",
		active: "&:active",
		disabled: "&:disabled",
		visited: "&:visited",
		checked: "&:checked",
		focusVisible: "&:focus-visible",
		focusWithin: "&:focus-within",
	},
	// Useful for theme customization
	theme: {
		recipes,
		breakpoints: {
			sm: "40em", // 640px
			md: "48em", // 768px
			lg: "64em", // 1024px
			xl: "80em", // 1280px
			"2xl": "96em", // 1536px
		},
		textStyles: {
			xs: {
				value: {
					fontSize: "{fontSizes.xs}",
					lineHeight: "{lineHeights.normal}",
					fontWeight: "{fontWeights.regular}",
				},
			},
			sm: {
				value: {
					fontSize: "{fontSizes.sm}",
					lineHeight: "{lineHeights.normal}",
					fontWeight: "{fontWeights.regular}",
				},
			},
			md: {
				value: {
					fontSize: "{fontSizes.md}",
					lineHeight: "{lineHeights.normal}",
					fontWeight: "{fontWeights.regular}",
				},
			},
			lg: {
				value: {
					fontSize: "{fontSizes.lg}",
					lineHeight: "{lineHeights.tight}",
					fontWeight: "{fontWeights.semibold}",
				},
			},
			xl: {
				value: {
					fontSize: "{fontSizes.xl}",
					lineHeight: "{lineHeights.tight}",
					fontWeight: "{fontWeights.bold}",
				},
			},
			"2xl": {
				value: {
					fontSize: "{fontSizes.2xl}",
					lineHeight: "{lineHeights.tight}",
					fontWeight: "{fontWeights.bold}",
				},
			},
			"3xl": {
				value: {
					fontSize: "{fontSizes.3xl}",
					lineHeight: "{lineHeights.tight}",
					fontWeight: "{fontWeights.bold}",
				},
			},
			"4xl": {
				value: {
					fontSize: "{fontSizes.4xl}",
					lineHeight: "{lineHeights.tight}",
					fontWeight: "{fontWeights.bold}",
				},
			},
			"5xl": {
				value: {
					fontSize: "{fontSizes.5xl}",
					lineHeight: "{lineHeights.tight}",
					fontWeight: "{fontWeights.bold}",
				},
			},
		},
		tokens: {
			shadows: {
				sm: { value: "0 1px 2px rgba(0,0,0,0.05)" },
				md: { value: "0 1px 3px rgba(0,0,0,0.1)" },
				lg: { value: "0 4px 6px rgba(0,0,0,0.1)" },
			},
			sizes: {
				xs: { value: "280px" }, // good for narrow sidebars, small cards
				sm: { value: "336px" }, // 21rem, nice for smaller cards or form sections
				md: { value: "400px" }, // standard cards, modals
				lg: { value: "512px" }, // larger cards/modals
				xl: { value: "640px" }, // wider modals or dialogs
				"2xl": { value: "768px" }, // full-width content on small screens
				"3xl": { value: "960px" }, // article width
				"4xl": { value: "1140px" }, // wide layout max
				full: { value: "100%" },
			},
			radii: {
				none: { value: "0" },
				sm: { value: "0.125rem" },
				md: { value: "0.375rem" },
				lg: { value: "0.5rem" },
				xl: { value: "1rem" },
				"2xl": { value: "2rem" },
				pill: { value: "9999px" },
				full: { value: "9999px" },
			},
			colors: {
				primary: {
					DEFAULT: { value: "#10B981" },
					light: { value: "#34D399" },
					dark: { value: "#059669" },
				},
				secondary: {
					DEFAULT: { value: "#6366F1" },
					light: { value: "#818CF8" },
					dark: { value: "#4F46E5" },
				},
				neutral: {
					0: { value: "#FFFFFF" },
					50: { value: "#FAFAFA" },
					100: { value: "#F5F5F5" },
					200: { value: "#E5E7EB" },
					300: { value: "#D1D5DB" },
					400: { value: "#9CA3AF" },
					500: { value: "#6B7280" },
					600: { value: "#4B5563" },
					700: { value: "#374151" },
					800: { value: "#1F2937" },
					900: { value: "#111827" },
				},
				danger: {
					DEFAULT: { value: "#EF4444" },
					light: { value: "#F87171" },
					dark: { value: "#B91C1C" },
				},
				success: {
					DEFAULT: { value: "#22C55E" },
					light: { value: "#4ADE80" },
					dark: { value: "#15803D" },
				},
				warning: {
					DEFAULT: { value: "#F59E0B" },
					light: { value: "#FBBF24" },
					dark: { value: "#B45309" },
				},
			},
			fontWeights: {
				regular: { value: "400" },
				medium: { value: "500" },
				semibold: { value: "600" },
				bold: { value: "700" },
			},
			spacing: {
				xxs: { value: "0.125rem" }, // 2px
				xs: { value: "0.25rem" }, // 4px
				sm: { value: "0.5rem" }, // 8px
				md: { value: "0.75rem" }, // 12px
				lg: { value: "1rem" }, // 16px
				xl: { value: "1.25rem" }, // 20px
				"2xl": { value: "1.5rem" }, // 24px
				"3xl": { value: "2rem" }, // 32px
			},
			fontSizes: {
				xs: { value: "0.75rem" }, // 12px
				sm: { value: "0.875rem" }, // 14px
				md: { value: "1rem" }, // 16px (good default)
				lg: { value: "1.25rem" }, // 20px
				xl: { value: "1.5rem" }, // 24px
				"2xl": { value: "2rem" }, // 32px
				"3xl": { value: "2.5rem" }, // 40px
				"4xl": { value: "2.75rem" }, // 44px
				"5xl": { value: "3.5rem" }, // 56px
			},
			lineHeights: {
				tight: { value: "1.25" },
				normal: { value: "1.5" },
				relaxed: { value: "1.75" },
			},
		},
	},
	utilities: {
		outlineColor: {
			className: "outline",
			values: "colors",
			transform: (value) => ({ outlineColor: value }),
		},
		backgroundColor: {
			className: "bg",
			values: "colors",
			transform: (value) => ({ backgroundColor: value }),
		},
		borderRightColor: {
			className: "borderRight",
			values: "colors",
			transform: (value) => ({ borderRightColor: value }),
		},
		borderBottomColor: {
			className: "borderBottom",
			values: "colors",
			transform: (value) => ({ borderBottomColor: value }),
		},
		boxShadow: {
			className: "shadow",
			values: "shadows",
			transform: (value) => ({ boxShadow: value }),
		},
		maxWidth: {
			className: "maxWidth",
			values: "sizes",
			transform: (value) => ({ maxWidth: value }),
		},
		borderColor: {
			className: "border",
			values: "colors",
			transform: (value) => ({ borderColor: value }),
		},
		borderRadius: {
			className: "rounded",
			values: "radii",
			transform: (value) => ({ borderRadius: value }),
		},
		fontSize: {
			className: "text",
			values: "fontSizes",
			transform: (value) => ({ fontSize: value }),
		},
		lineHeight: {
			className: "leading",
			values: "lineHeights",
			transform: (value) => ({ lineHeight: value }),
		},
		fontWeight: {
			className: "fontWeight",
			values: "fontWeights",
			transform: (value) => ({ fontWeight: value }),
		},
		color: {
			className: "color",
			values: "colors",
			transform: (value) => ({ color: value }),
		},
		bg: {
			className: "bg",
			values: "colors",
			transform: (value) => ({ backgroundColor: value }),
		},
		mx: {
			className: "mx",
			values: "spacing",
			transform: (value) => ({
				marginLeft: value,
				marginRight: value,
			}),
		},
		p: {
			className: "p",
			values: "spacing",
			transform: (value) => ({
				paddingTop: value,
				paddingRight: value,
				paddingBottom: value,
				paddingLeft: value,
			}),
		},
		paddingX: {
			className: "px",
			values: "spacing",
			transform: (value) => ({ paddingLeft: value, paddingRight: value }),
		},
		paddingY: {
			className: "py",
			values: "spacing",
			transform: (value) => ({
				paddingTop: value,
				paddingBottom: value,
			}),
		},
		px: {
			className: "px",
			values: "spacing",
			transform: (value) => ({ paddingLeft: value, paddingRight: value }),
		},
		py: {
			className: "py",
			values: "spacing",
			transform: (value) => ({
				paddingTop: value,
				paddingBottom: value,
			}),
		},
		gap: {
			className: "gap",
			values: "spacing",
			transform: (value) => ({ gap: value }),
		},
		fill: {
			className: "fill",
			values: "colors",
			transform: (value) => ({ fill: value }),
		},
		my: {
			className: "my",
			values: "spacing",
			transform: (value) => ({
				marginTop: value,
				marginBottom: value,
			}),
		},
	},
	eject: true,
	presets: [],
	outdir: "src/styles/styled-system",
})
