import { css } from "#/styles/styled-system/css"

export function ProposalPageSkeleton() {
	return (
		<div
			className={css({
				display: "flex",
				flexDir: "column",
				h: "screen",
				w: "screen",
				background: "stone.100",
			})}
		>
			{/* Header */}
			<div
				className={css({
					flexShrink: 0,
					height: "var(--uf-header-height)",
					display: "flex",
					alignItems: "center",
					px: "4",
					gap: "2.5",
					borderBottom: "1px solid",
					borderBottomColor: "border.subtle",
					background: "white",
				})}
			>
				<div
					className={css({
						w: "24",
						h: "5",
						bg: "stone.200",
						rounded: "sm",
						flexShrink: 0,
					})}
				/>
				<div
					className={css({ w: "px", h: "18px", bg: "stone.200", flexShrink: 0 })}
				/>
				<div className={css({ w: "48", h: "4", bg: "stone.200", rounded: "sm" })} />
				<div
					className={css({
						w: "20",
						h: "3",
						bg: "stone.200",
						rounded: "sm",
						flexShrink: 0,
					})}
				/>
				<div className={css({ flex: 1 })} />
				<div
					className={css({
						w: "20",
						h: "8",
						bg: "stone.200",
						rounded: "md",
						flexShrink: 0,
					})}
				/>
			</div>
			{/* Shell */}
			<div
				className={css({
					flex: 1,
					position: "relative",
					minH: 0,
					overflow: "hidden",
				})}
			>
				{/* Map background */}
				<div className={css({ position: "absolute", inset: 0, bg: "stone.200" })} />
				{/* Panel */}
				<div
					className={css({
						position: "absolute",
						top: 0,
						left: 0,
						width: "360px",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						background: "white",
						borderRight: "1px solid",
						borderRightColor: "border.subtle",
						zIndex: "floating",
					})}
				>
					{/* Panel header */}
					<div className={css({ flexShrink: 0, px: "5", paddingTop: "5" })}>
						<div
							className={css({ display: "flex", flexDir: "column", gap: "3" })}
						>
							{/* "PROPOSAL" label */}
							<div
								className={css({
									w: "14",
									h: "2.5",
									bg: "stone.200",
									rounded: "sm",
								})}
							/>
							{/* Title */}
							<div
								className={css({ display: "flex", flexDir: "column", gap: "2" })}
							>
								<div
									className={css({
										w: "full",
										h: "5",
										bg: "stone.200",
										rounded: "sm",
									})}
								/>
								<div
									className={css({
										w: "3/4",
										h: "5",
										bg: "stone.200",
										rounded: "sm",
									})}
								/>
							</div>
							{/* Avatar + name */}
							<div
								className={css({
									display: "flex",
									alignItems: "center",
									gap: "2",
								})}
							>
								<div
									className={css({
										w: "6",
										h: "6",
										bg: "stone.200",
										rounded: "full",
										flexShrink: 0,
									})}
								/>
								<div
									className={css({
										w: "28",
										h: "3.5",
										bg: "stone.200",
										rounded: "sm",
									})}
								/>
							</div>
							{/* Date / location row */}
							<div
								className={css({
									display: "flex",
									alignItems: "center",
									gap: "2",
								})}
							>
								<div
									className={css({ w: "20", h: "3", bg: "stone.200", rounded: "sm" })}
								/>
								<div
									className={css({
										w: "1",
										h: "1",
										bg: "stone.300",
										rounded: "full",
									})}
								/>
								<div
									className={css({ w: "24", h: "3", bg: "stone.200", rounded: "sm" })}
								/>
							</div>
							{/* Category badges */}
							<div className={css({ display: "flex", gap: "1" })}>
								<div
									className={css({
										w: "16",
										h: "5",
										bg: "stone.200",
										rounded: "full",
									})}
								/>
								<div
									className={css({
										w: "20",
										h: "5",
										bg: "stone.200",
										rounded: "full",
									})}
								/>
							</div>
							{/* Tabs */}
							<div
								className={css({
									display: "flex",
									borderBottom: "1px solid",
									borderBottomColor: "stone.200",
								})}
							>
								<div
									className={css({ w: "16", h: "9", bg: "stone.100", rounded: "sm" })}
								/>
								<div
									className={css({ w: "16", h: "9", bg: "stone.100", rounded: "sm" })}
								/>
							</div>
						</div>
					</div>
					{/* Panel body */}
					<div
						className={css({
							flex: 1,
							px: "5",
							py: "4",
							display: "flex",
							flexDir: "column",
							gap: "3",
						})}
					>
						{["a", "b", "c", "d", "e"].map((id) => (
							<div
								key={id}
								className={css({ h: "3", bg: "stone.100", rounded: "sm" })}
								style={{ width: id === "c" ? "83%" : id === "e" ? "67%" : "100%" }}
							/>
						))}
					</div>
					{/* Panel footer */}
					<div
						className={css({
							flexShrink: 0,
							borderTop: "1px solid",
							borderTopColor: "border.subtle",
							px: "5",
							py: "3.5",
							display: "flex",
							gap: "2",
						})}
					>
						<div
							className={css({ flex: 1, h: "9", bg: "stone.200", rounded: "md" })}
						/>
						<div
							className={css({ w: "10", h: "9", bg: "stone.200", rounded: "md" })}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
