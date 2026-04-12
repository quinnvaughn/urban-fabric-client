import { Link } from "@tanstack/react-router"
import { Avatar, HStack } from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"

type Props = {
	name: string
	username: string
}

export function ProposalPanelAuthor({ name, username }: Props) {
	const { user: me } = useCurrentUser()
	return (
		<HStack align="center" gap="2" wrap>
			<Avatar size="xs" name={name} />
			<Link
				to={me?.id ? "/dashboard/user/$username" : "/user/$username"}
				params={{ username }}
				className={css({
					fontSize: "sm",
					color: "stone.700",
					fontWeight: "medium",
					_hover: {
						color: "brand.default",
						textDecoration: "underline",
					},
				})}
			>
				{name}
			</Link>
		</HStack>
	)
}
