import { type JSX, type ReactNode, useRef } from "react"
import { css, cx } from "../../../../styled-system/css"
import { input } from "../../../../styled-system/recipes"
import { Flex } from "../flex"

type Props = {
	label?: string
	id?: string
	error?: string
	endAdornment?: ReactNode
} & JSX.IntrinsicElements["input"]

export function Input({ className, id, label, error, ...rest }: Props) {
	const inputRef = useRef<HTMLInputElement>(null)
	return (
		<Flex
			direction="column"
			gap="sm"
			className={cx(css({ width: "100%" }), className)}
		>
			{label && (
				<label
					htmlFor={id}
					className={css({
						display: "block",
						fontWeight: "medium",
						color: "text",
					})}
				>
					{label}
				</label>
			)}
			<fieldset
				className={cx(
					input({ error: !!error }),
					css({ display: "flex", alignItems: "center", gap: "sm" }),
				)}
				onMouseDown={(e) => {
					if (e.target === e.currentTarget) {
						e.preventDefault()
						inputRef.current?.focus()
					}
				}}
			>
				<input
					id={id}
					ref={inputRef}
					{...rest}
					className={css({
						width: "100%",
						height: "100%",
						flex: 1,
						border: "none",
						outline: "none",
						bg: "transparent",
					})}
				/>
				{rest.endAdornment}
			</fieldset>
			{error && (
				<em className={css({ color: "danger", fontSize: "sm" })} role="alert">
					{error}
				</em>
			)}
		</Flex>
	)
}
