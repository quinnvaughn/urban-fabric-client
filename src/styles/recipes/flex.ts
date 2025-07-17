import { defineRecipe } from "@pandacss/dev"

export const flex = defineRecipe({
	className: "flex",
	base: {
		display: "flex",
	},
	variants: {
		direction: {
			row: { flexDirection: "row" },
			"row-reverse": { flexDirection: "row-reverse" },
			column: { flexDirection: "column" },
			"column-reverse": { flexDirection: "column-reverse" },
		},
		align: {
			stretch: { alignItems: "stretch" },
			center: { alignItems: "center" },
			start: { alignItems: "flex-start" },
			end: { alignItems: "flex-end" },
			baseline: { alignItems: "baseline" },
		},
		justify: {
			start: { justifyContent: "flex-start" },
			end: { justifyContent: "flex-end" },
			center: { justifyContent: "center" },
			between: { justifyContent: "space-between" },
			around: { justifyContent: "space-around" },
			evenly: { justifyContent: "space-evenly" },
		},
		gap: {
			xxs: { gap: "{spacing.xxs}" },
			xs: { gap: "{spacing.xs}" },
			sm: { gap: "{spacing.sm}" },
			md: { gap: "{spacing.md}" },
			lg: { gap: "{spacing.lg}" },
			xl: { gap: "{spacing.xl}" },
			"2xl": { gap: "{spacing.2xl}" },
			"3xl": { gap: "{spacing.3xl}" },
		},
		grow: {
			0: { flexGrow: 0 },
			1: { flexGrow: 1 },
			2: { flexGrow: 2 },
		},
		shrink: {
			0: { flexShrink: 0 },
			1: { flexShrink: 1 },
			2: { flexShrink: 2 },
		},
		basis: {
			auto: { flexBasis: "auto" },
			full: { flexBasis: "100%" },
			content: { flexBasis: "content" },
		},
		flex: {
			initial: { flex: "0 1 auto" },
			auto: { flex: "1 1 auto" },
			none: { flex: "none" },
			full: { flex: "1 1 100%" },
		},
		wrap: {
			noWrap: { flexWrap: "nowrap" },
			wrap: { flexWrap: "wrap" },
			"wrap-reverse": { flexWrap: "wrap-reverse" },
		},
	},
	defaultVariants: {
		direction: "row",
		align: "stretch",
		justify: "start",
	},
})
