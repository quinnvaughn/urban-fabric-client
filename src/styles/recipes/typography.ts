import { defineSlotRecipe } from "@pandacss/dev"

export const typography = defineSlotRecipe({
	className: "typography",
	slots: ["text", "heading"],

	base: {
		text: {
			fontFamily: "sans",
			color: "fg.default",
			lineHeight: "normal",
		},
		heading: {
			fontFamily: "sans",
			color: "fg.default",
			lineHeight: "tight",
			fontWeight: "bold",
		},
	},

	variants: {
		// ── Text size ─────────────────────────────────────────────────────────
		textSize: {
			xs: { text: { fontSize: "xs" } },
			sm: { text: { fontSize: "sm" } },
			md: { text: { fontSize: "md" } },
			lg: { text: { fontSize: "lg" } },
			xl: { text: { fontSize: "xl" } },
			"2xl": { text: { fontSize: "2xl" } },
		},

		// ── Heading size ──────────────────────────────────────────────────────
		headingSize: {
			sm: { heading: { fontSize: "xl" } },
			md: { heading: { fontSize: "2xl" } },
			lg: { heading: { fontSize: "3xl" } },
			xl: { heading: { fontSize: "4xl" } },
			"2xl": { heading: { fontSize: "5xl" } },
		},

		// ── Font family (headings can go serif) ───────────────────────────────
		font: {
			sans: { heading: { fontFamily: "sans" }, text: { fontFamily: "sans" } },
			serif: {
				heading: { fontFamily: "serif" },
				text: { fontFamily: "serif" },
			},
			mono: { heading: { fontFamily: "mono" }, text: { fontFamily: "mono" } },
		},

		// ── Weight ────────────────────────────────────────────────────────────
		weight: {
			normal: {
				text: { fontWeight: "normal" },
				heading: { fontWeight: "normal" },
			},
			medium: {
				text: { fontWeight: "medium" },
				heading: { fontWeight: "medium" },
			},
			semibold: {
				text: { fontWeight: "semibold" },
				heading: { fontWeight: "semibold" },
			},
			bold: { text: { fontWeight: "bold" }, heading: { fontWeight: "bold" } },
		},

		// ── Color ─────────────────────────────────────────────────────────────
		tone: {
			default: {
				text: { color: "fg.default" },
				heading: { color: "fg.default" },
			},
			muted: { text: { color: "fg.muted" }, heading: { color: "fg.muted" } },
			subtle: { text: { color: "fg.subtle" }, heading: { color: "fg.subtle" } },
			brand: {
				text: { color: "brand.default" },
				heading: { color: "brand.default" },
			},
			accent: {
				text: { color: "accent.default" },
				heading: { color: "accent.default" },
			},
			danger: {
				text: { color: "danger.default" },
				heading: { color: "danger.default" },
			},
			warning: {
				text: { color: "warning.default" },
				heading: { color: "warning.default" },
			},
			success: {
				text: { color: "success.default" },
				heading: { color: "success.default" },
			},
		},
	},

	defaultVariants: {
		textSize: "md",
		headingSize: "md",
		font: "sans",
		tone: "default",
	},
})
