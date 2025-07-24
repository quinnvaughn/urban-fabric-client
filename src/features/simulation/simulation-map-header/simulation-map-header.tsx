import { useSimulationMapContext } from "../../../context"
import { useKeyBindings, useLogout } from "../../../hooks"
import { css } from "../../../styles/styled-system/css"
import { ScenarioSelector } from "../../scenario"
import { Button, DropdownMenu, Flex, Icon } from "../../ui"
import { SimulationName } from "../simulation-name"

export function SimulationMapHeader() {
	const logout = useLogout()
	const { isEditing, toggleEditing, toggleScenarioMenu } =
		useSimulationMapContext()

	useKeyBindings([{ key: "E", shift: true, handler: toggleEditing }])

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
				py: "sm",
				px: "md",
				bg: "neutral.0",
			})}
			gap="md"
		>
			<Flex align="center" gap="sm">
				<DropdownMenu placement="bottom-start">
					<DropdownMenu.Trigger asChild>
						<button
							type="button"
							className={css({
								display: "flex",
								alignItems: "center",
								gap: "xs",
								cursor: "pointer",
							})}
						>
							<span className={css({ color: "neutral.900", textStyle: "lg" })}>
								Urban Fabric
							</span>
							<Icon name="CaretDown" size={16} color={"neutral.900"} />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Link to="/dashboard">Home</DropdownMenu.Link>
						<DropdownMenu.Separator />
						<DropdownMenu.Item onSelect={toggleEditing}>
							{isEditing ? "Done editing" : "Edit scenario"}
							<DropdownMenu.Shortcut>⇧&thinsp;E</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={toggleScenarioMenu}>
							View scenarios
							<DropdownMenu.Shortcut>⇧&thinsp;S</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item onSelect={async () => await logout()}>
							Logout
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu>
				<SimulationName />
				<ScenarioSelector />
			</Flex>
			<Flex gap="sm">
				<Button variant="ghost" intent="secondary" size="sm">
					Publish
				</Button>
				<Button variant="solid" size="sm" onClick={toggleEditing}>
					{isEditing ? "Done" : "Edit Scenario"}
				</Button>
			</Flex>
		</Flex>
	)
}
