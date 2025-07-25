import { DropdownMenu } from "../../ui"

type Props = {
	onRename: () => void
	onDelete: () => void
	onClearLayers: () => void
}
export function ScenarioMenu({ onRename, onDelete, onClearLayers }: Props) {
	return (
		<>
			<DropdownMenu.Item onSelect={onRename} closeOnSelect={false}>
				Rename
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onSelect={onDelete} closeOnSelect={false}>
				Delete
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={onClearLayers} closeOnSelect={false}>
				Clear Layers
			</DropdownMenu.Item>
		</>
	)
}
