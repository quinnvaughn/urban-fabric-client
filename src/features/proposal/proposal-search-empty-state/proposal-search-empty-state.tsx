import { Layers, Plus } from "lucide-react"
import { EmptyState } from "#/features/ui"

export function ProposalSearchEmptyState() {
	return (
		<EmptyState
			icon={Layers}
			title="Nothing here yet."
			description="Every redesign starts somewhere. Why not make this one yours?"
			actionIcon={Plus}
			actionLabel="Start a fabric"
			actionTo="/fabric/new"
		/>
	)
}
