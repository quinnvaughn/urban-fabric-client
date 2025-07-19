import { forwardRef } from "react"
import { css, cx } from "../../../styles/styled-system/css"
import {
	type IconButtonVariantProps,
	iconButton,
} from "../../../styles/styled-system/recipes"
import { Icon, type IconProps } from "../icon"

type IconButtonProps = {
	icon: IconProps["name"]
	size?: number
	label?: string // for aria-label / tooltip
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	className?: string
} & IconButtonVariantProps

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	function IconButton(
		{
			icon,
			size = 20,
			label,
			onClick,
			className,
			borderRadius,
		}: IconButtonProps,
		ref,
	) {
		return (
			<button
				ref={ref}
				type="button"
				onClick={onClick}
				aria-label={label || icon}
				className={cx(iconButton({ borderRadius }), className)}
			>
				<Icon name={icon} size={size} />
			</button>
		)
	},
)
