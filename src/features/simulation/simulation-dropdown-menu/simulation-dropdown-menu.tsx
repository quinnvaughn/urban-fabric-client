import { useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { DeleteSimulationDocument } from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { DropdownMenu } from "../../ui"
import { IconButton } from "../../ui/icon-button"

type Props = {
	id: string // Simulation ID to delete
}

export function SimulationDropdownMenu({ id }: Props) {
	const [deleteSimulation] = useMutation(DeleteSimulationDocument)
	const navigate = useNavigate()
	const { addToast } = useToast()

	async function handleDelete() {
		try {
			const result = await deleteSimulation({
				variables: { input: { id } },
				update: (cache) => {
					cache.evict({ id: `Simulation:${id}` })
				},
			})
			match(result.data?.deleteSimulation)
				.with(
					{ __typename: "ForbiddenError" },
					{ __typename: "NotFoundError" },
					(error) => {
						addToast({ message: error.message, intent: "danger" })
					},
				)
				.with({ __typename: "UnauthorizedError" }, () => {
					// redirect to login
					navigate({ to: "/login", replace: true })
				})
				.with({ __typename: "DeleteSimulationResponse" }, () => {
					addToast({
						message: "Simulation deleted successfully",
						intent: "success",
					})
				})
				.otherwise(() => {
					addToast({ message: "Failed to delete simulation", intent: "danger" })
				})
		} catch {
			addToast({ message: "Error deleting simulation", intent: "danger" })
		}
	}

	return (
		<DropdownMenu placement="bottom-end">
			<DropdownMenu.Trigger asChild>
				<IconButton icon="DotsThreeVertical" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item onSelect={() => console.log("Rename")}>
					Rename
				</DropdownMenu.Item>
				<DropdownMenu.Item onSelect={handleDelete}>Delete</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu>
	)
}
