import { useState } from "react"
import { css } from "../../../styles/styled-system/css"
import { BrandLink, Button, ContextMenu, Flex, Icon } from "../../ui"

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
				<ContextMenu placement="bottom-start">
					<ContextMenu.Trigger asChild>
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
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Item>Edit name</ContextMenu.Item>
						<ContextMenu.Separator />
						<ContextMenu.Item>Edit description</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu>
			</Flex>
			<Button variant="ghost" size="sm">
				Share
			</Button>
		</Flex>
	)
}
