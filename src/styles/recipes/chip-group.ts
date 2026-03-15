import { defineSlotRecipe } from "@pandacss/dev"

export const chipGroup = defineSlotRecipe({
	className: "chip-group",
	slots: [
		"root",
		"label",
		"labelText",
		"group",
		"chip",
		"chipDot",
		"description",
		"error",
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "1",
		},
		label: {
			display: "flex",
			alignItems: "center",
		},
		labelText: {
			flex: "1",
			fontSize: "xs",
			fontWeight: "semibold",
			color: "stone.700",
			letterSpacing: "normal",
		},
		group: {
			display: "flex",
			flexWrap: "wrap",
			gap: "1.5",
		},
		chip: {
			display: "inline-flex",
			alignItems: "center",
			gap: "1.5",
			px: "2.5",
			py: "1.5",
			borderRadius: "full",
			borderWidth: "1.5",
			borderStyle: "solid",
			borderColor: "border.default",
			bg: "rgba(253, 252, 250, 0.6)",
			fontSize: "xs",
			fontWeight: "medium",
			color: "fg.muted",
			cursor: "pointer",
			userSelect: "none",
			transition: "all 150ms {easings.inOut}",
			_hover: {
				borderColor: "border.strong",
				color: "fg.default",
				bg: "rgba(235, 230, 220, 0.5)",
			},
			_selected: {
				borderColor: "teal.300",
				bg: "teal.100",
				color: "teal.700",
				_hover: {
					borderColor: "teal.300",
					bg: "teal.100",
					color: "teal.700",
				},
			},
			_disabled: {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					borderColor: "border.default",
					bg: "rgba(253, 252, 250, 0.6)",
					color: "fg.muted",
				},
			},
		},
		chipDot: {
			width: "1.5",
			height: "1.5",
			borderRadius: "full",
			bg: "currentColor",
			opacity: "0.5",
			flexShrink: "0",
			_selected: {
				opacity: "1",
				bg: "teal.500",
			},
		},
		description: {
			fontSize: "xxs",
			color: "fg.subtle",
		},
		error: {
			fontSize: "xxs",
			color: "danger.default",
		},
	},
	variants: {
		invalid: {
			true: {
				chip: {
					_selected: {
						borderColor: "danger.muted",
						bg: "danger.subtle",
						color: "danger.default",
					},
				},
			},
		},
	},
})
