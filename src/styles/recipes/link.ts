import { defineRecipe } from "@pandacss/dev"

export const link = defineRecipe({
	className: "link",
	base: {
		display: "inline-flex",
		alignItems: "center",
		gap: "1",
		fontFamily: "sans",
		fontWeight: "semibold",
		textDecoration: "none",
		borderRadius: "sm",
		transition: "colors 0.12s ease",
		cursor: "pointer",
		color: "brand.default",
		_hover: {
			color: "brand.emphasis",
			textDecoration: "underline",
		},
		_focusVisible: {
			outline: "2px solid token(colors.teal.300)",
			outlineOffset: "2px",
		},
		_disabled: {
			opacity: "50",
			cursor: "not-allowed",
			pointerEvents: "none",
		},
	},

	variants: {
		variant: {
			// Default — teal, used for nav/utility links (forgot password, etc.)
			default: {},
			// Sits inside body text, inherits size, adds underline
			inline: {
				color: "brand.default",
				textDecoration: "underline",
				textUnderlineOffset: "2px",
				fontWeight: "inherit",
				fontSize: "inherit",
			},
			// Coral — used for prominent CTAs like "Join Urban Fabric"
			accent: {
				color: "accent.default",
				_hover: {
					color: "accent.emphasis",
				},
			},
			// No color — inherits from parent, just adds hover underline
			subtle: {
				color: "fg.muted",
				_hover: {
					color: "fg.default",
					textDecoration: "underline",
				},
			},
		},
		size: {
			sm: { fontSize: "sm" },
			md: { fontSize: "md" },
		},
	},

	defaultVariants: {
		variant: "default",
		size: "md",
	},
})
