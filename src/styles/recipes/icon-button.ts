import { defineRecipe } from "@pandacss/dev"

export const iconButton = defineRecipe({
	className: "icon-button",
	description: "Styles for icon buttons",
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		p: "xs",
		backgroundColor: "transparent",
		transition: "background-color 0.2s ease, color 0.2s ease",
		_hover: {
			bg: "neutral.100",
		},
		_focusVisible: {
			outline: "2px solid",
			outlineColor: "primary",
		},
	},
	variants: {
		borderRadius: {
			sm: {
				borderRadius: "sm",
			},
			md: {
				borderRadius: "md",
			},
			full: {
				borderRadius: "full",
			},
		},
	},
	defaultVariants: {
		borderRadius: "full",
	},
})
