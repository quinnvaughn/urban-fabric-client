import { defineSlotRecipe } from "@pandacss/dev"

export const menu = defineSlotRecipe({
	className: "menu",
	slots: ["content", "item", "separator"],

	base: {
		content: {
			display: "flex",
			flexDirection: "column",
			p: "1",
			borderRadius: "lg",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.subtle",
			bg: "white",
			boxShadow: "lg",
			backdropFilter: "blur(16px)",
			// entry animation — driven by data-state
			"&[data-state=open]": {
				animation: "menuFadeUp 0.18s {easings.spring} both",
			},
		},
		item: {
			display: "flex",
			alignItems: "center",
			gap: "2",
			w: "full",
			px: "2.5",
			py: "1.5",
			borderRadius: "md",
			border: "none",
			background: "transparent",
			fontSize: "sm",
			fontWeight: "medium",
			color: "fg.default",
			cursor: "pointer",
			textAlign: "left",
			whiteSpace: "nowrap",
			transition: "colors 0.12s ease",
			userSelect: "none",

			_hover: {
				bg: "bg.muted",
				color: "fg.default",
			},
			_disabled: {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					bg: "transparent",
				},
			},
			// icon slot inside the item
			"& [data-slot=icon]": {
				color: "fg.subtle",
				flexShrink: "0",
			},
			"&:hover [data-slot=icon]": {
				color: "fg.muted",
			},
			// kbd badge slot inside the item
			"& [data-slot=kbd]": {
				marginLeft: "auto",
				fontSize: "xxs",
				fontWeight: "semibold",
				color: "fg.subtle",
				bg: "bg.muted",
				borderRadius: "sm",
				px: "1",
				py: "0.5",
				flexShrink: "0",
			},
		},
		separator: {
			height: "px",
			bg: "border.subtle",
			my: "1",
		},
	},
})
