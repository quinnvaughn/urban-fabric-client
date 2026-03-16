import { css, cx } from "@/styles/styled-system/css"

const dividerWithLabelStyles = css({
	display: "flex",
	alignItems: "center",
	gap: "2",
})

const dividerLabelStyles = css({
	fontSize: "3xs",
	fontWeight: "semibold",
	letterSpacing: "wider",
	textTransform: "uppercase",
	color: "stone.400",
	whiteSpace: "nowrap",
	flexShrink: 0,
})

const hrStyles = css({
	flex: "1 1 auto",
	border: "none",
	borderTopWidth: "1",
	borderTopStyle: "solid",
	borderTopColor: "stone.200",
	margin: 0,
})

export interface DividerProps {
	label?: string
	lines?: "left" | "right" | "both"
	className?: string
}

export function Divider({ label, lines = "right", className }: DividerProps) {
	if (!label) {
		return <hr className={cx(hrStyles, className)} />
	}

	return (
		<div className={cx(dividerWithLabelStyles, className)}>
			{(lines === "left" || lines === "both") && <hr className={hrStyles} />}
			<span className={dividerLabelStyles}>{label}</span>
			{(lines === "right" || lines === "both") && <hr className={hrStyles} />}
		</div>
	)
}
