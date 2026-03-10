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
		// ── Size — controls padding across all slots ───────────────────
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

		// ── Variant — visual style ─────────────────────────────────────
		variant: {
			elevated: {},
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

		// ── Shadow — resting elevation ─────────────────────────────────
		shadow: {
			none: { root: { boxShadow: "none" } },
			sm: { root: { boxShadow: "sm" } },
			md: { root: { boxShadow: "md" } },
			lg: { root: { boxShadow: "lg" } },
		},

		// ── Lift — interactive hover behavior ─────────────────────────
		// Controls transform amount only. Shadow step-up is handled
		// via compound variants below.
		lift: {
			sm: {
				root: {
					transition: "box-shadow 0.15s ease, transform 0.15s ease",
					"&:hover": { transform: "translateY(-1px)" },
					"&:active": { transform: "translateY(0)" },
				},
			},
			md: {
				root: {
					transition: "box-shadow 0.2s ease, transform 0.2s ease",
					"&:hover": { transform: "translateY(-2px)" },
					"&:active": { transform: "translateY(-1px)" },
				},
			},
			lg: {
				root: {
					transition: "box-shadow 0.2s ease, transform 0.2s ease",
					"&:hover": { transform: "translateY(-4px)" },
					"&:active": { transform: "translateY(-1px)" },
				},
			},
		},
	},

	// ── Compound variants — shadow × lift matrix ───────────────────────
	// Each combination steps the shadow up proportionally on hover.
	compoundVariants: [
		// shadow: none
		{
			shadow: "none",
			lift: "sm",
			css: {
				root: {
					"&:hover": { boxShadow: "sm" },
					"&:active": { boxShadow: "none" },
				},
			},
		},
		{
			shadow: "none",
			lift: "md",
			css: {
				root: {
					"&:hover": { boxShadow: "md" },
					"&:active": { boxShadow: "sm" },
				},
			},
		},
		{
			shadow: "none",
			lift: "lg",
			css: {
				root: {
					"&:hover": { boxShadow: "lg" },
					"&:active": { boxShadow: "md" },
				},
			},
		},

		// shadow: sm
		{
			shadow: "sm",
			lift: "sm",
			css: {
				root: {
					"&:hover": { boxShadow: "md" },
					"&:active": { boxShadow: "sm" },
				},
			},
		},
		{
			shadow: "sm",
			lift: "md",
			css: {
				root: {
					"&:hover": { boxShadow: "lg" },
					"&:active": { boxShadow: "md" },
				},
			},
		},
		{
			shadow: "sm",
			lift: "lg",
			css: {
				root: {
					"&:hover": { boxShadow: "2xl" },
					"&:active": { boxShadow: "lg" },
				},
			},
		},

		// shadow: md
		{
			shadow: "md",
			lift: "sm",
			css: {
				root: {
					"&:hover": { boxShadow: "lg" },
					"&:active": { boxShadow: "md" },
				},
			},
		},
		{
			shadow: "md",
			lift: "md",
			css: {
				root: {
					"&:hover": { boxShadow: "xl" },
					"&:active": { boxShadow: "lg" },
				},
			},
		},
		{
			shadow: "md",
			lift: "lg",
			css: {
				root: {
					"&:hover": { boxShadow: "2xl" },
					"&:active": { boxShadow: "xl" },
				},
			},
		},

		// shadow: lg
		{
			shadow: "lg",
			lift: "sm",
			css: {
				root: {
					"&:hover": { boxShadow: "xl" },
					"&:active": { boxShadow: "lg" },
				},
			},
		},
		{
			shadow: "lg",
			lift: "md",
			css: {
				root: {
					"&:hover": { boxShadow: "2xl" },
					"&:active": { boxShadow: "xl" },
				},
			},
		},
		{
			shadow: "lg",
			lift: "lg",
			css: {
				root: {
					"&:hover": { boxShadow: "2xl" },
					"&:active": { boxShadow: "xl" },
				},
			},
		},
	],

	defaultVariants: {
		size: "md",
		variant: "elevated",
		shadow: "lg",
	},
})
