import type { JSX } from "react"
import { css, cx } from "../../../../styled-system/css"
import { Flex } from "../flex"

type Props = {
	label?: string
	id?: string
	error?: string
	class?: string
} & JSX.IntrinsicElements["input"]

export function Input(props: Props) {
	const inputClass = css({
		width: "100%",
		px: "md",
		py: "sm",
		fontSize: "md",
		border: "1px solid",
		borderRadius: "lg",
		bg: "surface",
		color: "text",
		outline: "none",
		_focus: { borderColor: "primary" },
		_disabled: { bg: "muted", color: "textSecondary", cursor: "not-allowed" },
		transition: "border-color 0.2s ease",
	})

	return (
		<Flex
			direction="column"
			gap="sm"
			className={cx(css({ width: "100%" }), props.class)}
		>
			{props.label && (
				<label
					htmlFor={props.id}
					className={css({
						display: "block",
						fontWeight: "medium",
						color: "text",
					})}
				>
					{props.label}
				</label>
			)}
			<input
				id={props.id}
				{...props}
				className={cx(
					inputClass,
					props.error
						? css({ borderColor: "danger" })
						: css({ borderColor: "muted" }),
				)}
			/>
			{props.error && (
				<span className={css({ color: "danger", fontSize: "sm" })}>
					{props.error}
				</span>
			)}
		</Flex>
	)
}
