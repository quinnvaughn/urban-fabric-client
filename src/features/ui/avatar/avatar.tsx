import { getInitials } from "#/lib/string"
import { cx } from "#/styles/styled-system/css"
import { type AvatarVariantProps, avatar } from "#/styles/styled-system/recipes"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string
	size?: AvatarVariantProps["size"]
	tone?: AvatarVariantProps["tone"]
	appearance?: AvatarVariantProps["appearance"]
	profilePictureUrl?: string | null
}

export function Avatar({
	name,
	size,
	tone,
	appearance,
	className,
	profilePictureUrl,
	...rest
}: AvatarProps) {
	return (
		<div
			className={cx(avatar({ size, tone, appearance }), className)}
			{...rest}
		>
			{profilePictureUrl ? (
				<img
					src={profilePictureUrl}
					alt={name}
					style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
				/>
			) : (
				getInitials(name)
			)}
		</div>
	)
}
