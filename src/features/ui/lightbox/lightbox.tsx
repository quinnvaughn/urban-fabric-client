import { ChevronLeft, ChevronRight, X } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"
import { cx, sva } from "@/styles/styled-system/css"

// ─── Styles ──────────────────────────────────────────────────────────────────

const lightbox = sva({
	slots: [
		"backdrop",
		"container",
		"closeBtn",
		"image",
		"footer",
		"caption",
		"counter",
		"nav",
		"navBtn",
	],
	base: {
		backdrop: {
			position: "fixed",
			inset: "0",
			zIndex: "modal",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			p: "6",
			bg: "rgba(28, 26, 24, 0.88)",
			backdropFilter: "blur-sm",
			animation: "modalFadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1) both",
		},
		container: {
			position: "relative",
			w: "full",
			maxW: "4xl",
			display: "flex",
			flexDir: "column",
			gap: "3",
			animation: "modalSlideUp 250ms cubic-bezier(0.16, 1, 0.3, 1) both",
		},
		closeBtn: {
			position: "absolute",
			top: "-3.5",
			right: "-3.5",
			w: "8",
			h: "8",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			rounded: "full",
			border: "1px solid rgba(255,255,255,0.15)",
			bg: "rgba(255,255,255,0.08)",
			color: "rgba(255,255,255,0.65)",
			cursor: "pointer",
			transition: "all",
			_hover: {
				bg: "rgba(255,255,255,0.18)",
				color: "rgba(255,255,255,1)",
			},
		},
		image: {
			w: "full",
			rounded: "lg",
			overflow: "hidden",
			bg: "stone.800",
			// aspect ratio applied inline — varies by content
		},
		footer: {
			display: "flex",
			alignItems: "center",
			gap: "3",
			px: "1",
		},
		caption: {
			flex: "1",
			text: "sm",
			color: "rgba(255,255,255,0.55)",
			leading: "normal",
			// clamp to 2 lines
			display: "-webkit-box",
			overflow: "hidden",
		},
		counter: {
			text: "sm",
			fontWeight: "medium",
			color: "rgba(255,255,255,0.4)",
			whiteSpace: "nowrap",
			flexShrink: "0",
		},
		nav: {
			display: "flex",
			gap: "1.5",
			flexShrink: "0",
		},
		navBtn: {
			w: "8",
			h: "8",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			rounded: "md",
			border: "1px solid rgba(255,255,255,0.12)",
			bg: "rgba(255,255,255,0.06)",
			color: "rgba(255,255,255,0.65)",
			cursor: "pointer",
			transition: "all",
			_hover: {
				bg: "rgba(255,255,255,0.14)",
				color: "rgba(255,255,255,1)",
			},
			_disabled: {
				opacity: "30",
				cursor: "not-allowed",
				_hover: {
					bg: "rgba(255,255,255,0.06)",
					color: "rgba(255,255,255,0.65)",
				},
			},
		},
	},
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LightboxPhoto {
	/** Image src URL */
	src: string
	/** Optional caption displayed in the footer */
	caption?: string
	/** Alt text for accessibility */
	alt?: string
}

export interface LightboxProps {
	photos: LightboxPhoto[]
	/** Index of the initially-shown photo */
	initialIndex?: number
	onClose: () => void
	className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Lightbox({
	photos,
	initialIndex = 0,
	onClose,
	className,
}: LightboxProps) {
	const [index, setIndex] = React.useState(initialIndex)
	const classes = lightbox()

	const photo = photos[index]
	const hasPrev = index > 0
	const hasNext = index < photos.length - 1

	// Keyboard navigation
	React.useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose()
			if (e.key === "ArrowLeft" && hasPrev) setIndex((i) => i - 1)
			if (e.key === "ArrowRight" && hasNext) setIndex((i) => i + 1)
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [onClose, hasPrev, hasNext])

	// Reset index when photos change externally
	React.useEffect(() => {
		setIndex(Math.min(initialIndex, Math.max(0, photos.length - 1)))
	}, [initialIndex, photos.length])

	// Trap focus in backdrop
	function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
		if (e.target === e.currentTarget) onClose()
	}

	if (!photo) return null

	return createPortal(
		// biome-ignore lint/a11y/useKeyWithClickEvents: ignore
		<div
			className={cx(classes.backdrop, className)}
			role="dialog"
			aria-modal="true"
			aria-label="Photo viewer"
			onClick={onBackdropClick}
		>
			<div className={classes.container}>
				{/* Close */}
				<button
					type="button"
					className={classes.closeBtn}
					onClick={onClose}
					aria-label="Close"
				>
					<X />
				</button>

				{/* Image */}
				<div className={classes.image} style={{ aspectRatio: "4 / 3" }}>
					<img
						key={photo.src}
						src={photo.src}
						alt={photo.alt ?? photo.caption ?? "Photo"}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
							display: "block",
						}}
					/>
				</div>

				{/* Footer: caption · counter · nav */}
				<div className={classes.footer}>
					<p
						className={classes.caption}
						style={{
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
						}}
					>
						{photo.caption ?? ""}
					</p>

					{photos.length > 1 && (
						<>
							<span className={classes.counter}>
								{index + 1} / {photos.length}
							</span>

							<div className={classes.nav}>
								<button
									type="button"
									className={classes.navBtn}
									onClick={() => setIndex((i) => i - 1)}
									disabled={!hasPrev}
									aria-label="Previous photo"
								>
									<ChevronLeft />
								</button>
								<button
									type="button"
									className={classes.navBtn}
									onClick={() => setIndex((i) => i + 1)}
									disabled={!hasNext}
									aria-label="Next photo"
								>
									<ChevronRight />
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>,
		document.body,
	)
}
