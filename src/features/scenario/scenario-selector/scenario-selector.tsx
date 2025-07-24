import { useSimulationMapContext } from "../../../context"
import { useKeyBindings } from "../../../hooks"
import { Button, DropdownMenu, Flex, Icon } from "../../ui"

export function ScenarioSelector() {
	const {
		selectedScenario,
		isScenarioMenuOpen,
		setScenarioMenuOpen,
		simulation,
	} = useSimulationMapContext()

	useKeyBindings([
		{
			key: "S",
			shift: true,
			handler: () => setScenarioMenuOpen((prev) => !prev),
		},
	])

	return (
		<DropdownMenu
			open={isScenarioMenuOpen}
			onOpenChange={(next) => setScenarioMenuOpen(next)}
		>
			<DropdownMenu.Trigger asChild>
				<Button variant="ghost" intent="tertiary" size="md">
					<Flex align="center" gap="xs">
						<span>{selectedScenario.name}</span>
						<Icon name="CaretDown" size={16} />
					</Flex>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{simulation.scenarios.map((scenario) => (
					<DropdownMenu.Link
						to={"/dashboard/simulation/$simulationId/scenario/$scenarioId"}
						params={{ scenarioId: scenario.id, simulationId: simulation.id }}
						key={scenario.id}
					>
						{scenario.name}
					</DropdownMenu.Link>
				))}
			</DropdownMenu.Content>
		</DropdownMenu>
	)
}
