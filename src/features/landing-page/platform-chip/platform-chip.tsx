import { css } from "#/styles/styled-system/css"

type Props = {
	icon: React.ReactNode
	label: string
	href?: string
}

export function PlatformChip({ icon, label, href }: Props) {
	const El = href ? "a" : "div"
	return (
		<El
			href={href}
			className={css({
				display: "inline-flex",
				alignItems: "center",
				gap: "1.5",
				px: "3",
				py: "1",
				borderRadius: "full",
				background: "bg.base",
				border: "1px solid {colors.border.subtle}",
				fontSize: "xs",
				fontWeight: "medium",
				color: "stone.700",
				textDecoration: "none",
				_hover: href
					? { shadow: "sm", borderColor: "border.default" }
					: undefined,
			})}
		>
			{icon}
			{label}
		</El>
	)
}
