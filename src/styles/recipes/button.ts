import { defineRecipe } from "@pandacss/dev"

export const button = defineRecipe({
	className: "button",
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "2",
		fontFamily: "sans",
		fontWeight: "semibold",
		letterSpacing: "wide",
		borderRadius: "md",
		borderWidth: "1",
		borderStyle: "solid",
		borderColor: "transparent",
		cursor: "pointer",
		whiteSpace: "nowrap",
		textDecoration: "none",
		flexShrink: 0,
		transition: "colors 0.12s ease, box-shadow 0.12s ease, transform 0.1s ease",
		userSelect: "none",

		_focusVisible: {
			outline: "2px solid token(colors.teal.300)",
			outlineOffset: "2px",
		},
		"&[data-disabled]": {
			opacity: "50",
			cursor: "not-allowed",
			pointerEvents: "none",
		},
		"&[data-loading]": {
			opacity: "70",
			cursor: "not-allowed",
			pointerEvents: "none",
		},
	},

	variants: {
		// ---------------------------------------------------------------
		// appearance — how the button is drawn
		// ---------------------------------------------------------------
		appearance: {
			solid: {}, // filled bg — compound variants flesh this out
			outline: {
				// transparent bg, visible border
				bg: "transparent",
			},
			ghost: {
				// no bg, no border
				bg: "transparent",
				borderColor: "transparent",
			},
			subtle: {
				// tinted bg, light-tinted border — compound variants set colors
			},
		},

		// ---------------------------------------------------------------
		// intent — semantic colour role
		// ---------------------------------------------------------------
		intent: {
			brand: {}, // teal — primary product colour
			accent: {}, // coral — calls to action with energy
			neutral: {}, // grey — secondary actions
			danger: {}, // red — destructive actions
		},

		// ---------------------------------------------------------------
		// size
		// ---------------------------------------------------------------
		size: {
			xs: {
				fontSize: "xs",
				px: "1.5",
				py: "1",
				minH: "6",
			},
			sm: {
				fontSize: "xs",
				px: "3",
				py: "1.5",
				minH: "8",
			},
			md: {
				fontSize: "sm",
				px: "4",
				py: "2",
				minH: "10",
			},
			lg: {
				fontSize: "md",
				px: "6",
				py: "2.5",
				minH: "12",
			},
		},

		fullWidth: {
			true: { w: "full" },
		},

		// Opt-in hover lift — use only on prominent CTAs
		lift: {
			true: {},
		},
	},

	// ---------------------------------------------------------------
	// Compound variants — appearance × intent matrix
	// ---------------------------------------------------------------
	compoundVariants: [
		// ── solid × brand ──────────────────────────────────────────────
		{
			appearance: "solid",
			intent: "brand",
			css: {
				bg: "brand.default",
				color: "brand.fg",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "brand.emphasis",
				},
			},
		},

		// ── solid × accent ─────────────────────────────────────────────
		{
			appearance: "solid",
			intent: "accent",
			css: {
				bg: "accent.default",
				color: "accent.fg",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "accent.emphasis",
				},
			},
		},

		// ── solid × neutral ────────────────────────────────────────────
		{
			appearance: "solid",
			intent: "neutral",
			css: {
				bg: "white",
				color: "fg.default",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "stone.100",
				},
			},
		},

		// ── solid × danger ─────────────────────────────────────────────
		{
			appearance: "solid",
			intent: "danger",
			css: {
				bg: "danger.default",
				color: "danger.fg",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "danger.emphasis",
				},
			},
		},

		// ── outline × brand ────────────────────────────────────────────
		{
			appearance: "outline",
			intent: "brand",
			css: {
				borderColor: "brand.default",
				color: "brand.default",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "brand.subtle",
					borderColor: "brand.emphasis",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "brand.muted",
				},
			},
		},

		// ── outline × accent ───────────────────────────────────────────
		{
			appearance: "outline",
			intent: "accent",
			css: {
				borderColor: "accent.default",
				color: "accent.default",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "accent.subtle",
					borderColor: "accent.emphasis",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "accent.muted",
				},
			},
		},

		// ── outline × neutral ──────────────────────────────────────────
		{
			appearance: "outline",
			intent: "neutral",
			css: {
				bg: "white",
				borderColor: "border.default",
				color: "fg.default",
				"&:not([data-disabled]):not([data-loading]):hover": {
					borderColor: "border.strong",
					bg: "stone.100",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "bg.muted",
				},
			},
		},

		// ── outline × danger ───────────────────────────────────────────
		{
			appearance: "outline",
			intent: "danger",
			css: {
				borderColor: "danger.default",
				color: "danger.default",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "danger.subtle",
					borderColor: "danger.emphasis",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "danger.muted",
				},
			},
		},

		// ── ghost × brand ──────────────────────────────────────────────
		{
			appearance: "ghost",
			intent: "brand",
			css: {
				color: "brand.default",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "brand.subtle",
					color: "brand.emphasis",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "brand.muted",
				},
			},
		},

		// ── ghost × neutral ────────────────────────────────────────────
		{
			appearance: "ghost",
			intent: "neutral",
			css: {
				color: "fg.muted",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "bg.base",
					color: "fg.default",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "bg.muted",
				},
			},
		},

		// ── ghost × danger ─────────────────────────────────────────────
		{
			appearance: "ghost",
			intent: "danger",
			css: {
				color: "danger.default",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "danger.subtle",
					color: "danger.emphasis",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "danger.muted",
				},
			},
		},

		// ── subtle × brand ─────────────────────────────────────────────
		{
			appearance: "subtle",
			intent: "brand",
			css: {
				bg: "brand.subtle",
				color: "brand.emphasis",
				borderColor: "brand.muted",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "brand.muted",
					borderColor: "teal.300",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "brand.muted",
				},
			},
		},

		// ── subtle × accent ────────────────────────────────────────────
		{
			appearance: "subtle",
			intent: "accent",
			css: {
				bg: "accent.subtle",
				color: "accent.emphasis",
				borderColor: "accent.muted",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "accent.muted",
					borderColor: "coral.300",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "accent.muted",
				},
			},
		},

		// ── subtle × neutral ───────────────────────────────────────────
		{
			appearance: "subtle",
			intent: "neutral",
			css: {
				bg: "bg.muted",
				color: "fg.default",
				borderColor: "border.subtle",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "border.default",
					borderColor: "border.default",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "border.strong",
				},
			},
		},

		// ── subtle × danger ────────────────────────────────────────────
		{
			appearance: "subtle",
			intent: "danger",
			css: {
				bg: "danger.subtle",
				color: "danger.emphasis",
				borderColor: "danger.muted",
				"&:not([data-disabled]):not([data-loading]):hover": {
					bg: "danger.muted",
					borderColor: "danger.default",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					bg: "danger.muted",
				},
			},
		},

		// ── lift ───────────────────────────────────────────────────────
		// Placed last so it wins the cascade over appearance×intent blocks.
		{
			lift: true,
			css: {
				"&:not([data-disabled]):not([data-loading]):hover": {
					transform: "translateY(-1px)",
				},
				"&:not([data-disabled]):not([data-loading]):active": {
					transform: "translateY(0)",
				},
			},
		},
	],

	defaultVariants: {
		appearance: "solid",
		intent: "brand",
		size: "md",
	},
})
