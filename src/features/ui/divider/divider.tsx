import { css, cx } from "@/styles/styled-system/css"

const hrStyles = css({
	flex: "1 1 auto",
	border: "none",
	borderTopWidth: "1",
	borderTopStyle: "solid",
	borderTopColor: "stone.200",
	margin: 0,
})

const dividerWithLabelStyles = css({
	display: "flex",
	alignItems: "center",
	gap: "3",
})

const dividerLabelStyles = css({
	fontSize: "xs",
	fontWeight: "medium",
	letterSpacing: "wider",
	textTransform: "uppercase",
	color: "stone.400",
	whiteSpace: "nowrap",
	flexShrink: 0,
})

export interface DividerProps {
	label?: string
	className?: string
}

export function Divider({ label, className }: DividerProps) {
	if (!label) {
		return <hr className={cx(hrStyles, className)} />
	}

	return (
		<div className={cx(dividerWithLabelStyles, className)}>
			<hr className={hrStyles} />
			<span className={dividerLabelStyles}>{label}</span>
			<hr className={hrStyles} />
		</div>
	)
}
