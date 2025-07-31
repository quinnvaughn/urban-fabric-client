import { DropdownMenu } from "../../ui"
import { IconButton } from "../../ui/icon-button"

type Props = {
	onEdit: (e: React.MouseEvent) => void
	onDelete: (e: React.MouseEvent) => void
}

export function SimulationDropdownMenu({ onEdit, onDelete }: Props) {
	return (
		<DropdownMenu placement="bottom-end">
			<DropdownMenu.Trigger asChild>
				<IconButton name="DotsThreeVertical" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item onSelect={onEdit}>Rename</DropdownMenu.Item>
				<DropdownMenu.Item onSelect={onDelete}>Delete</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu>
	)
}
