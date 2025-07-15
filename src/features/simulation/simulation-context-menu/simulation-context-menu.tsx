import { useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { DeleteSimulationDocument } from "../../../graphql/generated"
import { ContextMenu } from "../../ui"
import { IconButton } from "../../ui/icon-button"

type Props = {
	id: string // Simulation ID to delete
}

export function SimulationContextMenu({ id }: Props) {
	const [deleteSimulation] = useMutation(DeleteSimulationDocument)
	const navigate = useNavigate()

	async function handleDelete() {
		try {
			const result = await deleteSimulation({
				variables: { input: { id } },
				update: (cache) => {
					cache.evict({ id: `Simulation:${id}` })
				},
			})
			console.log("Delete result:", result)
			match(result.data?.deleteSimulation)
				.with(
					{ __typename: "ForbiddenError" },
					{ __typename: "NotFoundError" },
					(error) => {
						// todo: toast for error.
						console.error("Error deleting simulation:", error.message)
					},
				)
				.with({ __typename: "UnauthorizedError" }, () => {
					// redirect to login
					navigate({ to: "/login", replace: true })
				})
				.with({ __typename: "DeleteSimulationResponse" }, () => {
					// todo: toast for success.
					console.log("Simulation deleted successfully")
				})
				.otherwise(() => {
					console.error("Unexpected response from deleteSimulation mutation")
				})
		} catch (error) {
			console.error("Error deleting simulation:", error)
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
