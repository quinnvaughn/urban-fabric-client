import { defineSlotRecipe } from "@pandacss/dev"

export const typography = defineSlotRecipe({
	className: "typography",
	slots: ["text", "heading", "inline"],

	base: {
		text: {
			fontFamily: "sans",
			color: "fg.default",
			lineHeight: "normal",
			letterSpacing: "normal",
		},
		heading: {
			fontFamily: "sans",
			color: "fg.default",
			lineHeight: "tight",
			letterSpacing: "snug",
			fontWeight: "bold",
		},
		inline: {
			fontFamily: "inherit",
			color: "inherit",
			lineHeight: "inherit",
			letterSpacing: "inherit",
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
			"3xl": { heading: { fontSize: "6xl" } },
			"4xl": { heading: { fontSize: "7xl" } },
		},

		// ── Font family ───────────────────────────────────────────────────────
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
			thin: {
				text: { fontWeight: "thin" },
				heading: { fontWeight: "thin" },
				inline: { fontWeight: "thin" },
			},
			light: {
				text: { fontWeight: "light" },
				heading: { fontWeight: "light" },
				inline: { fontWeight: "light" },
			},
			normal: {
				text: { fontWeight: "normal" },
				heading: { fontWeight: "normal" },
				inline: { fontWeight: "normal" },
			},
			medium: {
				text: { fontWeight: "medium" },
				heading: { fontWeight: "medium" },
				inline: { fontWeight: "medium" },
			},
			semibold: {
				text: { fontWeight: "semibold" },
				heading: { fontWeight: "semibold" },
				inline: { fontWeight: "semibold" },
			},
			bold: {
				text: { fontWeight: "bold" },
				heading: { fontWeight: "bold" },
				inline: { fontWeight: "bold" },
			},
		},

		// ── Line height ───────────────────────────────────────────────────────
		leading: {
			none: { text: { lineHeight: "none" }, heading: { lineHeight: "none" } },
			tight: {
				text: { lineHeight: "tight" },
				heading: { lineHeight: "tight" },
			},
			snug: { text: { lineHeight: "snug" }, heading: { lineHeight: "snug" } },
			normal: {
				text: { lineHeight: "normal" },
				heading: { lineHeight: "normal" },
			},
			relaxed: {
				text: { lineHeight: "relaxed" },
				heading: { lineHeight: "relaxed" },
			},
			loose: {
				text: { lineHeight: "loose" },
				heading: { lineHeight: "loose" },
			},
		},

		// ── Letter spacing ────────────────────────────────────────────────────
		tracking: {
			tight: {
				text: { letterSpacing: "tight" },
				heading: { letterSpacing: "tight" },
				inline: { letterSpacing: "tight" },
			},
			snug: {
				text: { letterSpacing: "snug" },
				heading: { letterSpacing: "snug" },
				inline: { letterSpacing: "snug" },
			},
			normal: {
				text: { letterSpacing: "normal" },
				heading: { letterSpacing: "normal" },
				inline: { letterSpacing: "normal" },
			},
			wide: {
				text: { letterSpacing: "wide" },
				heading: { letterSpacing: "wide" },
				inline: { letterSpacing: "wide" },
			},
			wider: {
				text: { letterSpacing: "wider" },
				heading: { letterSpacing: "wider" },
				inline: { letterSpacing: "wider" },
			},
			widest: {
				text: { letterSpacing: "widest" },
				heading: { letterSpacing: "widest" },
				inline: { letterSpacing: "widest" },
			},
		},

		// ── Text transform ────────────────────────────────────────────────────
		transform: {
			uppercase: {
				text: { textTransform: "uppercase" },
				heading: { textTransform: "uppercase" },
				inline: { textTransform: "uppercase" },
			},
			lowercase: {
				text: { textTransform: "lowercase" },
				heading: { textTransform: "lowercase" },
				inline: { textTransform: "lowercase" },
			},
			capitalize: {
				text: { textTransform: "capitalize" },
				heading: { textTransform: "capitalize" },
				inline: { textTransform: "capitalize" },
			},
			none: {
				text: { textTransform: "none" },
				heading: { textTransform: "none" },
				inline: { textTransform: "none" },
			},
		},

		// ── Tone ──────────────────────────────────────────────────────────────
		tone: {
			default: {
				text: { color: "fg.default" },
				heading: { color: "fg.default" },
				inline: { color: "fg.default" },
			},
			muted: {
				text: { color: "fg.muted" },
				heading: { color: "fg.muted" },
				inline: { color: "fg.muted" },
			},
			subtle: {
				text: { color: "fg.subtle" },
				heading: { color: "fg.subtle" },
				inline: { color: "fg.subtle" },
			},
			onDark: {
				text: { color: "fg.onDark" },
				heading: { color: "fg.onDark" },
				inline: { color: "fg.onDark" },
			},
			onDarkMuted: {
				text: { color: "stone.400" },
				heading: { color: "stone.400" },
				inline: { color: "stone.400" },
			},
			brand: {
				text: { color: "brand.default" },
				heading: { color: "brand.default" },
				inline: { color: "brand.default" },
			},
			accent: {
				text: { color: "accent.default" },
				heading: { color: "accent.default" },
				inline: { color: "accent.default" },
			},
			danger: {
				text: { color: "danger.default" },
				heading: { color: "danger.default" },
				inline: { color: "danger.default" },
			},
			warning: {
				text: { color: "warning.default" },
				heading: { color: "warning.default" },
				inline: { color: "warning.default" },
			},
			success: {
				text: { color: "success.default" },
				heading: { color: "success.default" },
				inline: { color: "success.default" },
			},
		},
	},

	defaultVariants: {
		textSize: "md",
		headingSize: "md",
		font: "sans",
		tone: "default",
		leading: "normal",
		tracking: "normal",
	},
})
