import { defineConfig } from "@pandacss/dev"
import { avatar } from "./recipes/avatar"
import { badge } from "./recipes/badge"
import { button } from "./recipes/button"
import { card } from "./recipes/card"
import { chipGroup } from "./recipes/chip-group"
import { commandPalette } from "./recipes/command-pallete"
import { filterBar } from "./recipes/filter-bar"
import { input } from "./recipes/input"
import { link } from "./recipes/link"
import { menu } from "./recipes/menu"
import { modal } from "./recipes/modal"
import { segmented } from "./recipes/segmented"
import { select } from "./recipes/select"
import { stepper } from "./recipes/stepper"
import { tabs } from "./recipes/tabs"
import { toast } from "./recipes/toast"
import { tooltip } from "./recipes/tooltip"
import { typography } from "./recipes/typography"

export default defineConfig({
	preflight: true,
	include: ["./src/**/*.{js,jsx,ts,tsx}"],
	presets: [],
	exclude: [],
	globalCss: {
		html: {
			"--uf-header-height": "56px",
			"--uf-sidebar-width": "220px",
			"--uf-topbar-height": "56px",
		},
		"*::-webkit-scrollbar": { width: "6px", height: "6px" },
		"*::-webkit-scrollbar-track": { background: "transparent" },
		"*::-webkit-scrollbar-thumb": {
			background: "stone.300",
			borderRadius: "9999px",
		},
		"*::-webkit-scrollbar-thumb:hover": { background: "stone.400" },
	},
	staticCss: {
		recipes: {
			input: ["*"],
			tabs: ["*"],
			card: ["*"],
			link: ["*"],
			button: ["*"],
			typography: ["*"],
			toast: ["*"],
			badge: ["*"],
			avatar: ["*"],
			segmented: ["*"],
			stepper: ["*"],
			select: ["*"],
			menu: ["*"],
			modal: ["*"],
			tooltip: ["*"],
			commandPalette: ["*"],
			chipGroup: ["*"],
			grid: ["*"],
			filterBar: ["*"],
		},
		css: [
			{
				responsive: true,
				properties: {
					gap: ["*"],
					columnGap: ["*"],
					rowGap: ["*"],
					alignItems: ["*"],
					justifyContent: ["*"],
					justifyItems: ["*"],
					gridTemplateColumns: ["*"],
					textAlign: ["*"],
					display: ["*"],
					flexDirection: ["*"],
					flexWrap: ["*"],
					width: ["*"],
					minWidth: ["*"],
					maxWidth: ["*"],
					lineHeight: ["*"],
					padding: ["*"],
					paddingBlock: ["*"],
					paddingInline: ["*"],
					paddingTop: ["*"],
					paddingBottom: ["*"],
					paddingLeft: ["*"],
					paddingRight: ["*"],
					margin: ["*"],
					marginBlock: ["*"],
					marginInline: ["*"],
					borderRadius: ["*"],
					backgroundColor: ["*"],
					transition: ["*"],
					border: ["*"],
					borderBottom: ["*"],
					borderBottomWidth: ["*"],
					borderBottomStyle: ["*"],
					borderBottomColor: ["*"],
					color: ["*"],
				},
			},
		],
	},

	// ─── Conditions ─────────────────────────────────────────────────────────────
	// Pseudo-classes, pseudo-elements, media queries, and data-attribute selectors.
	// Responsive breakpoint conditions (_sm, _md, etc.) are auto-generated from
	// theme.breakpoints — you don't need to define those here.
	conditions: {
		// ── Interactive states ────────────────────────────────────────────────────
		_hover: "&:hover",
		_focus: "&:focus",
		_focusWithin: "&:focus-within",
		_focusVisible: "&:focus-visible",
		_active: "&:active",
		_visited: "&:visited",
		_target: "&:target",
		_disabled: "&:disabled, &[disabled], &[data-disabled]",
		_enabled: "&:enabled",
		_readOnly: "&:read-only, &[data-read-only]",
		_readWrite: "&:read-write",
		_placeholderShown: "&:placeholder-shown",
		_optional: "&:optional",
		_required: "&:required, &[data-required]",
		_valid: "&:valid, &[data-valid]",
		_invalid: "&:invalid, &[data-invalid]",
		_userValid: "&:user-valid",
		_userInvalid: "&:user-invalid",

		// ── Toggle / selection states ─────────────────────────────────────────────
		_checked: "&:checked, &[data-checked]",
		_unchecked: "&:not(:checked), &[data-unchecked]",
		_indeterminate: "&:indeterminate, &[data-indeterminate]",
		_selected: "&[aria-selected=true], &[data-selected]",
		_expanded: "&[aria-expanded=true], &[data-expanded]",
		_pressed: "&[aria-pressed=true], &[data-pressed]",
		_highlighted: "&[data-highlighted]",
		_current: "&[aria-current=page], &[data-current]",
		_loading: "&[data-loading]",
		_open: "&[open], &[data-open], &[data-state=open]",
		_closed: "&[data-closed], &[data-state=closed]",

		// ── Pseudo-elements ───────────────────────────────────────────────────────
		_before: "&::before",
		_after: "&::after",
		_placeholder: "&::placeholder",
		_selection: "&::selection",
		_firstLetter: "&::first-letter",
		_firstLine: "&::first-line",
		_marker: "&::marker",
		_backdrop: "&::backdrop",

		// ── Structural ───────────────────────────────────────────────────────────
		_first: "&:first-child",
		_last: "&:last-child",
		_only: "&:only-child",
		_even: "&:nth-child(even)",
		_odd: "&:nth-child(odd)",
		_firstOfType: "&:first-of-type",
		_lastOfType: "&:last-of-type",
		_notFirst: "&:not(:first-child)",
		_notLast: "&:not(:last-child)",
		_empty: "&:empty",
		_hasChildren: "&:not(:empty)",

		// ── Group / peer (add className="group" or "peer" to the parent) ──────────
		_groupHover: ".group:hover &, [role=group]:hover &, [data-group]:hover &",
		_groupFocus: ".group:focus &, [role=group]:focus &",
		_groupActive: ".group:active &, [role=group]:active &",
		_groupDisabled: ".group:disabled &, [role=group]:disabled &",
		_groupChecked: ".group:checked &, [role=group]:checked &",
		_groupExpanded: ".group[aria-expanded=true] &, .group[data-expanded] &",
		_peerHover: ".peer:hover ~ &, [data-peer]:hover ~ &",
		_peerFocus: ".peer:focus ~ &, [data-peer]:focus ~ &",
		_peerChecked: ".peer:checked ~ &, [data-peer]:checked ~ &",
		_peerDisabled: ".peer:disabled ~ &, [data-peer]:disabled ~ &",

		// ── Theme / color scheme ──────────────────────────────────────────────────
		_dark: "[data-theme=dark] &, .dark &",
		_light: "[data-theme=light] &, .light &",

		// ── Media queries ─────────────────────────────────────────────────────────
		_motionReduce: "@media (prefers-reduced-motion: reduce)",
		_motionSafe: "@media (prefers-reduced-motion: no-preference)",
		_print: "@media print",
		_landscape: "@media (orientation: landscape)",
		_portrait: "@media (orientation: portrait)",
		_hoverDevice: "@media (hover: hover) and (pointer: fine)",
		_touchDevice: "@media (hover: none) and (pointer: coarse)",

		// ── Directionality ───────────────────────────────────────────────────────
		_ltr: "[dir=ltr] &",
		_rtl: "[dir=rtl] &",
	},

	// ─── Utilities ──────────────────────────────────────────────────────────────
	// Each key becomes a property name in css(). The `shorthand` alias lets you
	// use a shorter name (e.g. css({ p: '4' }) instead of css({ padding: '4' })).
	// `values` references a token category defined in theme.tokens.
	utilities: {
		// ── Color & fill ─────────────────────────────────────────────────────────
		color: {
			className: "text",
			values: "colors",
		},
		fill: {
			className: "fill",
			values: "colors",
		},
		stroke: {
			className: "stroke",
			values: "colors",
		},
		caretColor: {
			className: "caret",
			values: "colors",
		},
		accentColor: {
			className: "accent",
			values: "colors",
		},

		// ── Background ───────────────────────────────────────────────────────────
		background: {
			shorthand: "bg",
			className: "bg",
			values: "colors",
		},
		backgroundColor: {
			shorthand: "bgColor",
			className: "bg-color",
			values: "colors",
		},

		// ── Typography ───────────────────────────────────────────────────────────
		fontFamily: {
			shorthand: "fontFamily",
			className: "font-family",
			values: "fonts",
		},
		fontSize: {
			shorthand: "text",
			className: "text",
			values: "fontSizes",
		},
		fontWeight: {
			shorthand: "fontWeight",
			className: "font",
			values: "fontWeights",
		},
		fontStyle: {
			className: "font-style",
			values: { italic: "italic", normal: "normal" },
		},
		lineHeight: {
			shorthand: "leading",
			className: "leading",
			values: "lineHeights",
		},
		letterSpacing: {
			shorthand: "tracking",
			className: "tracking",
			values: "letterSpacings",
		},
		textAlign: {
			shorthand: "textAlign",
			className: "text",
			values: {
				left: "left",
				right: "right",
				center: "center",
				justify: "justify",
				start: "start",
				end: "end",
			},
		},
		textDecoration: {
			className: "decoration",
			values: {
				none: "none",
				underline: "underline",
				overline: "overline",
				"line-through": "line-through",
			},
		},
		textDecorationColor: {
			className: "decoration",
			values: "colors",
		},
		textUnderlineOffset: {
			className: "underline-offset",
			values: { auto: "auto", 1: "1px", 2: "2px", 4: "4px", 8: "8px" },
		},
		textTransform: {
			className: "text",
			values: {
				uppercase: "uppercase",
				lowercase: "lowercase",
				capitalize: "capitalize",
				none: "none",
			},
		},
		textOverflow: {
			className: "text",
			values: { ellipsis: "ellipsis", clip: "clip" },
		},
		whiteSpace: {
			shorthand: "whitespace",
			className: "whitespace",
			values: {
				normal: "normal",
				nowrap: "nowrap",
				pre: "pre",
				"pre-wrap": "pre-wrap",
				"pre-line": "pre-line",
				"break-spaces": "break-spaces",
			},
		},
		wordBreak: {
			className: "break",
			values: {
				normal: "normal",
				"break-all": "break-all",
				"keep-all": "keep-all",
			},
		},
		overflowWrap: {
			shorthand: "wrap",
			className: "wrap",
			values: {
				normal: "normal",
				anywhere: "anywhere",
				"break-word": "break-word",
			},
		},
		WebkitFontSmoothing: {
			className: "smoothing",
			values: { antialiased: "antialiased", auto: "auto" },
		},
		MozOsxFontSmoothing: {
			className: "smoothing-moz",
			values: { grayscale: "grayscale", auto: "auto" },
		},
		fontVariantNumeric: {
			className: "numeric",
			values: {
				normal: "normal",
				ordinal: "ordinal",
				"slashed-zero": "slashed-zero",
				"tabular-nums": "tabular-nums",
			},
		},

		// ── Layout ───────────────────────────────────────────────────────────────
		display: {
			shorthand: "d",
			className: "d",
			values: {
				block: "block",
				inline: "inline",
				"inline-block": "inline-block",
				flex: "flex",
				"inline-flex": "inline-flex",
				grid: "grid",
				"inline-grid": "inline-grid",
				table: "table",
				"table-cell": "table-cell",
				"table-row": "table-row",
				none: "none",
				contents: "contents",
				"list-item": "list-item",
				"flow-root": "flow-root",
			},
		},
		visibility: {
			className: "visibility",
			values: { visible: "visible", hidden: "hidden", collapse: "collapse" },
		},
		overflow: {
			className: "overflow",
			values: {
				auto: "auto",
				hidden: "hidden",
				visible: "visible",
				scroll: "scroll",
				clip: "clip",
			},
		},
		overflowX: {
			className: "overflow-x",
			values: {
				auto: "auto",
				hidden: "hidden",
				visible: "visible",
				scroll: "scroll",
			},
		},
		overflowY: {
			className: "overflow-y",
			values: {
				auto: "auto",
				hidden: "hidden",
				visible: "visible",
				scroll: "scroll",
			},
		},
		overscrollBehavior: {
			className: "overscroll",
			values: { auto: "auto", contain: "contain", none: "none" },
		},
		position: {
			shorthand: "pos",
			className: "pos",
			values: {
				static: "static",
				relative: "relative",
				absolute: "absolute",
				fixed: "fixed",
				sticky: "sticky",
			},
		},
		top: { shorthand: "top", className: "top", values: "spacing" },
		right: { shorthand: "right", className: "right", values: "spacing" },
		bottom: { shorthand: "bottom", className: "bottom", values: "spacing" },
		left: { shorthand: "left", className: "left", values: "spacing" },
		inset: {
			shorthand: "inset",
			className: "inset",
			values: "spacing",
		},
		insetInline: {
			shorthand: "insetX",
			className: "inset-x",
			values: "spacing",
		},
		insetBlock: {
			shorthand: "insetY",
			className: "inset-y",
			values: "spacing",
		},
		zIndex: {
			shorthand: "z",
			className: "z",
			values: "zIndex",
		},
		isolation: {
			className: "isolation",
			values: { isolate: "isolate", auto: "auto" },
		},
		float: {
			className: "float",
			values: {
				left: "left",
				right: "right",
				none: "none",
				start: "inline-start",
				end: "inline-end",
			},
		},
		clear: {
			className: "clear",
			values: { left: "left", right: "right", both: "both", none: "none" },
		},
		boxSizing: {
			className: "box",
			values: { border: "border-box", content: "content-box" },
		},

		// ── Flexbox ──────────────────────────────────────────────────────────────
		flex: {
			className: "flex",
			values: {
				1: "1 1 0%",
				auto: "1 1 auto",
				initial: "0 1 auto",
				none: "none",
			},
		},
		flexDirection: {
			shorthand: "flexDir",
			className: "flex",
			values: {
				row: "row",
				"row-reverse": "row-reverse",
				column: "column",
				"column-reverse": "column-reverse",
			},
		},
		flexWrap: {
			className: "flex",
			values: {
				wrap: "wrap",
				nowrap: "nowrap",
				"wrap-reverse": "wrap-reverse",
			},
		},
		flexGrow: {
			shorthand: "grow",
			className: "grow",
			values: { 0: "0", 1: "1" },
		},
		flexShrink: {
			shorthand: "shrink",
			className: "shrink",
			values: { 0: "0", 1: "1" },
		},
		flexBasis: {
			className: "basis",
			values: {
				auto: "auto",
				full: "100%",
				...Object.fromEntries(
					[
						"0",
						"px",
						"0.5",
						"1",
						"1.5",
						"2",
						"2.5",
						"3",
						"3.5",
						"4",
						"5",
						"6",
						"7",
						"8",
						"9",
						"10",
						"11",
						"12",
						"14",
						"16",
						"20",
						"24",
						"28",
						"32",
						"36",
						"40",
						"48",
						"56",
						"64",
					].map((k) => [k, `{spacing.${k}}`]),
				),
			},
		},
		order: {
			className: "order",
			values: {
				first: "-9999",
				last: "9999",
				none: "0",
				1: "1",
				2: "2",
				3: "3",
				4: "4",
				5: "5",
			},
		},
		alignItems: {
			shorthand: "items",
			className: "items",
			values: {
				start: "flex-start",
				end: "flex-end",
				center: "center",
				baseline: "baseline",
				stretch: "stretch",
			},
		},
		alignContent: {
			shorthand: "content",
			className: "content",
			values: {
				start: "flex-start",
				end: "flex-end",
				center: "center",
				stretch: "stretch",
				between: "space-between",
				around: "space-around",
				evenly: "space-evenly",
				baseline: "baseline",
			},
		},
		alignSelf: {
			shorthand: "self",
			className: "self",
			values: {
				auto: "auto",
				start: "flex-start",
				end: "flex-end",
				center: "center",
				stretch: "stretch",
				baseline: "baseline",
			},
		},
		justifyContent: {
			shorthand: "justify",
			className: "justify",
			values: {
				start: "flex-start",
				end: "flex-end",
				center: "center",
				between: "space-between",
				around: "space-around",
				evenly: "space-evenly",
			},
		},
		justifyItems: {
			className: "justify-items",
			values: {
				start: "start",
				end: "end",
				center: "center",
				stretch: "stretch",
			},
		},
		justifySelf: {
			className: "justify-self",
			values: {
				auto: "auto",
				start: "start",
				end: "end",
				center: "center",
				stretch: "stretch",
			},
		},
		placeItems: {
			className: "place-items",
			values: {
				start: "start",
				end: "end",
				center: "center",
				stretch: "stretch",
				baseline: "baseline",
			},
		},
		placeContent: {
			className: "place-content",
			values: {
				start: "start",
				end: "end",
				center: "center",
				stretch: "stretch",
				between: "space-between",
				around: "space-around",
				evenly: "space-evenly",
			},
		},
		placeSelf: {
			className: "place-self",
			values: {
				auto: "auto",
				start: "start",
				end: "end",
				center: "center",
				stretch: "stretch",
			},
		},

		// ── Grid ─────────────────────────────────────────────────────────────────
		gridTemplateColumns: {
			shorthand: "gridCols",
			className: "grid-cols",
			values: {
				1: "repeat(1, minmax(0, 1fr))",
				2: "repeat(2, minmax(0, 1fr))",
				3: "repeat(3, minmax(0, 1fr))",
				4: "repeat(4, minmax(0, 1fr))",
				5: "repeat(5, minmax(0, 1fr))",
				6: "repeat(6, minmax(0, 1fr))",
				7: "repeat(7, minmax(0, 1fr))",
				8: "repeat(8, minmax(0, 1fr))",
				10: "repeat(10, minmax(0, 1fr))",
				12: "repeat(12, minmax(0, 1fr))",
				none: "none",
				subgrid: "subgrid",
			},
		},
		gridTemplateRows: {
			shorthand: "gridRows",
			className: "grid-rows",
			values: {
				1: "repeat(1, minmax(0, 1fr))",
				2: "repeat(2, minmax(0, 1fr))",
				3: "repeat(3, minmax(0, 1fr))",
				4: "repeat(4, minmax(0, 1fr))",
				5: "repeat(5, minmax(0, 1fr))",
				6: "repeat(6, minmax(0, 1fr))",
				none: "none",
				subgrid: "subgrid",
			},
		},
		gridColumn: {
			shorthand: "colSpan",
			className: "col",
			values: {
				auto: "auto",
				"span-1": "span 1 / span 1",
				"span-2": "span 2 / span 2",
				"span-3": "span 3 / span 3",
				"span-4": "span 4 / span 4",
				"span-5": "span 5 / span 5",
				"span-6": "span 6 / span 6",
				"span-8": "span 8 / span 8",
				"span-12": "span 12 / span 12",
				"span-full": "1 / -1",
			},
		},
		gridRow: {
			shorthand: "rowSpan",
			className: "row",
			values: {
				auto: "auto",
				"span-1": "span 1 / span 1",
				"span-2": "span 2 / span 2",
				"span-3": "span 3 / span 3",
				"span-4": "span 4 / span 4",
				"span-full": "1 / -1",
			},
		},
		gridAutoColumns: {
			className: "auto-cols",
			values: {
				auto: "auto",
				min: "min-content",
				max: "max-content",
				fr: "minmax(0, 1fr)",
			},
		},
		gridAutoRows: {
			className: "auto-rows",
			values: {
				auto: "auto",
				min: "min-content",
				max: "max-content",
				fr: "minmax(0, 1fr)",
			},
		},
		gridAutoFlow: {
			className: "grid-flow",
			values: {
				row: "row",
				column: "column",
				dense: "dense",
				"row-dense": "row dense",
				"col-dense": "column dense",
			},
		},
		gap: {
			shorthand: "gap",
			className: "gap",
			values: "spacing",
		},
		columnGap: {
			shorthand: "gapX",
			className: "gap-x",
			values: "spacing",
		},
		rowGap: {
			shorthand: "gapY",
			className: "gap-y",
			values: "spacing",
		},

		// ── Spacing ──────────────────────────────────────────────────────────────
		padding: { shorthand: "p", className: "p", values: "spacing" },
		paddingTop: { shorthand: "pt", className: "pt", values: "spacing" },
		paddingRight: { shorthand: "pr", className: "pr", values: "spacing" },
		paddingBottom: { shorthand: "pb", className: "pb", values: "spacing" },
		paddingLeft: { shorthand: "pl", className: "pl", values: "spacing" },
		paddingInline: { shorthand: "px", className: "px", values: "spacing" },
		paddingBlock: { shorthand: "py", className: "py", values: "spacing" },
		margin: { shorthand: "m", className: "m", values: "spacing" },
		marginTop: { shorthand: "mt", className: "mt", values: "spacing" },
		marginRight: { shorthand: "mr", className: "mr", values: "spacing" },
		marginBottom: { shorthand: "mb", className: "mb", values: "spacing" },
		marginLeft: { shorthand: "ml", className: "ml", values: "spacing" },
		marginInline: { shorthand: "mx", className: "mx", values: "spacing" },
		marginBlock: { shorthand: "my", className: "my", values: "spacing" },

		// ── Sizing ───────────────────────────────────────────────────────────────
		width: {
			shorthand: "w",
			className: "w",
			values: {
				0: "0px",
				px: "1px",
				0.5: "2px",
				1: "4px",
				1.5: "6px",
				2: "8px",
				2.5: "10px",
				3: "12px",
				3.5: "14px",
				4: "16px",
				4.5: "18px",
				5: "20px",
				6: "24px",
				7: "28px",
				8: "32px",
				9: "36px",
				10: "40px",
				11: "44px",
				12: "48px",
				14: "56px",
				16: "64px",
				20: "80px",
				24: "96px",
				25: "100px",
				28: "112px",
				32: "128px",
				36: "144px",
				40: "160px",
				48: "192px",
				56: "224px",
				64: "256px",
				auto: "auto",
				full: "100%",
				screen: "100vw",
				svw: "100svw",
				dvw: "100dvw",
				min: "min-content",
				max: "max-content",
				fit: "fit-content",
				"1/2": "50%",
				"1/3": "33.333%",
				"2/3": "66.667%",
				"1/4": "25%",
				"3/4": "75%",
			},
		},
		minWidth: {
			shorthand: "minW",
			className: "min-w",
			values: {
				0: "0px",
				px: "1px",
				0.5: "2px",
				1: "4px",
				1.5: "6px",
				2: "8px",
				2.5: "10px",
				3: "12px",
				3.5: "14px",
				4: "16px",
				4.5: "18px",
				5: "20px",
				6: "24px",
				7: "28px",
				8: "32px",
				9: "36px",
				10: "40px",
				11: "44px",
				12: "48px",
				14: "56px",
				16: "64px",
				20: "80px",
				24: "96px",
				25: "100px",
				28: "112px",
				32: "128px",
				36: "144px",
				40: "160px",
				48: "192px",
				56: "224px",
				64: "256px",
				full: "100%",
				min: "min-content",
				max: "max-content",
				fit: "fit-content",
			},
		},
		maxWidth: {
			shorthand: "maxW",
			className: "max-w",
			values: {
				0: "0px",
				px: "1px",
				0.5: "2px",
				1: "4px",
				1.5: "6px",
				2: "8px",
				2.5: "10px",
				3: "12px",
				3.5: "14px",
				4: "16px",
				4.5: "18px",
				5: "20px",
				6: "24px",
				7: "28px",
				8: "32px",
				9: "36px",
				10: "40px",
				11: "44px",
				12: "48px",
				14: "56px",
				16: "64px",
				20: "80px",
				24: "96px",
				25: "100px",
				28: "112px",
				32: "128px",
				36: "144px",
				40: "160px",
				48: "192px",
				56: "224px",
				64: "256px",
				none: "none",
				full: "100%",
				screen: "100vw",
				min: "min-content",
				max: "max-content",
				fit: "fit-content",
				xs: "20rem",
				sm: "24rem",
				md: "28rem",
				lg: "32rem",
				xl: "36rem",
				"2xl": "42rem",
				"3xl": "48rem",
				"4xl": "56rem",
				"5xl": "64rem",
				"6xl": "72rem",
				"7xl": "80rem",
				prose: "65ch",
			},
		},
		height: {
			shorthand: "h",
			className: "h",
			values: {
				0: "0px",
				px: "1px",
				0.5: "2px",
				1: "4px",
				1.5: "6px",
				2: "8px",
				2.5: "10px",
				3: "12px",
				3.5: "14px",
				4: "16px",
				4.5: "18px",
				5: "20px",
				6: "24px",
				7: "28px",
				8: "32px",
				9: "36px",
				10: "40px",
				11: "44px",
				12: "48px",
				14: "56px",
				16: "64px",
				20: "80px",
				24: "96px",
				25: "100px",
				28: "112px",
				32: "128px",
				36: "144px",
				40: "160px",
				48: "192px",
				56: "224px",
				64: "256px",
				auto: "auto",
				full: "100%",
				screen: "100vh",
				svh: "100svh",
				dvh: "100dvh",
				min: "min-content",
				max: "max-content",
				fit: "fit-content",
			},
		},
		minHeight: {
			shorthand: "minH",
			className: "min-h",
			values: {
				0: "0px",
				px: "1px",
				0.5: "2px",
				1: "4px",
				1.5: "6px",
				2: "8px",
				2.5: "10px",
				3: "12px",
				3.5: "14px",
				4: "16px",
				4.5: "18px",
				5: "20px",
				6: "24px",
				7: "28px",
				8: "32px",
				9: "36px",
				10: "40px",
				11: "44px",
				12: "48px",
				14: "56px",
				16: "64px",
				20: "80px",
				24: "96px",
				25: "100px",
				28: "112px",
				32: "128px",
				36: "144px",
				40: "160px",
				48: "192px",
				56: "224px",
				64: "256px",
				full: "100%",
				screen: "100vh",
				svh: "100svh",
				dvh: "100dvh",
				min: "min-content",
				max: "max-content",
				fit: "fit-content",
			},
		},
		maxHeight: {
			shorthand: "maxH",
			className: "max-h",
			values: {
				0: "0px",
				px: "1px",
				0.5: "2px",
				1: "4px",
				1.5: "6px",
				2: "8px",
				2.5: "10px",
				3: "12px",
				3.5: "14px",
				4: "16px",
				4.5: "18px",
				5: "20px",
				6: "24px",
				7: "28px",
				8: "32px",
				9: "36px",
				10: "40px",
				11: "44px",
				12: "48px",
				14: "56px",
				16: "64px",
				20: "80px",
				24: "96px",
				25: "100px",
				28: "112px",
				32: "128px",
				36: "144px",
				40: "160px",
				48: "192px",
				56: "224px",
				64: "256px",
				none: "none",
				full: "100%",
				screen: "100vh",
				svh: "100svh",
				dvh: "100dvh",
				min: "min-content",
				max: "max-content",
				fit: "fit-content",
			},
		},
		aspectRatio: {
			shorthand: "aspect",
			className: "aspect",
			values: {
				auto: "auto",
				square: "1 / 1",
				video: "16 / 9",
				portrait: "9 / 16",
			},
		},

		// ── Border ───────────────────────────────────────────────────────────────
		border: {
			className: "border",
			values: "borders",
		},
		borderWidth: {
			shorthand: "borderW",
			className: "border",
			values: {
				0: "0px",
				1: "1px",
				1.5: "1.5px",
				2: "2px",
				4: "4px",
				8: "8px",
			},
		},
		borderTopWidth: {
			className: "border-t",
			values: { 0: "0px", 1: "1px", 1.5: "1.5px", 2: "2px", 4: "4px" },
		},
		borderRightWidth: {
			className: "border-r",
			values: { 0: "0px", 1: "1px", 1.5: "1.5px", 2: "2px", 4: "4px" },
		},
		borderBottomWidth: {
			className: "border-b",
			values: { 0: "0px", 1: "1px", 1.5: "1.5px", 2: "2px", 4: "4px" },
		},
		borderLeftWidth: {
			className: "border-l",
			values: { 0: "0px", 1: "1px", 1.5: "1.5px", 2: "2px", 4: "4px" },
		},
		borderInlineWidth: {
			shorthand: "borderXW",
			className: "border-x",
			values: { 0: "0px", 1: "1px", 1.5: "1.5px", 2: "2px" },
		},
		borderBlockWidth: {
			shorthand: "borderYW",
			className: "border-y",
			values: { 0: "0px", 1: "1px", 1.5: "1.5px", 2: "2px" },
		},
		borderStyle: {
			className: "border",
			values: {
				solid: "solid",
				dashed: "dashed",
				dotted: "dotted",
				double: "double",
				none: "none",
				hidden: "hidden",
			},
		},
		borderColor: {
			shorthand: "borderColor",
			className: "border",
			values: "colors",
		},
		borderTopColor: { className: "border-t", values: "colors" },
		borderRightColor: { className: "border-r", values: "colors" },
		borderBottomColor: { className: "border-b", values: "colors" },
		borderLeftColor: { className: "border-l", values: "colors" },
		outlineColor: { className: "outline", values: "colors" },
		outlineWidth: {
			className: "outline",
			values: { 0: "0px", 1: "1px", 2: "2px", 4: "4px" },
		},
		outlineOffset: {
			className: "outline-offset",
			values: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px" },
		},
		outlineStyle: {
			className: "outline",
			values: {
				none: "none",
				solid: "solid",
				dashed: "dashed",
				dotted: "dotted",
			},
		},

		// ── Border radius ─────────────────────────────────────────────────────────
		borderRadius: {
			shorthand: "rounded",
			className: "rounded",
			values: "radii",
		},
		borderTopLeftRadius: {
			shorthand: "roundedTl",
			className: "rounded-tl",
			values: "radii",
		},
		borderTopRightRadius: {
			shorthand: "roundedTr",
			className: "rounded-tr",
			values: "radii",
		},
		borderBottomRightRadius: {
			shorthand: "roundedBr",
			className: "rounded-br",
			values: "radii",
		},
		borderBottomLeftRadius: {
			shorthand: "roundedBl",
			className: "rounded-bl",
			values: "radii",
		},
		borderStartStartRadius: {
			shorthand: "roundedSs",
			className: "rounded-ss",
			values: "radii",
		},
		borderStartEndRadius: {
			shorthand: "roundedSe",
			className: "rounded-se",
			values: "radii",
		},
		borderEndStartRadius: {
			shorthand: "roundedEs",
			className: "rounded-es",
			values: "radii",
		},
		borderEndEndRadius: {
			shorthand: "roundedEe",
			className: "rounded-ee",
			values: "radii",
		},

		// ── Shadows & opacity ─────────────────────────────────────────────────────
		boxShadow: {
			shorthand: "shadow",
			className: "shadow",
			values: "shadows",
		},
		textShadow: {
			className: "text-shadow",
			values: "shadows",
		},
		opacity: {
			className: "opacity",
			values: {
				0: "0",
				5: "0.05",
				10: "0.1",
				20: "0.2",
				25: "0.25",
				30: "0.3",
				40: "0.4",
				50: "0.5",
				60: "0.6",
				70: "0.7",
				75: "0.75",
				80: "0.8",
				90: "0.9",
				95: "0.95",
				100: "1",
			},
		},

		// ── Transforms ───────────────────────────────────────────────────────────
		transform: {
			className: "transform",
			values: { none: "none", gpu: "translateZ(0)" },
		},
		translate: {
			className: "translate",
			values: "spacing",
		},
		translateX: {
			shorthand: "translateX",
			className: "translate-x",
			values: "spacing",
		},
		translateY: {
			shorthand: "translateY",
			className: "translate-y",
			values: "spacing",
		},
		rotate: {
			className: "rotate",
			values: {
				0: "0deg",
				1: "1deg",
				2: "2deg",
				3: "3deg",
				6: "6deg",
				12: "12deg",
				45: "45deg",
				90: "90deg",
				180: "180deg",
			},
		},
		scale: {
			className: "scale",
			values: {
				0: "0",
				50: ".5",
				75: ".75",
				90: ".9",
				95: ".95",
				100: "1",
				105: "1.05",
				110: "1.1",
				125: "1.25",
				150: "1.5",
			},
		},
		scaleX: {
			className: "scale-x",
			values: {
				0: "0",
				50: ".5",
				75: ".75",
				90: ".9",
				95: ".95",
				100: "1",
				105: "1.05",
				110: "1.1",
			},
		},
		scaleY: {
			className: "scale-y",
			values: {
				0: "0",
				50: ".5",
				75: ".75",
				90: ".9",
				95: ".95",
				100: "1",
				105: "1.05",
				110: "1.1",
			},
		},
		skewX: {
			className: "skew-x",
			values: {
				0: "0deg",
				1: "1deg",
				2: "2deg",
				3: "3deg",
				6: "6deg",
				12: "12deg",
			},
		},
		skewY: {
			className: "skew-y",
			values: {
				0: "0deg",
				1: "1deg",
				2: "2deg",
				3: "3deg",
				6: "6deg",
				12: "12deg",
			},
		},
		transformOrigin: {
			className: "origin",
			values: {
				center: "center",
				top: "top",
				"top-right": "top right",
				right: "right",
				"bottom-right": "bottom right",
				bottom: "bottom",
				"bottom-left": "bottom left",
				left: "left",
				"top-left": "top left",
			},
		},

		// ── Transitions ──────────────────────────────────────────────────────────
		transition: {
			className: "transition",
			values: {
				all: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
				colors:
					"color, background-color, border-color, text-decoration-color, fill, stroke 200ms cubic-bezier(0.4, 0, 0.2, 1)",
				opacity: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
				shadow: "box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)",
				transform: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
				none: "none",
			},
		},
		transitionProperty: {
			className: "transition-prop",
			values: {
				all: "all",
				colors: "color, background-color, border-color",
				opacity: "opacity",
				shadow: "box-shadow",
				transform: "transform",
				none: "none",
			},
		},
		transitionDuration: {
			shorthand: "duration",
			className: "duration",
			values: "durations",
		},
		transitionTimingFunction: {
			shorthand: "ease",
			className: "ease",
			values: "easings",
		},
		transitionDelay: {
			shorthand: "delay",
			className: "delay",
			values: "durations",
		},
		animation: {
			className: "animation",
			values: {
				none: "none",
				spin: "spin 1s linear infinite",
				ping: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
				pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
				bounce: "bounce 1s infinite",
			},
		},

		// ── Filters ──────────────────────────────────────────────────────────────
		backdropFilter: {
			className: "backdrop",
			values: {
				none: "none",
				"blur-sm": "blur(4px)",
				blur: "blur(8px)",
				"blur-md": "blur(12px)",
				"blur-lg": "blur(16px)",
				"blur-xl": "blur(24px)",
			},
		},
		filter: {
			className: "filter",
			values: { none: "none" },
		},

		// ── Interactivity ─────────────────────────────────────────────────────────
		cursor: {
			className: "cursor",
			values: {
				auto: "auto",
				default: "default",
				pointer: "pointer",
				wait: "wait",
				text: "text",
				move: "move",
				"not-allowed": "not-allowed",
				crosshair: "crosshair",
				grab: "grab",
				grabbing: "grabbing",
				"zoom-in": "zoom-in",
				"zoom-out": "zoom-out",
				none: "none",
			},
		},
		pointerEvents: {
			className: "pointer-events",
			values: { none: "none", auto: "auto" },
		},
		userSelect: {
			className: "select",
			values: { none: "none", text: "text", all: "all", auto: "auto" },
		},
		resize: {
			className: "resize",
			values: { none: "none", both: "both", x: "horizontal", y: "vertical" },
		},
		appearance: {
			className: "appearance",
			values: { none: "none", auto: "auto" },
		},
		touchAction: {
			className: "touch",
			values: {
				auto: "auto",
				none: "none",
				pan: "pan-x",
				"pan-y": "pan-y",
				manipulation: "manipulation",
			},
		},
		scrollBehavior: {
			className: "scroll",
			values: { auto: "auto", smooth: "smooth" },
		},

		// ── Object-fit / Image ────────────────────────────────────────────────────
		objectFit: {
			className: "object",
			values: {
				contain: "contain",
				cover: "cover",
				fill: "fill",
				none: "none",
				"scale-down": "scale-down",
			},
		},
		objectPosition: {
			className: "object",
			values: {
				bottom: "bottom",
				center: "center",
				left: "left",
				right: "right",
				top: "top",
				"left-top": "left top",
				"right-top": "right top",
			},
		},

		// ── Tables ───────────────────────────────────────────────────────────────
		borderCollapse: {
			className: "border",
			values: { collapse: "collapse", separate: "separate" },
		},
		tableLayout: {
			className: "table",
			values: { auto: "auto", fixed: "fixed" },
		},

		// ── Columns ───────────────────────────────────────────────────────────────
		columns: {
			className: "columns",
			values: { 1: "1", 2: "2", 3: "3", 4: "4", auto: "auto" },
		},

		// ── Lists ────────────────────────────────────────────────────────────────
		listStyleType: {
			className: "list",
			values: { none: "none", disc: "disc", decimal: "decimal" },
		},
		listStylePosition: {
			className: "list",
			values: { inside: "inside", outside: "outside" },
		},

		// ── SVG ──────────────────────────────────────────────────────────────────
		strokeWidth: {
			className: "stroke",
			values: { 0: "0", 1: "1", 2: "2" },
		},
	},

	// ─── Theme ──────────────────────────────────────────────────────────────────
	theme: {
		breakpoints: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		keyframes: {
			fadeInLeft: {
				"0%": {
					opacity: "0",
					transform: "translateX(-12px)",
				},
				"100%": {
					opacity: "1",
					transform: "translateX(0)",
				},
			},
			fadeDown: {
				"0%": {
					opacity: "0",
					transform: "translateY(-8px)",
				},
				"100%": {
					opacity: "1",
					transform: "translateY(0)",
				},
			},
			fadeUp: {
				"0%": {
					opacity: "0",
					transform: "translateY(10px)",
				},
				"100%": {
					opacity: "1",
					transform: "translateY(0)",
				},
			},
			modalFadeIn: {
				"0%": { opacity: "0" },
				"100%": { opacity: "1" },
			},
			modalSlideUp: {
				"0%": { opacity: "0", transform: "translateY(14px) scale(0.98)" },
				"100%": { opacity: "1", transform: "translateY(0) scale(1)" },
			},
			toastIn: {
				from: { opacity: "0", transform: "translateX(16px)" },
				to: { opacity: "1", transform: "translateX(0)" },
			},
			toastOut: {
				from: { opacity: "1", transform: "translateX(0)" },
				to: { opacity: "0", transform: "translateX(16px)" },
			},
			tooltipFadeIn: {
				"0%": { opacity: "0", transform: "scale(0.95)" },
				"100%": { opacity: "1", transform: "scale(1)" },
			},
			paletteFadeIn: {
				"0%": { opacity: "0" },
				"100%": { opacity: "1" },
			},
			paletteSlideDown: {
				"0%": { opacity: "0", transform: "translateY(-10px) scale(0.98)" },
				"100%": { opacity: "1", transform: "translateY(0) scale(1)" },
			},
		},

		tokens: {
			// ── Color palette ─────────────────────────────────────────────────────
			colors: {
				teal: {
					50: { value: "#f0f9f7" },
					100: { value: "#d9f0ea" },
					200: { value: "#b2e0d5" },
					300: { value: "#7ec8b5" },
					400: { value: "#49aa94" },
					500: { value: "#278d75" },
					600: { value: "#1a6b5a" }, // brand primary — nav, headers
					700: { value: "#155549" },
					800: { value: "#103f37" },
					900: { value: "#0b2d27" },
					950: { value: "#071c18" },
				},
				coral: {
					50: { value: "#fdf3f0" },
					100: { value: "#fce4de" },
					200: { value: "#f9c7bb" },
					300: { value: "#f4a38c" },
					400: { value: "#eb8068" },
					500: { value: "#d4735e" }, // CTAs, accents, highlights
					600: { value: "#b95846" },
					700: { value: "#974336" },
					800: { value: "#723027" },
					900: { value: "#50201b" },
					950: { value: "#301210" },
				},
				// Warm neutral — cream (light) → mid-gray → dark text (one ramp)
				stone: {
					50: { value: "#fdfcfa" },
					100: { value: "#f5f2ec" }, // cream — backgrounds, map base
					200: { value: "#ebe6dc" },
					300: { value: "#d9d2c4" },
					400: { value: "#c0b8a7" },
					500: { value: "#a59d8e" },
					600: { value: "#8a857d" }, // mid-gray — secondary text, borders
					700: { value: "#6e6960" },
					800: { value: "#504c45" },
					900: { value: "#2c2a27" }, // dark — primary text, dark surfaces
					950: { value: "#1a1815" },
				},
				white: { value: "#ffffff" },
				black: { value: "#000000" },
				transparent: { value: "transparent" },
				red: {
					50: { value: "#fdf2f2" },
					100: { value: "#fde0e0" },
					200: { value: "#fbb8b8" },
					300: { value: "#f78585" },
					400: { value: "#f05555" },
					500: { value: "#dc3535" },
					600: { value: "#be2525" },
					700: { value: "#9a1d1d" },
					800: { value: "#731515" },
					900: { value: "#4d0e0e" },
				},
				amber: {
					50: { value: "#fdf8ee" },
					100: { value: "#faefd0" },
					200: { value: "#f5da96" },
					300: { value: "#efc05e" },
					400: { value: "#e8a837" },
					500: { value: "#d4901e" },
					600: { value: "#b57316" },
					700: { value: "#8f5810" },
					800: { value: "#68400c" },
					900: { value: "#432a07" },
				},
			},

			// ── Spacing ───────────────────────────────────────────────────────────
			spacing: {
				auto: { value: "auto" },
				0: { value: "0" },
				px: { value: "1px" },
				0.5: { value: "2px" },
				1: { value: "4px" },
				1.5: { value: "6px" },
				2: { value: "8px" },
				2.5: { value: "10px" },
				3: { value: "12px" },
				3.5: { value: "14px" },
				4: { value: "16px" },
				4.5: { value: "18px" },
				5: { value: "20px" },
				6: { value: "24px" },
				7: { value: "28px" },
				8: { value: "32px" },
				9: { value: "36px" },
				10: { value: "40px" },
				11: { value: "44px" },
				12: { value: "48px" },
				14: { value: "56px" },
				16: { value: "64px" },
				18: { value: "72px" },
				20: { value: "80px" },
				24: { value: "96px" },
				25: { value: "100px" },
				28: { value: "112px" },
				32: { value: "128px" },
				36: { value: "144px" },
				40: { value: "160px" },
				48: { value: "192px" },
				56: { value: "224px" },
				64: { value: "256px" },
			},

			// ── Typography ────────────────────────────────────────────────────────
			fonts: {
				sans: { value: "'DM Sans', ui-sans-serif, system-ui, sans-serif" },
				serif: { value: "'Fraunces', Georgia, ui-serif, serif" },
				mono: {
					value: "ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace",
				},
			},
			fontSizes: {
				"4xs": { value: "0.5625rem" },
				"3xs": { value: "0.65rem" },
				xxs: { value: "0.71875rem" },
				xs: { value: "0.75rem" },
				sm: { value: "0.8125rem" },
				md: { value: "0.875rem" },
				lg: { value: "1rem" },
				xl: { value: "1.125rem" },
				"2xl": { value: "1.25rem" },
				"3xl": { value: "1.5rem" },
				"4xl": { value: "1.625rem" },
				"5xl": { value: "2rem" },
				"6xl": { value: "2.5rem" },
				"7xl": { value: "3.125rem" },
			},
			fontWeights: {
				thin: { value: "100" },
				light: { value: "300" },
				normal: { value: "400" },
				medium: { value: "500" },
				semibold: { value: "600" },
				bold: { value: "700" },
				extrabold: { value: "800" },
			},
			lineHeights: {
				none: { value: "1" },
				tight: { value: "1.2" },
				snug: { value: "1.35" },
				normal: { value: "1.5" },
				relaxed: { value: "1.625" },
				loose: { value: "2" },
			},
			letterSpacings: {
				tight: { value: "-0.03em" },
				snug: { value: "-0.015em" },
				normal: { value: "0" },
				wide: { value: "0.04em" },
				wider: { value: "0.08em" },
				widest: { value: "0.16em" },
			},

			// ── Border radius ─────────────────────────────────────────────────────
			radii: {
				none: { value: "0" },
				sm: { value: "4px" },
				md: { value: "8px" },
				lg: { value: "12px" },
				xl: { value: "16px" },
				"2xl": { value: "20px" },
				"3xl": { value: "24px" },
				full: { value: "9999px" },
			},

			// ── Shadows ───────────────────────────────────────────────────────────
			shadows: {
				xs: { value: "0 1px 2px rgba(44, 42, 39, 0.08)" },
				sm: {
					value:
						"0 1px 4px rgba(44, 42, 39, 0.1), 0 1px 2px rgba(44, 42, 39, 0.06)",
				},
				md: {
					value:
						"0 4px 12px rgba(44, 42, 39, 0.1), 0 2px 4px rgba(44, 42, 39, 0.06)",
				},
				lg: {
					value:
						"0 8px 24px rgba(44, 42, 39, 0.12), 0 4px 8px rgba(44, 42, 39, 0.06)",
				},
				xl: {
					value:
						"0 16px 40px rgba(44, 42, 39, 0.14), 0 6px 14px rgba(44, 42, 39, 0.06)",
				},
				"2xl": { value: "0 24px 64px rgba(44, 42, 39, 0.18)" },
				inner: { value: "inset 0 1px 3px rgba(44, 42, 39, 0.1)" },
				none: { value: "none" },
			},

			// ── Z-index ───────────────────────────────────────────────────────────
			zIndex: {
				hide: { value: "-1" },
				base: { value: "0" },
				raised: { value: "1" },
				dropdown: { value: "100" },
				panel: { value: "100" },
				sticky: { value: "150" },
				floating: { value: "200" },
				overlay: { value: "1050" },
				modal: { value: "1100" },
				popover: { value: "1200" },
				toast: { value: "9999" },
				tooltip: { value: "10000" },
			},

			// ── Motion ────────────────────────────────────────────────────────────
			durations: {
				fast: { value: "120ms" },
				normal: { value: "200ms" },
				slow: { value: "350ms" },
			},
			easings: {
				default: { value: "ease" },
				in: { value: "cubic-bezier(0.4, 0, 1, 1)" },
				out: { value: "cubic-bezier(0, 0, 0.2, 1)" },
				inOut: { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
				spring: { value: "cubic-bezier(0.16, 1, 0.3, 1)" },
			},
		},
		slotRecipes: {
			tabs,
			card,
			typography,
			segmented,
			stepper,
			select,
			menu,
			modal,
			tooltip,
			commandPalette,
			input,
			chipGroup,
			filterBar,
		},
		recipes: {
			link,
			button,
			toast,
			badge,
			avatar,
		},

		// ── Semantic tokens ───────────────────────────────────────────────────────
		// Use these in components — never reach for raw scales directly.
		semanticTokens: {
			colors: {
				bg: {
					base: { value: "{colors.stone.100}" }, // cream page background
					subtle: { value: "{colors.stone.50}" },
					muted: { value: "{colors.stone.200}" },
					emphasis: { value: "{colors.stone.900}" },
				},
				fg: {
					default: { value: "{colors.stone.900}" }, // dark
					muted: { value: "{colors.stone.600}" }, // mid-gray
					subtle: { value: "{colors.stone.500}" },
					onDark: { value: "{colors.stone.100}" },
				},
				border: {
					default: { value: "{colors.stone.300}" },
					subtle: { value: "{colors.stone.200}" },
					strong: { value: "{colors.stone.400}" },
				},
				brand: {
					default: { value: "{colors.teal.600}" },
					subtle: { value: "{colors.teal.100}" },
					muted: { value: "{colors.teal.200}" },
					emphasis: { value: "{colors.teal.700}" },
					fg: { value: "{colors.white}" },
				},
				accent: {
					default: { value: "{colors.coral.500}" },
					subtle: { value: "{colors.coral.100}" },
					muted: { value: "{colors.coral.200}" },
					emphasis: { value: "{colors.coral.600}" },
					fg: { value: "{colors.white}" },
				},
				danger: {
					default: { value: "{colors.red.600}" },
					subtle: { value: "{colors.red.100}" },
					muted: { value: "{colors.red.200}" },
					emphasis: { value: "{colors.red.700}" },
					fg: { value: "{colors.white}" },
				},
				success: {
					default: { value: "{colors.teal.600}" },
					subtle: { value: "{colors.teal.100}" },
					muted: { value: "{colors.teal.200}" },
					emphasis: { value: "{colors.teal.700}" },
					fg: { value: "{colors.white}" },
				},
				warning: {
					default: { value: "{colors.amber.500}" },
					subtle: { value: "{colors.amber.100}" },
					muted: { value: "{colors.amber.200}" },
					emphasis: { value: "{colors.amber.600}" },
					fg: { value: "{colors.stone.900}" }, // dark text, not white — amber is too light for white to be legible
				},
			},
		},

		extend: {},
	},

	outdir: "src/styles/styled-system",
})
