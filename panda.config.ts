import { defineConfig } from "@pandacss/dev"

export default defineConfig({
	staticCss: {
		recipes: {
			flex: ["*"],
			typography: ["*"],
			container: ["*"],
			input: ["*"],
			button: ["*"],
			link: ["*"],
			grid: ["*"],
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
		focusWithin: "&:focus-within",
	},
	// Useful for theme customization
	theme: {
		recipes: {
			grid: {
				className: "grid",
				base: {
					display: "grid",
				},
				variants: {
					gap: {
						xxs: { gap: "{spacing.xxs}" },
						xs: { gap: "{spacing.xs}" },
						sm: { gap: "{spacing.sm}" },
						md: { gap: "{spacing.md}" },
						lg: { gap: "{spacing.lg}" },
						xl: { gap: "{spacing.xl}" },
						"2xl": { gap: "{spacing.2xl}" },
					},
					rowGap: {
						xs: { rowGap: "{spacing.xs}" },
						sm: { rowGap: "{spacing.sm}" },
						md: { rowGap: "{spacing.md}" },
					},
					columnGap: {
						xs: { columnGap: "{spacing.xs}" },
						sm: { columnGap: "{spacing.sm}" },
						md: { columnGap: "{spacing.md}" },
					},
					autoFlow: {
						row: { gridAutoFlow: "row" },
						column: { gridAutoFlow: "column" },
						dense: { gridAutoFlow: "dense" },
						"row-dense": { gridAutoFlow: "row dense" },
						"column-dense": { gridAutoFlow: "column dense" },
					},
					alignItems: {
						start: { alignItems: "start" },
						center: { alignItems: "center" },
						end: { alignItems: "end" },
						stretch: { alignItems: "stretch" },
					},
					justifyItems: {
						start: { justifyItems: "start" },
						center: { justifyItems: "center" },
						end: { justifyItems: "end" },
						stretch: { justifyItems: "stretch" },
					},
					placeItems: {
						center: { placeItems: "center" },
						start: { placeItems: "start" },
						end: { placeItems: "end" },
						stretch: { placeItems: "stretch" },
					},
				},
			},
			link: {
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
			},
			input: {
				className: "input",
				base: {
					width: "100%",
					px: "md",
					py: "sm",
					fontSize: "md",
					border: "1px solid",
					borderRadius: "lg",
					bg: "{colors.surface}",
					color: "{colors.neutral.900}",
					borderColor: "{colors.neutral.200}",
					outline: "none",
					_focus: { borderColor: "{colors.primary}" },
					_focusWithin: { borderColor: "{colors.primary}" },
					_disabled: {
						bg: "{colors.neutral.100}",
						color: "{colors.neutral.500}",
						cursor: "not-allowed",
					},
					transition: "border-color 0.2s ease",
				},
				variants: {
					error: {
						true: { borderColor: "{colors.danger}" },
						false: {},
					},
				},
			},
			container: {
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
			},
			button: {
				className: "button",
				base: {
					cursor: "pointer",
					transition: "background-color 0.2s ease, color 0.2s ease",
					borderRadius: "xl",
					color: "{colors.neutral.50}", // default white text for solid
				},
				variants: {
					variant: {
						solid: {},
						outline: {
							bg: "transparent",
							border: "1px solid",
							color: "{colors.neutral.900}",
						},
						ghost: { bg: "transparent" },
					},
					intent: {
						primary: {},
						secondary: {},
						danger: {},
						success: {},
						warning: {},
					},
					size: {
						sm: {
							fontSize: "{fontSizes.sm}",
							px: "{spacing.sm}",
							py: "{spacing.xs}",
						},
						md: {
							fontSize: "{fontSizes.md}",
							px: "{spacing.md}",
							py: "{spacing.sm}",
						},
						lg: {
							fontSize: "{fontSizes.md}",
							px: "{spacing.lg}",
							py: "{spacing.md}",
						},
					},
				},
				compoundVariants: [
					// ────────────────── SOLID VARIANTS ──────────────────
					{
						variant: "solid",
						intent: "primary",
						css: {
							bg: "{colors.primary}",
							_hover: { bg: "{colors.primary.light}" },
							_active: { bg: "{colors.primary.dark}" },
							_disabled: { bg: "{colors.primary}", opacity: 0.6 },
						},
					},
					{
						variant: "solid",
						intent: "secondary",
						css: {
							bg: "{colors.secondary}",
							_hover: { bg: "{colors.secondary.light}" },
							_active: { bg: "{colors.secondary.dark}" },
							_disabled: { bg: "{colors.secondary}", opacity: 0.6 },
						},
					},
					{
						variant: "solid",
						intent: "danger",
						css: {
							bg: "{colors.danger}",
							_hover: { bg: "{colors.danger.light}" },
							_active: { bg: "{colors.danger.dark}" },
							_disabled: { bg: "{colors.danger}", opacity: 0.6 },
						},
					},
					{
						variant: "solid",
						intent: "success",
						css: {
							bg: "{colors.success}",
							_hover: { bg: "{colors.success.light}" },
							_active: { bg: "{colors.success.dark}" },
							_disabled: { bg: "{colors.success}", opacity: 0.6 },
						},
					},
					{
						variant: "solid",
						intent: "warning",
						css: {
							bg: "{colors.warning}",
							_hover: { bg: "{colors.warning.light}" },
							_active: { bg: "{colors.warning.dark}" },
							_disabled: { bg: "{colors.warning}", opacity: 0.6 },
						},
					},

					// ───────────────── OUTLINE VARIANTS ─────────────────
					{
						variant: "outline",
						intent: "primary",
						css: {
							borderColor: "{colors.primary}",
							color: "{colors.primary}",
							_hover: {
								bg: "{colors.primary.light}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.primary.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: {
								borderColor: "{colors.primary}",
								color: "{colors.neutral.500}",
							},
						},
					},
					{
						variant: "outline",
						intent: "secondary",
						css: {
							borderColor: "{colors.secondary}",
							color: "{colors.secondary}",
							_hover: {
								bg: "{colors.secondary.light}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.secondary.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: {
								borderColor: "{colors.secondary}",
								color: "{colors.neutral.500}",
							},
						},
					},
					{
						variant: "outline",
						intent: "danger",
						css: {
							borderColor: "{colors.danger}",
							color: "{colors.danger}",
							_hover: {
								bg: "{colors.danger.light}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.danger.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: {
								borderColor: "{colors.danger}",
								color: "{colors.neutral.500}",
							},
						},
					},
					{
						variant: "outline",
						intent: "success",
						css: {
							borderColor: "{colors.success}",
							color: "{colors.success}",
							_hover: {
								bg: "{colors.success.light}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.success.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: {
								borderColor: "{colors.success}",
								color: "{colors.neutral.500}",
							},
						},
					},
					{
						variant: "outline",
						intent: "warning",
						css: {
							borderColor: "{colors.warning}",
							color: "{colors.warning}",
							_hover: {
								bg: "{colors.warning.light}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.warning.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: {
								borderColor: "{colors.warning}",
								color: "{colors.neutral.500}",
							},
						},
					},

					// ────────────────── GHOST VARIANTS ──────────────────
					{
						variant: "ghost",
						intent: "primary",
						css: {
							color: "{colors.primary}",
							_hover: {
								bg: "{colors.primary}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.primary.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: { color: "{colors.primary}", opacity: 0.6 },
						},
					},
					{
						variant: "ghost",
						intent: "secondary",
						css: {
							color: "{colors.secondary}",
							_hover: {
								bg: "{colors.secondary}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.secondary.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: { color: "{colors.secondary}", opacity: 0.6 },
						},
					},
					{
						variant: "ghost",
						intent: "danger",
						css: {
							color: "{colors.danger}",
							_hover: {
								bg: "{colors.danger}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.danger.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: { color: "{colors.danger}", opacity: 0.6 },
						},
					},
					{
						variant: "ghost",
						intent: "success",
						css: {
							color: "{colors.success}",
							_hover: {
								bg: "{colors.success}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.success.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: { color: "{colors.success}", opacity: 0.6 },
						},
					},
					{
						variant: "ghost",
						intent: "warning",
						css: {
							color: "{colors.warning}",
							_hover: {
								bg: "{colors.warning}",
								color: "{colors.neutral.50}",
							},
							_active: {
								bg: "{colors.warning.dark}",
								color: "{colors.neutral.50}",
							},
							_disabled: { color: "{colors.warning}", opacity: 0.6 },
						},
					},
				],
				defaultVariants: {
					variant: "solid",
					intent: "primary",
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
					grow: {
						0: { flexGrow: 0 },
						1: { flexGrow: 1 },
						2: { flexGrow: 2 },
					},
					shrink: {
						0: { flexShrink: 0 },
						1: { flexShrink: 1 },
						2: { flexShrink: 2 },
					},
					basis: {
						auto: { flexBasis: "auto" },
						full: { flexBasis: "100%" },
						content: { flexBasis: "content" },
					},
					flex: {
						initial: { flex: "0 1 auto" },
						auto: { flex: "1 1 auto" },
						none: { flex: "none" },
						full: { flex: "1 1 100%" },
					},
					wrap: {
						noWrap: { flexWrap: "nowrap" },
						wrap: { flexWrap: "wrap" },
						"wrap-reverse": { flexWrap: "wrap-reverse" },
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
	},
	eject: true,
	presets: [],
	// The output directory for your css system
	outdir: "styled-system",
})
