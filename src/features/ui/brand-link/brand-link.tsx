import { Link, useRouteContext } from "@tanstack/react-router"
import Logo from "../../../assets/logo.svg?react"
import { css } from "../../../styles/styled-system/css"

export function BrandLink() {
	const routeContext = useRouteContext({ from: "__root__" })
	const { user } = routeContext
	return (
		<Link
			to={user ? "/dashboard" : "/"}
			className={css({
				color: "neutral.900",
				textDecoration: "none",
				fontWeight: "bold",
				fontSize: "xl",
				lineHeight: "tight",
				display: "flex",
				alignItems: "center",
				gap: "sm",
			})}
		>
			<Logo width={32} height={32} />
			<span>Urban Fabric</span>
		</Link>
	)
}
