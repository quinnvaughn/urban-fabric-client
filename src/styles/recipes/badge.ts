import { defineRecipe } from "@pandacss/dev"

export const badge = defineRecipe({
	className: "badge",
	base: {
		display: "inline-flex",
		alignItems: "center",
		gap: "1.5",
		fontFamily: "sans",
		fontWeight: "semibold",
		letterSpacing: "wider",
		borderRadius: "full",
		whiteSpace: "nowrap",
		alignSelf: "flex-start",
	},
	variants: {
		appearance: {
			subtle: {}, // current behavior, tones handle the colors
			solid: {
				border: "none",
			},
		},
		uppercase: {
			true: { textTransform: "uppercase", letterSpacing: "wider" },
		},
		size: {
			xs: { fontSize: "xxs", paddingInline: "1.5", paddingBlock: "0.5" }, // 0.75rem, 6px/2px
			sm: { fontSize: "xs", paddingInline: "2", paddingBlock: "1" }, // 0.75rem, 8px/4px
			md: { fontSize: "sm", paddingInline: "2.5", paddingBlock: "1" }, // 0.875rem, 10px/4px
		},
		tone: {
			default: {
				background: "bg.muted",
				color: "fg.muted",
				border: "1px solid {colors.border.subtle}",
			},
			muted: {
				background: "bg.base",
				color: "fg.subtle",
				border: "1px solid {colors.border.subtle}",
			},
			neutral: {
				background: "bg.muted",
				color: "fg.default",
				border: "1px solid {colors.border.default}",
			},
			brand: {
				background: "brand.subtle",
				color: "brand.default",
				border: "1px solid {colors.brand.muted}",
			},
			accent: {
				background: "accent.subtle",
				color: "accent.default",
				border: "1px solid {colors.accent.muted}",
			},
			success: {
				background: "success.subtle",
				color: "success.default",
				border: "1px solid {colors.success.muted}",
			},
			danger: {
				background: "danger.subtle",
				color: "danger.default",
				border: "1px solid {colors.danger.muted}",
			},
			warning: {
				background: "warning.subtle",
				color: "warning.default",
				border: "1px solid {colors.warning.muted}",
			},
		},
	},
	compoundVariants: [
		{
			appearance: "solid",
			tone: "brand",
			css: { background: "brand.default", color: "brand.fg" },
		},
		{
			appearance: "solid",
			tone: "accent",
			css: { background: "accent.default", color: "accent.fg" },
		},
		{
			appearance: "solid",
			tone: "success",
			css: { background: "success.default", color: "success.fg" },
		},
		{
			appearance: "solid",
			tone: "danger",
			css: { background: "danger.default", color: "danger.fg" },
		},
		{
			appearance: "solid",
			tone: "warning",
			css: { background: "warning.default", color: "warning.fg" },
		},
		{
			appearance: "solid",
			tone: "default",
			css: { background: "fg.default", color: "bg.base" },
		},
		{
			appearance: "solid",
			tone: "neutral",
			css: { background: "fg.muted", color: "bg.base", border: "none" },
		},
	],
	defaultVariants: {
		size: "xs",
		tone: "default",
		appearance: "subtle",
		uppercase: false,
	},
})
