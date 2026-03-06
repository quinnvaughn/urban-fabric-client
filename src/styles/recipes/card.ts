import { defineSlotRecipe } from "@pandacss/dev"

export const card = defineSlotRecipe({
	className: "card",
	slots: ["root", "header", "body", "footer"],

	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			background: "white",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.subtle",
			borderRadius: "lg",
			boxShadow: "lg",
			overflow: "hidden",
		},
		header: {
			display: "flex",
			flexDirection: "column",
			gap: "1",
			borderBottomWidth: "1",
			borderBottomStyle: "solid",
			borderBottomColor: "border.subtle",
		},
		body: {
			display: "flex",
			flexDirection: "column",
			flex: "1 1 auto",
		},
		footer: {
			display: "flex",
			alignItems: "center",
			borderTopWidth: "1",
			borderTopStyle: "solid",
			borderTopColor: "border.subtle",
		},
	},

	variants: {
		// Controls padding across all slots
		size: {
			sm: {
				header: { px: "4", py: "3" },
				body: { px: "4", py: "3" },
				footer: { px: "4", py: "3" },
			},
			md: {
				header: { px: "8", py: "6" },
				body: { px: "8", py: "8" },
				footer: { px: "8", py: "5" },
			},
			lg: {
				header: { px: "10", py: "8" },
				body: { px: "10", py: "10" },
				footer: { px: "10", py: "6" },
			},
		},
		// Visual elevation
		variant: {
			elevated: {
				// default — white with shadow
			},
			flat: {
				root: {
					boxShadow: "none",
					borderColor: "border.default",
				},
			},
			filled: {
				root: {
					background: "bg.base",
					boxShadow: "none",
					borderColor: "border.subtle",
				},
			},
		},
	},

	defaultVariants: {
		size: "md",
		variant: "elevated",
	},
})
