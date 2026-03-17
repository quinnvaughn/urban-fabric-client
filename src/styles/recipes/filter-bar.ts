import { defineSlotRecipe } from "@pandacss/dev"

export const filterBar = defineSlotRecipe({
	className: "filter-bar",
	slots: ["root", "filtersRow", "separator"],

	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			bg: "white",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.subtle",
			borderRadius: "lg",
			boxShadow: "sm",
			overflow: "hidden",
		},
		filtersRow: {
			display: "flex",
			alignItems: "center",
			gap: "2.5",
			px: "4",
			py: "2.5",
			borderTopWidth: "1",
			borderTopStyle: "solid",
			borderTopColor: "border.subtle",
		},
		separator: {
			w: "px",
			h: "4.5",
			bg: "border.subtle",
			flexShrink: "0",
		},
	},
})
