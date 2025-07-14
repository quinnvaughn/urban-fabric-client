import { css } from "../../../../styled-system/css"
import { AppLink, Flex, Typography } from "../../ui"

const navItems = [
	{
		label: "Projects",
		href: "/dashboard",
	},
]

export function DashboardSidebar() {
	return (
		<Flex
			as="aside"
			direction={"column"}
			className={css({
				p: "lg",
				width: "240px",
				borderRight: "1px solid",
				borderRightColor: "neutral.200",
				height: "100%",
				overflowY: "auto",
				bg: "neutral.0",
				gap: "md",
			})}
		>
			<Typography.Heading level={4}>Menu</Typography.Heading>
			<Flex direction="column" gap="sm" as="nav">
				{navItems.map((item) => (
					<AppLink
						key={item.href}
						to={item.href}
						className={css({
							px: "sm",
							py: "xs",
							borderRadius: "md",
							_hover: { bg: "neutral.100" },
						})}
						activeProps={{
							className: css({
								fontWeight: "bold",
								bg: "neutral.100",
								textDecoration: "none",
							}),
						}}
					>
						{item.label}
					</AppLink>
				))}
			</Flex>
		</Flex>
	)
}
