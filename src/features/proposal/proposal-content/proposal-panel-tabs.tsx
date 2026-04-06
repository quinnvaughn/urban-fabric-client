import { Badge, HStack, Tabs } from "#/features/ui"

type Props = {
	activeTab: "about" | "comments"
	onValueChange: (tab: "about" | "comments") => void
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
			onValueChange={(value) => onValueChange(value as "about" | "comments")}
		>
			<Tabs.List>
				<Tabs.Trigger value="about">About</Tabs.Trigger>
				<Tabs.Trigger value="comments">
					<HStack gap="1" align="center">
						<span>Comments</span>
						{typeof commentCount === "number" && (
							<Badge
								size="xxs"
								tone={activeTab === "comments" ? "brand" : "neutral"}
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
