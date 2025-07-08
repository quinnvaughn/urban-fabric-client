import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { type ComponentProps, useState } from "react"
import { css } from "../../../../styled-system/css"
import { Input } from "../input"

type Props = Omit<ComponentProps<typeof Input>, "type">

export function PasswordField(props: Props) {
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
				color: "neutral.500",
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
			{...props}
		/>
	)
}
