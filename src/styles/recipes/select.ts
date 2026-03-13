import { defineSlotRecipe } from "@pandacss/dev"

export const select = defineSlotRecipe({
	className: "select",
	slots: [
		// Field wrapper
		"root",
		"label",
		"description",
		"error",
		// Trigger
		"trigger",
		"startAdornment",
		"value",
		"chevron",
		// Dropdown
		"portal",
		"listbox",
		"option",
		"optionIcon",
		"optionLabel",
		"optionDescription",
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: "1",
		},
		label: {
			fontSize: "xs",
			fontWeight: "medium",
			color: "stone.600",
			letterSpacing: "snug",
		},
		description: {
			fontSize: "xs",
			color: "fg.subtle",
		},
		error: {
			fontSize: "xs",
			color: "danger.default",
		},
		trigger: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: "2",
			width: "full",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.default",
			borderRadius: "md",
			bg: "bg.subtle",
			color: "fg.default",
			cursor: "pointer",
			userSelect: "none",
			transition: "all 150ms ease",
			_hover: {
				bg: "bg.muted",
				borderColor: "border.strong",
			},
			"&[data-open]": {
				borderColor: "brand.default",
				boxShadow: "0 0 0 3px token(colors.teal.100)",
				bg: "white",
				outline: "none",
			},
			_disabled: {
				opacity: "50",
				cursor: "not-allowed",
				_hover: {
					bg: "bg.subtle",
					borderColor: "border.default",
				},
			},
			"&[data-invalid]": {
				borderColor: "danger.default",
				"&[data-open]": {
					borderColor: "danger.default",
					boxShadow: "0 0 0 3px token(colors.red.100)",
				},
			},
		},
		startAdornment: {
			display: "flex",
			alignItems: "center",
			flexShrink: "0",
			color: "fg.subtle",
		},
		value: {
			flex: "1",
			display: "flex",
			alignItems: "center",
			gap: "2",
			minWidth: "0",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			"&[data-placeholder]": {
				color: "fg.subtle",
			},
		},
		chevron: {
			flexShrink: "0",
			color: "fg.subtle",
			transition: "transform 150ms ease",
			"[data-open] &": {
				transform: "rotate(180deg)",
			},
		},
		portal: {
			position: "fixed",
			zIndex: "floating",
		},
		listbox: {
			minWidth: "var(--select-trigger-width)",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.default",
			borderRadius: "md",
			bg: "white",
			boxShadow: "md",
			py: "1",
			outline: "none",
			overflowY: "auto",
			maxHeight: "64",
		},
		option: {
			display: "flex",
			alignItems: "center",
			gap: "2",
			width: "full",
			cursor: "pointer",
			userSelect: "none",
			color: "fg.default",
			transition: "background 100ms ease",
			_hover: {
				bg: "bg.muted",
			},
			"&[data-highlighted]": {
				bg: "bg.muted",
				outline: "none",
			},
			"&[data-selected]": {
				color: "brand.emphasis",
				bg: "brand.subtle",
				_hover: {
					color: "brand.emphasis",
					bg: "brand.subtle",
				},
			},
			"&[data-disabled]": {
				opacity: "50",
				cursor: "not-allowed",
				_hover: { bg: "transparent" },
			},
		},
		optionIcon: {
			display: "flex",
			alignItems: "center",
			flexShrink: "0",
			color: "fg.subtle",
			"[data-selected] &": {
				color: "brand.default",
			},
		},
		optionLabel: {
			flex: "1",
			minWidth: "0",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		optionDescription: {
			color: "fg.subtle",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			"[data-selected] &": {
				color: "brand.default",
				opacity: "80",
			},
		},
	},
	variants: {
		size: {
			sm: {
				trigger: { px: "2.5", py: "1.5", minH: "8", fontSize: "xs" },
				option: { px: "2.5", py: "1.5", fontSize: "xs" },
				optionLabel: { fontSize: "xs" },
				optionDescription: { fontSize: "xxs" },
			},
			md: {
				trigger: { px: "3", py: "2", minH: "9", fontSize: "sm" },
				option: { px: "3", py: "2", fontSize: "sm" },
				optionLabel: { fontSize: "sm" },
				optionDescription: { fontSize: "xs" },
			},
			lg: {
				trigger: { px: "3", py: "2.5", minH: "10", fontSize: "md" },
				option: { px: "3", py: "2.5", fontSize: "md" },
				optionLabel: { fontSize: "md" },
				optionDescription: { fontSize: "sm" },
			},
		},
	},
	defaultVariants: {
		size: "md",
	},
})
