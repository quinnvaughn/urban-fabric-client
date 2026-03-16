import { defineSlotRecipe } from "@pandacss/dev"

export const tabs = defineSlotRecipe({
	className: "tabs",
	slots: ["root", "list", "trigger", "link"],

	base: {
		root: {
			display: "flex",
			flexDirection: "column",
		},
		list: {
			display: "flex",
			borderBottomWidth: "1",
			borderBottomStyle: "solid",
			borderBottomColor: "border.default",
		},
		trigger: {
			display: "inline-flex",
			alignItems: "center",
			fontFamily: "sans",
			fontWeight: "medium",
			color: "fg.muted",
			background: "none",
			border: "none",
			borderBottomWidth: "2px",
			borderBottomStyle: "solid",
			borderBottomColor: "transparent",
			cursor: "pointer",
			position: "relative",
			marginBottom: "-1px",
			transition: "colors 0.12s ease",

			_hover: {
				color: "fg.default",
			},
			"&[data-state=active]": {
				color: "fg.default",
				borderBottomColor: "brand.default",
			},
		},
		link: {
			display: "inline-flex",
			alignItems: "center",
			fontFamily: "sans",
			fontWeight: "medium",
			color: "fg.muted",
			textDecoration: "none",
			borderBottomWidth: "2px",
			borderBottomStyle: "solid",
			borderBottomColor: "transparent",
			position: "relative",
			marginBottom: "-1px",
			transition: "colors 0.12s ease",

			_hover: {
				color: "fg.default",
			},
			'&[data-status="active"]': {
				color: "fg.default",
				borderBottomColor: "brand.default",
			},
		},
	},

	variants: {
		size: {
			sm: {
				trigger: {
					fontSize: "xs",
					paddingBottom: "2",
					marginRight: "4",
				},
				link: {
					fontSize: "xs",
					paddingBottom: "2",
					marginRight: "4",
				},
			},
			md: {
				trigger: {
					fontSize: "sm",
					paddingBottom: "2.5",
					marginRight: "5",
				},
				link: {
					fontSize: "sm",
					paddingBottom: "2.5",
					marginRight: "5",
				},
			},
		},
	},

	defaultVariants: {
		size: "md",
	},
})
