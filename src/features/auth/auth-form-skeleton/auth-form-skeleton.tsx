import { css } from "#/styles/styled-system/css"

export function AuthFormSkeleton() {
	return (
		<div className={css({ display: "flex", flexDir: "column", gap: "6" })}>
			{/* Tabs */}
			<div
				className={css({
					display: "flex",
					borderBottom: "1px solid",
					borderBottomColor: "stone.200",
					gap: "1",
				})}
			>
				<div className={css({ w: "20", h: "9", bg: "stone.100", rounded: "sm" })} />
				<div className={css({ w: "32", h: "9", bg: "stone.100", rounded: "sm" })} />
			</div>

			<div className={css({ display: "flex", flexDir: "column", gap: "6", py: "2" })}>
				{/* Google button */}
				<div
					className={css({
						w: "full",
						h: "10",
						bg: "stone.100",
						rounded: "md",
						borderWidth: "1px",
						borderColor: "stone.200",
					})}
				/>

				{/* Divider */}
				<div
					className={css({
						display: "flex",
						alignItems: "center",
						gap: "3",
					})}
				>
					<div className={css({ flex: 1, h: "px", bg: "stone.200" })} />
					<div className={css({ w: "16", h: "3", bg: "stone.200", rounded: "sm" })} />
					<div className={css({ flex: 1, h: "px", bg: "stone.200" })} />
				</div>

				{/* Inputs */}
				<div className={css({ display: "flex", flexDir: "column", gap: "3" })}>
					{/* Email */}
					<div className={css({ display: "flex", flexDir: "column", gap: "1.5" })}>
						<div className={css({ w: "12", h: "3.5", bg: "stone.200", rounded: "sm" })} />
						<div
							className={css({
								w: "full",
								h: "9",
								bg: "stone.100",
								rounded: "md",
								borderWidth: "1px",
								borderColor: "stone.200",
							})}
						/>
					</div>
					{/* Password */}
					<div className={css({ display: "flex", flexDir: "column", gap: "1.5" })}>
						<div className={css({ w: "20", h: "3.5", bg: "stone.200", rounded: "sm" })} />
						<div
							className={css({
								w: "full",
								h: "9",
								bg: "stone.100",
								rounded: "md",
								borderWidth: "1px",
								borderColor: "stone.200",
							})}
						/>
					</div>
					{/* Submit button */}
					<div className={css({ w: "full", h: "9", bg: "stone.200", rounded: "md" })} />
					{/* Footer link */}
					<div
						className={css({
							display: "flex",
							justifyContent: "center",
							gap: "1",
						})}
					>
						<div className={css({ w: "20", h: "3", bg: "stone.100", rounded: "sm" })} />
						<div className={css({ w: "28", h: "3", bg: "stone.100", rounded: "sm" })} />
					</div>
				</div>
			</div>
		</div>
	)
}
