import { Link, useRouteContext } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { css } from "../../../../styled-system/css"
import { AppLink, Container, Flex, LinkButton } from "../../ui"
import { LogoutButton } from "./logout-button"

export function PublicNavbar() {
	const { user } = useRouteContext({ from: "__root__" })
	return (
		<Container
			maxWidth={"full"}
			as="header"
			className={css({
				py: "sm",
				px: "md",
				borderBottom: "1px solid",
				borderBottomColor: "neutral.200",
			})}
		>
			<Flex align="center" justify="between">
				<Link
					to="/"
					className={css({
						color: "primary",
						textDecoration: "none",
						fontWeight: "bold",
						fontSize: "xl",
					})}
				>
					Urban Fabric
				</Link>
				{match(user)
					.with(null, () => (
						<Flex gap="md" align="center" as="nav">
							<AppLink to="/login" variant="text">
								Login
							</AppLink>
							<LinkButton to={"/register"} variant={"ghost"} intent="primary">
								Sign Up
							</LinkButton>
						</Flex>
					))
					.otherwise(() => (
						<Flex gap="md" align="center" as="nav">
							<AppLink to="/profile">Profile</AppLink>
							<LogoutButton />
						</Flex>
					))}
			</Flex>
		</Container>
	)
}
