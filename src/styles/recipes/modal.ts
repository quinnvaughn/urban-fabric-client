import { defineSlotRecipe } from "@pandacss/dev"

export const modal = defineSlotRecipe({
	className: "modal",
	slots: ["backdrop", "content", "header", "closeBtn", "body"],

	base: {
		backdrop: {
			position: "fixed",
			inset: "0",
			zIndex: "modal",
			bg: "rgba(44, 42, 39, 0.3)",
			backdropFilter: "blur(4px)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			animation: "modalFadeIn 0.18s {easings.inOut} both",
		},
		content: {
			bg: "white",
			borderWidth: "1",
			borderStyle: "solid",
			borderColor: "border.subtle",
			borderRadius: "xl",
			boxShadow: "lg",
			maxWidth: "calc(100vw - 40px)",
			maxHeight: "calc(100vh - 80px)",
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			animation: "modalSlideUp 0.24s {easings.spring} both",
		},
		header: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			px: "5",
			pt: "4.5",
			pb: "4",
			borderBottomWidth: "1",
			borderBottomStyle: "solid",
			borderBottomColor: "border.subtle",
			flexShrink: "0",
		},
		closeBtn: {
			w: "7",
			h: "7",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			border: "none",
			background: "transparent",
			color: "fg.subtle",
			cursor: "pointer",
			borderRadius: "md",
			transition: "colors 0.12s ease",
			flexShrink: "0",
			_hover: {
				bg: "bg.muted",
				color: "fg.default",
			},
		},
		body: {
			overflowY: "auto",
			px: "6",
			pt: "5",
			pb: "6",
			scrollbarWidth: "thin",
			scrollbarColor: "token(colors.stone.300) transparent",
		},
	},

	variants: {
		size: {
			sm: { content: { width: "480px" } },
			md: { content: { width: "580px" } },
			lg: { content: { width: "720px" } },
		},
	},

	defaultVariants: {
		size: "md",
	},
})
