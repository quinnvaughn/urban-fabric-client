import { defineRecipe } from "@pandacss/dev"

export const button = defineRecipe({
	className: "button",
	base: {
		cursor: "pointer",
		transition: "background-color 0.2s ease, color 0.2s ease",
		color: "{colors.neutral.50}", // default white text for solid
		fontWeight: "{fontWeights.semibold}",
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
		borderRadius: {
			sm: { borderRadius: "{radii.sm}" },
			md: { borderRadius: "{radii.md}" },
			lg: { borderRadius: "{radii.lg}" },
			xl: { borderRadius: "{radii.xl}" },
			"2xl": { borderRadius: "{radii.2xl}" },
			"3xl": { borderRadius: "{radii.3xl}" },
			full: { borderRadius: "9999px" },
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
		borderRadius: "md",
	},
})
