import { NudgeCard } from "#/features/ui"
import { openModal } from "#/stores"

interface GettingStartedNudgeProps {
	show: boolean
	onDismiss: () => void
}

export function GettingStartedNudge({ show, onDismiss }: GettingStartedNudgeProps) {
	if (!show) return null

	return (
		<NudgeCard
			title="New to Urban Fabric?"
			description="Learn how to draw elements, publish proposals, and share your ideas."
			primaryAction={{
				label: "Get started",
				onClick: () => {
					onDismiss()
					openModal("gettingStarted")
				},
			}}
			secondaryAction={{
				label: "Skip for now",
				onClick: onDismiss,
			}}
			onDismiss={onDismiss}
		/>
	)
}
