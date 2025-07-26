import { forwardRef } from "react"
import { css, cx } from "../../../styles/styled-system/css"
import {
	type IconButtonVariantProps,
	iconButton,
} from "../../../styles/styled-system/recipes"
import { Icon, type IconProps } from "../icon"

type IconButtonProps = {
	name: IconProps["name"]
	size?: number
	label?: string // for aria-label / tooltip
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	weight?: IconProps["weight"]
	className?: string
} & IconButtonVariantProps

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	function IconButton(
		{
			name,
			size = 20,
			label,
			onClick,
			className,
			borderRadius,
			weight = "regular",
		}: IconButtonProps,
		ref,
	) {
		return (
			<button
				ref={ref}
				type="button"
				onClick={onClick}
				aria-label={label || name}
				className={cx(iconButton({ borderRadius }), className)}
			>
				<Icon name={name} size={size} weight={weight} />
			</button>
		)
	},
)
