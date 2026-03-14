import { defineSlotRecipe } from "@pandacss/dev"

export const tooltip = defineSlotRecipe({
	className: "tooltip",
	slots: ["content", "arrow"],

	base: {
		content: {
			position: "fixed",
			zIndex: "tooltip",
			px: "2",
			py: "1",
			borderRadius: "sm",
			bg: "stone.900",
			color: "white",
			fontSize: "xxs",
			fontWeight: "medium",
			lineHeight: "snug",
			whiteSpace: "nowrap",
			pointerEvents: "none",
			"&[data-state=open]": {
				animation: "tooltipFadeIn 0.12s {easings.out} both",
			},
		},
		arrow: {
			position: "fixed",
			width: "0",
			height: "0",
			pointerEvents: "none",
			// border values set via inline style in the component
		},
	},
})
