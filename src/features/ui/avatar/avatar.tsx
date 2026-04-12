import { getInitials } from "#/lib/string"
import { cx } from "#/styles/styled-system/css"
import { type AvatarVariantProps, avatar } from "#/styles/styled-system/recipes"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string
	size?: AvatarVariantProps["size"]
	tone?: AvatarVariantProps["tone"]
	appearance?: AvatarVariantProps["appearance"]
}

export function Avatar({
	name,
	size,
	tone,
	appearance,
	className,
	...rest
}: AvatarProps) {
	return (
		<div
			className={cx(avatar({ size, tone, appearance }), className)}
			{...rest}
		>
			{getInitials(name)}
		</div>
	)
}
