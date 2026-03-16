import { cx, sva } from "@/styles/styled-system/css"

const dividerStyles = sva({
	slots: ["container", "line", "label"],
	base: {
		container: {
			display: "flex",
			alignItems: "center",
			gap: "2",
		},
		line: {
			flex: "1 1 auto",
			border: "none",
			borderTopWidth: "1",
			borderTopStyle: "solid",
			borderTopColor: "stone.200",
			margin: 0,
		},
		label: {
			fontSize: "3xs",
			fontWeight: "semibold",
			letterSpacing: "wider",
			textTransform: "uppercase",
			color: "stone.400",
			whiteSpace: "nowrap",
			flexShrink: 0,
		},
	},
})

export interface DividerProps {
	label?: string
	lines?: "left" | "right" | "both"
	className?: string
}

export function Divider({ label, lines = "right", className }: DividerProps) {
	const styles = dividerStyles()
	if (!label) {
		return <hr className={cx(styles.line, className)} />
	}

	return (
		<div className={cx(styles.container, className)}>
			{(lines === "left" || lines === "both") && <hr className={styles.line} />}
			<span className={styles.label}>{label}</span>
			{(lines === "right" || lines === "both") && (
				<hr className={styles.line} />
			)}
		</div>
	)
}
