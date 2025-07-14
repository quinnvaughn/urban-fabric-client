import type { IconProps as PhosphorIconProps } from "@phosphor-icons/react"
import * as Icons from "@phosphor-icons/react"
import type { ComponentType } from "react"

export type IconProps = {
	name: string // from backend, e.g., "Bicycle"
	size?: number
	weight?: PhosphorIconProps["weight"]
	color?: string
	className?: string
}

export function Icon({
	name,
	size = 24,
	weight = "regular",
	color,
	className,
}: IconProps) {
	const iconName = `${name}Icon`
	/*biome-ignore lint: ignore*/
	const PhosphorIcon = Icons[iconName as keyof typeof Icons] as
		| ComponentType<PhosphorIconProps>
		| undefined

	if (!PhosphorIcon) {
		console.warn(`Icon "${iconName}" not found in phosphor icons`)
		return null
	}

	return (
		<PhosphorIcon
			size={size}
			weight={weight}
			color={color}
			className={className}
		/>
	)
}
