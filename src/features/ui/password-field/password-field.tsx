import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { type JSX, useState } from "react"
import { css } from "../../../../styled-system/css"
import { Input } from "../input"

type Props = {
	label?: string
	id?: string
	error?: string
	class?: string
} & Omit<JSX.IntrinsicElements["input"], "type">

export function PasswordField({ error, ...rest }: Props) {
	const [isShowingPassword, setIsShowingPassword] = useState(false)

	const endAdornment = (
		<button
			type="button"
			tabIndex={-1}
			onClick={() => setIsShowingPassword((x) => !x)}
			className={css({
				background: "transparent",
				border: "none",
				cursor: "pointer",
				color: "textSecondary",
				display: "flex",
				alignItems: "center",
			})}
			aria-label={isShowingPassword ? "Hide password" : "Show password"}
		>
			{isShowingPassword ? (
				<EyeSlashIcon size={20} weight="bold" />
			) : (
				<EyeIcon size={20} weight="bold" />
			)}
		</button>
	)

	return (
		<Input
			type={isShowingPassword ? "text" : "password"}
			endAdornment={endAdornment}
			{...rest}
		/>
	)
}
