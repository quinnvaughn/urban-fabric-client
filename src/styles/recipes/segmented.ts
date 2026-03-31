import { defineSlotRecipe } from "@pandacss/dev"

export const segmented = defineSlotRecipe({
	className: "segmented",
	slots: ["root", "group", "option", "optionIcon", "optionLabel"],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "1",
		},
		group: {
			display: "flex",
			gap: "1",
		},
		option: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: "0.5",
			flex: "1",
			borderRadius: "md",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.default",
			bg: "bg.subtle",
			fontFamily: "sans",
			fontWeight: "medium",
			color: "fg.muted",
			cursor: "pointer",
			userSelect: "none",
			transition: "all 150ms ease",
			_hover: {
				bg: "bg.muted",
				borderColor: "border.strong",
				color: "fg.default",
			},
			"&[data-selected]": {
				bg: "brand.subtle",
				borderColor: "brand.muted",
				color: "brand.emphasis",
			},
			_disabled: {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					bg: "bg.subtle",
					borderColor: "border.default",
					color: "fg.muted",
				},
			},
			"&[data-disabled]": {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					bg: "bg.subtle",
					borderColor: "border.default",
					color: "fg.muted",
				},
			},
			"&[data-selected][disabled], &[data-selected][data-disabled]": {
				bg: "brand.subtle",
				borderColor: "brand.muted",
				color: "brand.emphasis",
			},
			"&[data-selected]:hover": {
				bg: "brand.subtle",
				borderColor: "brand.muted",
				color: "brand.emphasis",
			},
		},
		optionIcon: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			lineHeight: "none",
		},
		optionLabel: {
			lineHeight: "none",
		},
	},
	variants: {
		size: {
			sm: {
				option: {
					py: "1.5",
					px: "2",
					fontSize: "xs",
					minH: "8",
				},
				optionIcon: { fontSize: "sm" },
				optionLabel: { fontSize: "xs" },
			},
			md: {
				option: {
					py: "1.5",
					px: "3",
					fontSize: "sm",
					minH: "9",
				},
				optionIcon: { fontSize: "md" },
				optionLabel: { fontSize: "xs" },
			},
			lg: {
				option: {
					py: "2",
					px: "4",
					fontSize: "sm",
					minH: "10",
				},
				optionIcon: { fontSize: "lg" },
				optionLabel: { fontSize: "sm" },
			},
		},
		fullWidth: {
			true: {
				root: { width: "full" },
				group: { width: "full" },
			},
		},
		variant: {
			default: {},
			pill: {
				root: {
					flexDirection: "row",
				},
				group: {
					gap: "1",
				},
				option: {
					flex: "none",
					flexDirection: "row",
					borderRadius: "full",
					borderWidth: "1px",
					borderColor: "transparent",
					bg: "transparent",
					color: "fg.muted",
					minH: "auto",
					_hover: {
						bg: "stone.100",
						borderColor: "transparent",
						color: "fg.default",
					},
					"&[data-selected]": {
						bg: "brand.subtle",
						borderColor: "brand.muted",
						borderWidth: "1px",
						borderStyle: "solid",
						color: "brand.emphasis",
					},
					"&[data-selected]:hover": {
						bg: "brand.subtle",
						borderColor: "brand.muted",
						color: "brand.emphasis",
					},
					_disabled: {
						opacity: "50",
						cursor: "not-allowed",
						_hover: {
							bg: "transparent",
							borderColor: "transparent",
							color: "fg.muted",
						},
					},
					"&[data-disabled]": {
						opacity: "50",
						cursor: "not-allowed",
						_hover: {
							bg: "transparent",
							borderColor: "transparent",
							color: "fg.muted",
						},
					},
				},
			},
		},
	},
	defaultVariants: {
		size: "md",
		variant: "default",
	},
})
