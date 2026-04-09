import { Badge, HStack, Tabs } from "#/features/ui"
import { ProposalPanelTab } from "../proposal-store"

type Props = {
	activeTab: ProposalPanelTab
	onValueChange: (tab: ProposalPanelTab) => void
	commentCount?: number
}

export function ProposalPanelTabs({
	activeTab,
	onValueChange,
	commentCount,
}: Props) {
	return (
		<Tabs
			stretch
			value={activeTab}
			onValueChange={(value) => onValueChange(value as ProposalPanelTab)}
		>
			<Tabs.List>
				<Tabs.Trigger value={ProposalPanelTab.About}>About</Tabs.Trigger>
				<Tabs.Trigger value={ProposalPanelTab.Layers}>Layers</Tabs.Trigger>
				<Tabs.Trigger value={ProposalPanelTab.Comments}>
					<HStack gap="1" align="center">
						<span>Comments</span>
						{typeof commentCount === "number" && (
							<Badge
								size="xxs"
								tone={
									activeTab === ProposalPanelTab.Comments ? "brand" : "neutral"
								}
							>
								{commentCount}
							</Badge>
						)}
					</HStack>
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs>
	)
}
