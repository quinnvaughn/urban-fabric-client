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

		// Entry animation — slides in from the right
		"@keyframes toastIn": {
			from: { opacity: "0", transform: "translateX(16px)" },
			to: { opacity: "1", transform: "translateX(0)" },
		},
		"@keyframes toastOut": {
			from: { opacity: "1", transform: "translateX(0)" },
			to: { opacity: "0", transform: "translateX(16px)" },
		},
		animation: "toastIn 0.2s ease forwards",

		"&[data-closing]": {
			animation: "toastOut 0.18s ease forwards",
		},
	},

	variants: {
		intent: {
			success: {
				bg: "success.subtle",
				borderColor: "success.muted",
				color: "success.fg",
			},
			error: {
				bg: "danger.subtle",
				borderColor: "danger.muted",
				color: "danger.fg",
			},
			warning: {
				bg: "warning.subtle",
				borderColor: "warning.muted",
				color: "warning.fg",
			},
			info: {
				bg: "bg.base",
				borderColor: "border.default",
				color: "fg.default",
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
