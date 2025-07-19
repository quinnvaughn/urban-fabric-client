import { Link, useRouteContext } from "@tanstack/react-router"
import { css } from "../../../styles/styled-system/css"

export function BrandLink() {
	const routeContext = useRouteContext({ from: "__root__" })
	const { user } = routeContext
	return (
		<Link
			to={user ? "/dashboard" : "/"}
			className={css({
				color: "primary",
				textDecoration: "none",
				fontWeight: "bold",
				fontSize: "xl",
				lineHeight: "tight",
			})}
		>
			Urban Fabric
		</Link>
	)
}
