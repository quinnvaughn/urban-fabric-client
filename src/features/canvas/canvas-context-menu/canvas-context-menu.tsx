import { useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { DeleteCanvasDocument } from "../../../graphql/generated"
import { ContextMenu } from "../../ui"
import { IconButton } from "../../ui/icon-button"

type Props = {
	id: string // Canvas ID to delete
}

export function CanvasContextMenu({ id }: Props) {
	const [deleteCanvas] = useMutation(DeleteCanvasDocument)
	const navigate = useNavigate()

	async function handleDelete() {
		try {
			const result = await deleteCanvas({
				variables: { input: { id } },
				update: (cache) => {
					cache.evict({ id: `Canvas:${id}` })
				},
			})
			console.log("Delete result:", result)
			match(result.data?.deleteCanvas)
				.with(
					{ __typename: "ForbiddenError" },
					{ __typename: "NotFoundError" },
					(error) => {
						// todo: toast for error.
						console.error("Error deleting canvas:", error.message)
					},
				)
				.with({ __typename: "UnauthorizedError" }, () => {
					// redirect to login
					navigate({ to: "/login", replace: true })
				})
				.with({ __typename: "DeleteCanvasResponse" }, () => {
					// todo: toast for success.
					console.log("Canvas deleted successfully")
				})
				.otherwise(() => {
					console.error("Unexpected response from deleteCanvas mutation")
				})
		} catch (error) {
			console.error("Error deleting canvas:", error)
		}
	}

	return (
		<ContextMenu placement="bottom-end">
			<ContextMenu.Trigger asChild>
				<IconButton icon="DotsThreeVertical" />
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item onSelect={() => console.log("Rename")}>
					Rename
				</ContextMenu.Item>
				<ContextMenu.Item onSelect={handleDelete}>Delete</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu>
	)
}
