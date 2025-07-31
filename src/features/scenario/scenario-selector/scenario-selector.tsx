import { useNavigate, useParams } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import type { SimulationScenarioFragment } from "../../../graphql/generated"
import { css } from "../../../styles/styled-system/css"
import { DropdownMenu, Flex, Icon } from "../../ui"
import { DeleteScenario } from "../delete-scenario"
import { RenameScenario } from "../rename-scenario"
import { ScenarioMenu } from "../scenario-menu"

type Props = {
	scenario: SimulationScenarioFragment
}

type Modes = "closed" | "menu" | "rename" | "clear-layers" | "delete"

export function ScenarioSelector({ scenario }: Props) {
	const { setJustCreatedScenarioId, justCreatedScenarioId, simulation } =
		useSimulationMapContext()
	const [mode, setMode] = useState<Modes>("closed")
	const { scenarioId, simulationId } = useParams({
		from: "/_auth/dashboard/simulation/$simulationId/scenario/$scenarioId",
	})
	const navigate = useNavigate()

	useEffect(() => {
		if (scenario.id === justCreatedScenarioId && scenario.id === scenarioId) {
			setMode("rename")
			setJustCreatedScenarioId(null) // clear it so it’s one-shot
		}
	}, [justCreatedScenarioId, scenario.id, scenarioId])

	const isActive = scenario.id === scenarioId

	function handleSingleButtonClick() {
		if (scenario.id !== scenarioId) {
			navigate({
				to: "/dashboard/simulation/$simulationId/scenario/$scenarioId",
				params: { simulationId, scenarioId: scenario.id },
			})
			setMode("closed")
			return
		} else {
			setMode((prev) => (prev === "closed" ? "menu" : "closed"))
		}
	}

	function handleDoubleClick() {
		// Enter rename mode
		setMode("rename")
	}

	const dropdownOpen =
		mode === "menu" ||
		mode === "delete" ||
		mode === "clear-layers" ||
		mode === "rename"

	return (
		<DropdownMenu
			placement="bottom-start"
			open={dropdownOpen}
			onOpenChange={(next) => setMode(next ? "menu" : "closed")}
		>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					onClick={(e) => {
						if (e.detail === 1) {
							handleSingleButtonClick()
						} else if (e.detail === 2) {
							handleDoubleClick()
						}
					}}
					className={css({
						borderRadius: "md",
						backgroundColor: isActive ? "neutral.200" : "transparent",
						_hover: {
							backgroundColor: !isActive ? "neutral.100" : "neutral.200",
							cursor: "pointer",
						},
						height: "100%",
						py: "sm",
						px: "sm",
					})}
				>
					<Flex align="center" gap="xs">
						<span>{scenario.name}</span>
						<Icon name="CaretDown" size={16} />
					</Flex>
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{match(mode)
					.with("menu", () => (
						<ScenarioMenu
							onRename={() => setMode("rename")}
							onDelete={() => setMode("delete")}
							onClearLayers={() => setMode("clear-layers")}
							isLastScenario={simulation.scenarios.length === 1}
						/>
					))
					.with("rename", () => (
						<RenameScenario
							id={scenario.id}
							name={scenario.name}
							simulationId={simulationId}
							onClose={() => setMode("closed")}
						/>
					))
					.with("delete", () => (
						<DeleteScenario
							id={scenario.id}
							onClose={() => setMode("closed")}
						/>
					))
					.with("clear-layers", () => (
						<DropdownMenu.Item>Clear Layers Mode</DropdownMenu.Item>
					))
					.otherwise(() => null)}
			</DropdownMenu.Content>
		</DropdownMenu>
	)
}
