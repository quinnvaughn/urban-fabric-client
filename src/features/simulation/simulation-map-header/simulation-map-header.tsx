import { css } from "../../../styles/styled-system/css"
import { BrandLink, Button, DropdownMenu, Flex, Icon } from "../../ui"

type Props = {
	name: string
	id: string
}

export function SimulationMapHeader({ name, id }: Props) {
	return (
		<Flex
			as="header"
			justify="between"
			align={"center"}
			className={css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				p: "sm",
				bg: "neutral.0",
			})}
			gap="md"
		>
			<Flex align="center" gap="sm">
				<BrandLink />
				<DropdownMenu placement="bottom-start">
					<DropdownMenu.Trigger asChild>
						<button
							type="button"
							className={css({
								display: "flex",
								alignItems: "center",
								gap: "xs",
								fontSize: "md",
								cursor: "pointer",
							})}
						>
							<span>{name}</span>
							<Icon name="CaretDown" size={16} />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item>Edit name</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>Edit description</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu>
			</Flex>
			<Button variant="ghost" size="sm">
				Share
			</Button>
		</Flex>
	)
}
