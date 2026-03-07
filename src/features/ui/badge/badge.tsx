import { cx } from "#/styles/styled-system/css"
import { type BadgeVariantProps, badge } from "#/styles/styled-system/recipes"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	size?: BadgeVariantProps["size"]
	tone?: BadgeVariantProps["tone"]
}

export function Badge({ size, tone, className, ...rest }: BadgeProps) {
	return <span className={cx(badge({ size, tone }), className)} {...rest} />
}
