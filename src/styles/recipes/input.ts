import { defineRecipe } from "@pandacss/dev"

export const input = defineRecipe({
	className: "input",
	base: {
		width: "100%",
		px: "md",
		py: "sm",
		fontSize: "md",
		border: "1px solid",
		borderRadius: "lg",
		bg: "{colors.surface}",
		color: "{colors.neutral.900}",
		borderColor: "{colors.neutral.200}",
		outline: "none",
		_focus: { borderColor: "{colors.primary}" },
		_focusWithin: { borderColor: "{colors.primary}" },
		_disabled: {
			bg: "{colors.neutral.100}",
			color: "{colors.neutral.500}",
			cursor: "not-allowed",
		},
		transition: "border-color 0.2s ease",
	},
	variants: {
		error: {
			true: { borderColor: "{colors.danger}" },
			false: {},
		},
	},
})
