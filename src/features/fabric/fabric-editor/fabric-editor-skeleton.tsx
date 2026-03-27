import { css } from "#/styles/styled-system/css"

const ELEMENT_ROW_WIDTHS = ["72%", "85%", "60%", "90%", "68%", "80%", "55%", "75%"]

export function FabricEditorSkeleton() {
	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
			{/* Map background */}
			<div className={css({ position: "absolute", inset: 0, bg: "stone.200" })} />

			{/* Topbar */}
			<header
				className={css({
					height: "var(--uf-topbar-height)",
					position: "fixed",
					inset: "0 0 auto 0",
					zIndex: "sticky",
					background: "white",
					borderBottom: "1px solid",
					borderBottomColor: "border.default",
					display: "flex",
					alignItems: "center",
					px: "4",
					gap: "2.5",
				})}
			>
				{/* Logo + title */}
				<div className={css({ display: "flex", alignItems: "center", gap: "3", flex: 1, minWidth: 0 })}>
					<div className={css({ w: "28", h: "5", bg: "stone.200", rounded: "sm", flexShrink: 0 })} />
					<div className={css({ w: "48", h: "7", bg: "stone.100", rounded: "md" })} />
				</div>
				{/* Right actions */}
				<div className={css({ display: "flex", gap: "2", flexShrink: 0 })}>
					<div className={css({ w: "24", h: "8", bg: "stone.200", rounded: "md" })} />
					<div className={css({ w: "28", h: "8", bg: "stone.200", rounded: "md" })} />
				</div>
			</header>

			{/* Element panel */}
			<div
				className={css({
					position: "fixed",
					top: "calc(var(--uf-header-height) + 20px)",
					left: "5",
					zIndex: "panel",
					width: "200px",
					background: "white",
					borderRadius: "lg",
					boxShadow: "md",
					overflow: "hidden",
				})}
			>
				{/* Tool row */}
				<div
					className={css({
						display: "flex",
						alignItems: "center",
						gap: "0.5",
						p: "1.5",
						borderBottom: "1px solid",
						borderBottomColor: "border.subtle",
					})}
				>
					{[0, 1].map((i) => (
						<div key={i} className={css({ w: "8", h: "8", bg: "stone.100", rounded: "md" })} />
					))}
					<div className={css({ w: "px", h: "18px", bg: "stone.200", mx: "0.5" })} />
					{[0, 1].map((i) => (
						<div key={i} className={css({ w: "8", h: "8", bg: "stone.100", rounded: "md" })} />
					))}
				</div>

				{/* Category */}
				<div className={css({ pb: "2" })}>
					<div className={css({ px: "2.5", pt: "3", pb: "1.5" })}>
						<div className={css({ w: "14", h: "2.5", bg: "stone.200", rounded: "sm" })} />
					</div>
					<div className={css({ display: "flex", flexDir: "column", gap: "px", px: "1.5" })}>
						{ELEMENT_ROW_WIDTHS.map((width, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
								key={i}
								className={css({ display: "flex", alignItems: "center", gap: "2", p: "2", rounded: "md" })}
							>
								<div className={css({ w: "2.5", h: "2.5", bg: "stone.200", rounded: "sm", flexShrink: 0 })} />
								<div
									className={css({ h: "3.5", bg: "stone.100", rounded: "sm" })}
									style={{ width }}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
