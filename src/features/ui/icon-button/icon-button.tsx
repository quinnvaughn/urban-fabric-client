import { forwardRef } from "react"
import { css, cx } from "../../../styles/styled-system/css"
import { Icon, type IconProps } from "../icon"

type IconButtonProps = {
	icon: IconProps["name"]
	size?: number
	label?: string // for aria-label / tooltip
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	className?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	function IconButton(
		{ icon, size = 20, label, onClick, className }: IconButtonProps,
		ref,
	) {
		return (
			<button
				ref={ref}
				type="button"
				onClick={onClick}
				aria-label={label || icon}
				className={cx(
					css({
						p: "xs",
						borderRadius: "full",
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						bg: "transparent",
						cursor: "pointer",
						_hover: {
							bg: "neutral.100",
						},
						_focusVisible: {
							outline: "2px solid",
							outlineColor: "primary.500",
						},
					}),
					className,
				)}
			>
				<Icon name={icon} size={size} />
			</button>
		)
	},
)
