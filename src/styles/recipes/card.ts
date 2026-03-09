import { defineSlotRecipe } from "@pandacss/dev"

export const card = defineSlotRecipe({
	className: "card",
	slots: ["root", "media", "header", "body", "footer"],

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
		media: {
			overflow: "hidden",
			flexShrink: 0,
			"& img, & svg, & video": {
				display: "block",
				width: "full",
				height: "full",
				objectFit: "cover",
			},
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
				media: { aspectRatio: "video" },
				header: { px: "4", py: "3" },
				body: { px: "4", py: "3" },
				footer: { px: "4", py: "3" },
			},
			md: {
				media: { aspectRatio: "video" },
				header: { px: "8", py: "6" },
				body: { px: "8", py: "8" },
				footer: { px: "8", py: "5" },
			},
			lg: {
				media: { aspectRatio: "video" },
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
		lift: {
			true: {
				root: {
					transition: "box-shadow 0.2s ease, transform 0.2s ease",
					"&:hover": {
						transform: "translateY(-3px)",
						boxShadow: "2xl",
					},
					"&:active": {
						transform: "translateY(-1px)",
						boxShadow: "lg",
					},
				},
			},
		},
	},

	defaultVariants: {
		size: "md",
		variant: "elevated",
	},
})
