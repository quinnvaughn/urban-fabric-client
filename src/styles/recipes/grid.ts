import { defineRecipe } from "@pandacss/dev"

export const grid = defineRecipe({
	className: "grid",
	base: {
		display: "grid",
	},
	variants: {
		gap: {
			xxs: { gap: "{spacing.xxs}" },
			xs: { gap: "{spacing.xs}" },
			sm: { gap: "{spacing.sm}" },
			md: { gap: "{spacing.md}" },
			lg: { gap: "{spacing.lg}" },
			xl: { gap: "{spacing.xl}" },
			"2xl": { gap: "{spacing.2xl}" },
		},
		rowGap: {
			xs: { rowGap: "{spacing.xs}" },
			sm: { rowGap: "{spacing.sm}" },
			md: { rowGap: "{spacing.md}" },
		},
		columnGap: {
			xs: { columnGap: "{spacing.xs}" },
			sm: { columnGap: "{spacing.sm}" },
			md: { columnGap: "{spacing.md}" },
		},
		autoFlow: {
			row: { gridAutoFlow: "row" },
			column: { gridAutoFlow: "column" },
			dense: { gridAutoFlow: "dense" },
			"row-dense": { gridAutoFlow: "row dense" },
			"column-dense": { gridAutoFlow: "column dense" },
		},
		alignItems: {
			start: { alignItems: "start" },
			center: { alignItems: "center" },
			end: { alignItems: "end" },
			stretch: { alignItems: "stretch" },
		},
		justifyItems: {
			start: { justifyItems: "start" },
			center: { justifyItems: "center" },
			end: { justifyItems: "end" },
			stretch: { justifyItems: "stretch" },
		},
		placeItems: {
			center: { placeItems: "center" },
			start: { placeItems: "start" },
			end: { placeItems: "end" },
			stretch: { placeItems: "stretch" },
		},
	},
})
