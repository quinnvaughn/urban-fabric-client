import { Ellipsis, SquarePen, Trash } from "lucide-react"
import { Button, Menu } from "#/features/ui"

type Props = {
	onEdit?: () => void
	onDelete?: () => void
}

export function CommentActions({ onEdit, onDelete }: Props) {
	return (
		<Menu placement="bottom-end">
			<Menu.Trigger>
				<Button
					size="xs"
					appearance="ghost"
					intent="neutral"
					startIcon={<Ellipsis size={14} />}
				/>
			</Menu.Trigger>
			<Menu.Content>
				<Menu.Item icon={<SquarePen size={12} />} onClick={onEdit}>
					Edit
				</Menu.Item>
				<Menu.Item intent="danger" icon={<Trash size={12} />} onClick={onDelete}>
					Delete
				</Menu.Item>
			</Menu.Content>
		</Menu>
	)
}
