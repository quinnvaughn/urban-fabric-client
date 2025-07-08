import { Link, useRouteContext } from "@tanstack/react-router"
import { css } from "../../../../styled-system/css"
import { AppLink, Container, Flex, LinkButton } from "../../ui"
import { LogoutButton } from "./logout-button"

type Props = {
	showAuthLinks?: boolean
}

export function Navbar({ showAuthLinks = true }: Props) {
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
				{showAuthLinks && !user && (
					<Flex gap="md" align="center" as="nav">
						<AppLink to="/login" variant="text">
							Login
						</AppLink>
						<LinkButton to={"/register"} variant={"ghost"} intent="primary">
							Sign Up
						</LinkButton>
					</Flex>
				)}
				{user && (
					<Flex gap="md" align="center" as="nav">
						<AppLink to="/profile">Profile</AppLink>
						<LogoutButton />
					</Flex>
				)}
			</Flex>
		</Container>
	)
}
