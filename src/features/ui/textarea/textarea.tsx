import { type JSX, type ReactNode, useRef } from "react"
import { css, cx } from "../../../styles/styled-system/css"
import { input } from "../../../styles/styled-system/recipes"
import { Flex } from "../flex"

type Props = {
	label?: string
	id?: string
	error: string | null
	endAdornment?: ReactNode
	value: string
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	onBlur: () => void
	rows?: number
} & Omit<JSX.IntrinsicElements["textarea"], "value" | "onChange" | "onBlur">

export function Textarea({
	className,
	id,
	label,
	error = "",
	required,
	endAdornment,
	onChange,
	onBlur,
	value,
	rows = 4,
	...rest
}: Props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
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
						display: "flex",
						fontWeight: "medium",
						color: "text",
						gap: "xxs",
					})}
				>
					<span className={css({ color: "text" })}></span>
					{label}
					{required && (
						<span aria-hidden className={css({ color: "danger" })}>
							*
						</span>
					)}
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
						textareaRef.current?.focus()
					}
				}}
			>
				<textarea
					id={id}
					ref={textareaRef}
					rows={rows}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					{...rest}
					className={css({
						width: "100%",
						flex: 1,
						resize: "vertical",
						border: "none",
						outline: "none",
						bg: "transparent",
						fontFamily: "inherit",
						fontSize: "inherit",
						lineHeight: "tight",
					})}
				/>
				{endAdornment}
			</fieldset>
			{Boolean(error) && (
				<em className={css({ color: "danger", fontSize: "sm" })} role="alert">
					{error}
				</em>
			)}
		</Flex>
	)
}
