import { css } from "#/styles/styled-system/css"

export function HomePageSkeleton() {
	return (
		<div className={css({ bg: "bg.base" })}>
			{/* Hero section */}
			<section
				className={css({
					minH: "calc(100vh - var(--uf-header-height))",
					display: "flex",
					alignItems: "center",
					w: "full",
				})}
			>
				<div
					className={css({
						maxW: "1160px",
						marginInline: "auto",
						paddingInline: { base: "7", md: "20" },
						w: "full",
						display: "grid",
						gridTemplateColumns: { base: "1fr", md: "1fr 1fr" },
						gap: "8",
						alignItems: "center",
						paddingBlock: { base: "12", md: "25" },
					})}
				>
					{/* Left: text content */}
					<div className={css({ display: "flex", flexDir: "column", gap: "9" })}>
						<div className={css({ display: "flex", flexDir: "column", gap: "7" })}>
							{/* Badge */}
							<div
								className={css({
									w: "44",
									h: "6",
									bg: "stone.200",
									rounded: "full",
								})}
							/>
							<div className={css({ display: "flex", flexDir: "column", gap: "6" })}>
								{/* Heading lines */}
								<div className={css({ display: "flex", flexDir: "column", gap: "3" })}>
									<div
										className={css({ w: "full", h: "10", bg: "stone.200", rounded: "sm" })}
									/>
									<div
										className={css({ w: "4/5", h: "10", bg: "stone.200", rounded: "sm" })}
									/>
									<div
										className={css({ w: "3/4", h: "10", bg: "stone.200", rounded: "sm" })}
									/>
								</div>
								{/* Description */}
								<div className={css({ display: "flex", flexDir: "column", gap: "2" })}>
									<div
										className={css({ w: "full", h: "4", bg: "stone.100", rounded: "sm" })}
									/>
									<div
										className={css({ w: "full", h: "4", bg: "stone.100", rounded: "sm" })}
									/>
									<div
										className={css({ w: "2/3", h: "4", bg: "stone.100", rounded: "sm" })}
									/>
								</div>
							</div>
						</div>
						{/* CTA buttons + helper text */}
						<div className={css({ display: "flex", flexDir: "column", gap: "4" })}>
							<div className={css({ display: "flex", gap: "4" })}>
								<div
									className={css({
										flex: 1,
										h: "11",
										bg: "stone.200",
										rounded: "md",
									})}
								/>
								<div
									className={css({
										flex: 1,
										h: "11",
										bg: "stone.200",
										rounded: "md",
									})}
								/>
							</div>
							<div className={css({ w: "64", h: "3", bg: "stone.100", rounded: "sm" })} />
						</div>
					</div>

					{/* Right: card */}
					<div
						className={css({
							bg: "white",
							rounded: "lg",
							borderWidth: "1px",
							borderColor: "border.subtle",
							overflow: "hidden",
						})}
					>
						{/* Card media / map */}
						<div
							className={css({
								w: "full",
								aspectRatio: "4/3",
								bg: "stone.200",
							})}
						/>
						{/* Card body */}
						<div
							className={css({
								p: "4",
								display: "flex",
								flexDir: "column",
								gap: "3",
							})}
						>
							<div className={css({ display: "flex", flexDir: "column", gap: "2" })}>
								<div
									className={css({ w: "28", h: "3", bg: "stone.100", rounded: "sm" })}
								/>
								<div
									className={css({ w: "full", h: "5", bg: "stone.200", rounded: "sm" })}
								/>
								<div
									className={css({ w: "4/5", h: "5", bg: "stone.200", rounded: "sm" })}
								/>
								<div
									className={css({ w: "full", h: "3.5", bg: "stone.100", rounded: "sm" })}
								/>
								<div
									className={css({ w: "3/4", h: "3.5", bg: "stone.100", rounded: "sm" })}
								/>
							</div>
							<div
								className={css({
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								})}
							>
								<div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
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
										className={css({ w: "28", h: "3", bg: "stone.100", rounded: "sm" })}
									/>
								</div>
								<div className={css({ display: "flex", gap: "3" })}>
									<div
										className={css({ w: "10", h: "3", bg: "stone.100", rounded: "sm" })}
									/>
									<div
										className={css({ w: "10", h: "3", bg: "stone.100", rounded: "sm" })}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
