import { DropdownMenu, Tooltip } from "../../ui"

type Props = {
	onRename: () => void
	onDelete: () => void
	onClearLayers: () => void
	isLastScenario?: boolean
}
export function ScenarioMenu({
	onRename,
	onDelete,
	onClearLayers,
	isLastScenario,
}: Props) {
	return (
		<>
			<DropdownMenu.Item onSelect={onRename} closeOnSelect={false}>
				Rename
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<Tooltip placement="right">
				<Tooltip.Trigger>
					<DropdownMenu.Item
						onSelect={onDelete}
						closeOnSelect={false}
						disabled={isLastScenario}
					>
						Delete
					</DropdownMenu.Item>
				</Tooltip.Trigger>
				{isLastScenario && (
					<Tooltip.Content>
						You cannot delete the last scenario.
					</Tooltip.Content>
				)}
			</Tooltip>
			<DropdownMenu.Item onSelect={onClearLayers} closeOnSelect={false}>
				Clear Layers
			</DropdownMenu.Item>
		</>
	)
}
