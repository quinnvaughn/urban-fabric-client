import { match } from "ts-pattern"
import { DeleteSimulationDialog } from "../delete-simulation-dialog"
import { SimulationDetailsForm } from "../simulation-details-form"

type OverlayType = "details" | "delete" | null

type Props = {
	open: OverlayType
	onOpenChange: (open: OverlayType) => void
	simulation: { id: string; name: string; description: string | null } | null
	showDescription?: boolean
}

export function SimulationOverlayRenderer({
	open,
	onOpenChange,
	simulation,
	showDescription,
}: Props) {
	return (
		simulation &&
		match(open)
			.with("details", () => (
				<SimulationDetailsForm
					simulation={simulation}
					open={open === "details"}
					onOpenChange={(isOpen) => onOpenChange(isOpen ? "details" : null)}
					showDescription={showDescription}
					header={{
						title: "Edit Simulation Details",
						description: "Here you can edit the details of your simulation.",
					}}
				/>
			))
			.with("delete", () => (
				<DeleteSimulationDialog
					simulation={simulation}
					open={open === "delete"}
					onOpenChange={(isOpen) => onOpenChange(isOpen ? "delete" : null)}
				/>
			))
			.otherwise(() => null)
	)
}
