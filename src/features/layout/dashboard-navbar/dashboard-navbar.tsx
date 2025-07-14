import { css } from "../../../../styled-system/css"
import { BrandLink, Flex, Icon } from "../../ui"

export function DashboardNavbar() {
	return (
		<Flex
			as="header"
			shrink={"0"}
			align="center"
			justify="between"
			className={css({
				height: "64px",
				px: "lg",
				borderBottom: "1px solid",
				borderColor: "neutral.200",
				bg: "neutral.0",
			})}
		>
			<BrandLink />
			<Flex align="center" gap="md">
				<Icon name="Bell" size={20} />
				<Icon name="Gear" size={20} />
			</Flex>
		</Flex>
	)
}
