import { defineRecipe } from "@pandacss/dev"

export const avatar = defineRecipe({
	className: "avatar",
	base: {
		borderRadius: "full",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		fontFamily: "sans",
		fontWeight: "medium",
		userSelect: "none",
	},
	variants: {
		appearance: {
			solid: {}, // tones handle colors, current behavior
			subtle: {}, // tones override via compoundVariants
		},
		size: {
			xxs: { width: "4.5", height: "4.5", fontSize: "4xs" },
			xs: { width: "6", height: "6", fontSize: "xxs" },
			sm: { width: "8", height: "8", fontSize: "xs" },
			md: { width: "10", height: "10", fontSize: "sm" },
			lg: { width: "12", height: "12", fontSize: "md" },
		},
		tone: {
			accent: { background: "accent.default", color: "accent.fg" },
			brand: { background: "brand.default", color: "brand.fg" },
			neutral: { background: "bg.muted", color: "fg.muted" },
			danger: { background: "danger.default", color: "danger.fg" },
			warning: { background: "warning.default", color: "warning.fg" },
			success: { background: "success.default", color: "success.fg" },
		},
	},
	compoundVariants: [
		{
			appearance: "subtle",
			tone: "accent",
			css: { background: "accent.subtle", color: "accent.default" },
		},
		{
			appearance: "subtle",
			tone: "brand",
			css: { background: "brand.subtle", color: "brand.default" },
		},
		{
			appearance: "subtle",
			tone: "neutral",
			css: { background: "bg.muted", color: "fg.muted" },
		},
		{
			appearance: "subtle",
			tone: "danger",
			css: { background: "danger.subtle", color: "danger.default" },
		},
		{
			appearance: "subtle",
			tone: "warning",
			css: { background: "warning.subtle", color: "warning.default" },
		},
		{
			appearance: "subtle",
			tone: "success",
			css: { background: "success.subtle", color: "success.default" },
		},
	],
	defaultVariants: {
		size: "sm",
		tone: "accent",
		appearance: "solid",
	},
})
