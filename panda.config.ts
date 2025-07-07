import { defineConfig } from "@pandacss/dev"

export default defineConfig({
	staticCss: {
		recipes: {
			flex: ["*"],
			typography: ["*"],
		},
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
	},
	// Useful for theme customization
	theme: {
		recipes: {
			button: {
				className: "button",
				base: {
					cursor: "pointer",
					transition: "background-color 0.2s ease, color 0.2s ease",
				},
				variants: {
					variant: {
						primary: {
							bg: "{colors.primary}",
							color: "{colors.surface}",
							fontWeight: "{fontWeights.bold}",
							borderRadius: "xl",
							textDecoration: "none",
							px: "{spacing.xl}",
							py: "{spacing.md}",
							_hover: { bg: "{colors.secondary}" },
						},
						secondary: {
							bg: "transparent",
							color: "{colors.primary}",
							fontWeight: "{fontWeights.bold}",
							border: "2px solid {colors.primary}",
							borderRadius: "xl",
							textDecoration: "none",
							px: "{spacing.xl}",
							py: "{spacing.md}",
							_hover: { bg: "{colors.muted}" },
						},
					},
					size: {
						sm: { fontSize: "{fontSizes.sm}" },
						md: { fontSize: "{fontSizes.md}" },
						lg: { fontSize: "{fontSizes.lg}" },
					},
				},
				defaultVariants: {
					variant: "primary",
					size: "md",
				},
			},
			flex: {
				className: "flex",
				base: {
					display: "flex",
				},
				variants: {
					direction: {
						row: { flexDirection: "row" },
						"row-reverse": { flexDirection: "row-reverse" },
						column: { flexDirection: "column" },
						"column-reverse": { flexDirection: "column-reverse" },
					},
					align: {
						stretch: { alignItems: "stretch" },
						center: { alignItems: "center" },
						start: { alignItems: "flex-start" },
						end: { alignItems: "flex-end" },
						baseline: { alignItems: "baseline" },
					},
					justify: {
						start: { justifyContent: "flex-start" },
						end: { justifyContent: "flex-end" },
						center: { justifyContent: "center" },
						between: { justifyContent: "space-between" },
						around: { justifyContent: "space-around" },
						evenly: { justifyContent: "space-evenly" },
					},
					gap: {
						xxs: { gap: "{spacing.xxs}" },
						xs: { gap: "{spacing.xs}" },
						sm: { gap: "{spacing.sm}" },
						md: { gap: "{spacing.md}" },
						lg: { gap: "{spacing.lg}" },
						xl: { gap: "{spacing.xl}" },
						"2xl": { gap: "{spacing.2xl}" },
						"3xl": { gap: "{spacing.3xl}" },
					},
				},
				defaultVariants: {
					direction: "row",
					align: "stretch",
					justify: "start",
				},
			},
			typography: {
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
					},
					weight: {
						regular: { fontWeight: "{fontWeights.regular}" },
						medium: { fontWeight: "{fontWeights.medium}" },
						semibold: { fontWeight: "{fontWeights.semibold}" },
						bold: { fontWeight: "{fontWeights.bold}" },
					},
					color: {
						text: { color: "{colors.text}" },
						secondary: { color: "{colors.textSecondary}" },
						primary: { color: "{colors.primary}" },
						danger: { color: "{colors.danger}" },
					},
				},
				defaultVariants: {
					textStyle: "md",
					weight: "regular",
					color: "text",
				},
			},
		},
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
		},
		tokens: {
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
				primary: { value: "#10B981" },
				secondary: { value: "#6366F1" },
				background: { value: "#F8FAFC" },
				surface: { value: "#FFFFFF" },
				muted: { value: "#E5E7EB" },
				text: { value: "#111827" },
				textSecondary: { value: "#6B7280" },
				highlight: { value: "#F59E42" },
				danger: { value: "#EF4444" },
				info: { value: "#0EA5E9" },
			},
			fontWeights: {
				regular: { value: "400" },
				medium: { value: "500" },
				semibold: { value: "600" },
				bold: { value: "700" },
			},
			spacing: {
				xxs: { value: "0.25rem" }, // 4px
				xs: { value: "0.5rem" }, // 8px
				sm: { value: "0.75rem" }, // 12px
				md: { value: "1rem" }, // 16px
				lg: { value: "1.5rem" }, // 24px
				xl: { value: "2rem" }, // 32px
				"2xl": { value: "3rem" }, // 48px
				"3xl": { value: "4rem" }, // 64px
			},
			fontSizes: {
				xs: { value: "0.75rem" }, // 12px
				sm: { value: "0.875rem" }, // 14px
				md: { value: "1rem" }, // 16px (good default)
				lg: { value: "1.25rem" }, // 20px
				xl: { value: "1.5rem" }, // 24px
				"2xl": { value: "2rem" }, // 32px
				"3xl": { value: "2.5rem" }, // 40px
				"4xl": { value: "3rem" }, // 48px
				"5xl": { value: "4rem" }, // 64px
			},
			lineHeights: {
				tight: { value: "1.25" },
				normal: { value: "1.5" },
				relaxed: { value: "1.75" },
			},
		},
	},
	utilities: {
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
	},
	eject: true,
	presets: [],
	// The output directory for your css system
	outdir: "styled-system",
})
