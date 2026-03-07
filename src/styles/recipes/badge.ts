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
		textTransform: "uppercase",
		borderRadius: "full",
		whiteSpace: "nowrap",
		alignSelf: "flex-start",
	},
	variants: {
		size: {
			sm: { fontSize: "xs", paddingInline: "2", paddingBlock: "0.5" },
			md: { fontSize: "xs", paddingInline: "2.5", paddingBlock: "1" },
		},
		tone: {
			default: {
				background: "bg.muted",
				color: "fg.muted",
				border: "1px solid {colors.border.subtle}",
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
	defaultVariants: {
		size: "md",
		tone: "default",
	},
})
