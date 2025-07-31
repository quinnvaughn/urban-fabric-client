import { useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { DeleteSimulationDocument } from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { Button } from "../../ui"
import { Dialog } from "../../ui/dialog"

type Props = {
	simulation: { id: string; name: string; description: string | null }
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function DeleteSimulationDialog({
	simulation,
	open,
	onOpenChange,
}: Props) {
	const [deleteSimulation] = useMutation(DeleteSimulationDocument)
	const { addToast } = useToast()
	const navigate = useNavigate()
	async function handleDeleteSimulation() {
		const id = simulation.id
		await deleteSimulation({
			variables: {
				input: {
					id,
				},
			},
			update(cache, { data }) {
				if (data?.deleteSimulation.__typename === "DeleteSimulationResponse") {
					cache.evict({
						id: cache.identify({
							id,
							__typename: "Simulation",
						}),
					})
					cache.modify({
						id: cache.identify({
							__typename: "User",
							id,
						}),
						fields: {
							simulations(existingSimulations = []) {
								return existingSimulations.filter(
									(simulation) => simulation.id !== id,
								)
							},
						},
					})
					onOpenChange(false)
					addToast({
						message: "Simulation deleted successfully",
						intent: "success",
					})
					navigate({ to: "/dashboard" })
				}
			},
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Delete Simulation</Dialog.Title>
					<Dialog.Description>
						Are you sure you want to delete this simulation? This action cannot
						be undone.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Button
						variant="ghost"
						intent="tertiary"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button intent="danger" onClick={handleDeleteSimulation}>
						Delete
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog>
	)
}
