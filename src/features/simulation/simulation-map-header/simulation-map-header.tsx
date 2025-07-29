import { Link } from "@tanstack/react-router"
import Logo from "../../../assets/logo.svg?react"
import { useSimulationMapContext } from "../../../context"
import { useLogout } from "../../../hooks"
import { css } from "../../../styles/styled-system/css"
import { ScenarioNav } from "../../scenario"
import { Button, DropdownMenu, Flex, Icon, Typography } from "../../ui"
import { IconButton } from "../../ui/icon-button"

export function SimulationMapHeader() {
	const logout = useLogout()
	const { simulation, setActiveOverlay } = useSimulationMapContext()
	return (
		<div
			className={css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				bg: "neutral.0",
			})}
		>
			<Flex
				as="header"
				justify="between"
				align={"center"}
				gap="md"
				className={css({
					borderBottom: "1px solid",
					borderColor: "neutral.200",
					py: "sm",
					px: "md",
				})}
			>
				<Flex align="center" gap="sm">
					<Link to="/dashboard">
						<Logo width={32} height={32} />
					</Link>
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
								<span
									className={css({ color: "neutral.900", textStyle: "lg" })}
								>
									{simulation.name}
								</span>
								<Icon name="CaretDown" size={16} color={"neutral.900"} />
							</button>
						</DropdownMenu.Trigger>
						<DropdownMenu placement="bottom-start">
							<DropdownMenu.Trigger asChild>
								<IconButton name="Info" size={16} />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<div
									className={css({
										p: "sm",
									})}
								>
									<Typography.Text color="muted" textStyle="xs">
										{simulation.description || "No description available."}
									</Typography.Text>
								</div>
							</DropdownMenu.Content>
						</DropdownMenu>
						<DropdownMenu.Content>
							<DropdownMenu.Item onSelect={() => setActiveOverlay("details")}>
								Edit Details
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item onSelect={() => setActiveOverlay("delete")}>
								Delete Simulation
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={async () => await logout()}>
								Logout
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu>
				</Flex>
				<Flex gap="sm">
					<Button variant="outline" intent="secondary" size="sm">
						<Flex align="center" gap="xs">
							<Icon name="Play" size={16} weight="fill" />
							<span>Run Simulation</span>
						</Flex>
					</Button>
					<Button variant="solid" intent="primary" size="sm">
						Publish
					</Button>
				</Flex>
			</Flex>
			<ScenarioNav />
		</div>
	)
}
