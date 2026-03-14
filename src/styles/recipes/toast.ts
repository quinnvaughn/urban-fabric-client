import { defineRecipe } from "@pandacss/dev"

export const toast = defineRecipe({
	className: "toast",
	base: {
		display: "grid",
		gridTemplateColumns: "auto 1fr auto",
		alignItems: "start",
		gap: "3",
		fontFamily: "sans",
		borderRadius: "md",
		borderWidth: "1",
		borderStyle: "solid",
		boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
		pointerEvents: "auto",
		position: "relative",
		overflow: "hidden",
		animation: "toastIn 0.2s ease forwards",

		"&[data-closing]": {
			animation: "toastOut 0.18s ease forwards",
		},
	},

	variants: {
		intent: {
			success: {
				bg: "success.default",
				borderColor: "success.emphasis",
				color: "success.fg",
			},
			error: {
				bg: "danger.default",
				borderColor: "danger.emphasis",
				color: "danger.fg",
			},
			warning: {
				bg: "warning.default",
				borderColor: "warning.emphasis",
				color: "warning.fg",
			},
			info: {
				bg: "bg.emphasis",
				borderColor: "border.strong",
				color: "fg.onDark",
			},
		},

		size: {
			md: {
				px: "4",
				py: "3",
				minW: "280px",
				maxW: "400px",
			},
			compact: {
				px: "3",
				py: "2",
				minW: "220px",
				maxW: "320px",
			},
		},
	},

	defaultVariants: {
		intent: "info",
		size: "md",
	},
})
