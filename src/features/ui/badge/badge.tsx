import { cx } from "#/styles/styled-system/css"
import { type BadgeVariantProps, badge } from "#/styles/styled-system/recipes"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	size?: BadgeVariantProps["size"]
	tone?: BadgeVariantProps["tone"]
	appearance?: BadgeVariantProps["appearance"]
	uppercase?: BadgeVariantProps["uppercase"]
}

export function Badge({
	size,
	tone,
	appearance,
	uppercase,
	className,
	...rest
}: BadgeProps) {
	return (
		<span
			className={cx(badge({ size, tone, appearance, uppercase }), className)}
			{...rest}
		/>
	)
}
