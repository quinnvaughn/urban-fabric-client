import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Box, HStack, Menu, Segmented } from "#/features/ui"
import { ProposalCategory } from "#/graphql/generated"
import { enumValueToReadableLabel } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/dashboard/proposals")({
	component: RouteComponent,
})

function RouteComponent() {
	const [selectedCategories, setSelectedCategories] = useState<
		ProposalCategory[]
	>([])
	const [selectedStatus, setSelectedStatus] = useState<
		"All" | "Published" | "Draft"
	>("All")

	const toggleCategory = (category: ProposalCategory) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		)
	}

	const handleStatusChange = (status: "All" | "Published" | "Draft") => {
		setSelectedStatus(status)
	}

	return (
		<div>
			<Box
				id="filter-bar"
				className={css({
					display: "flex",
					alignItems: "center",
					gap: "2.5",
					background: "white",
					border: "1px solid",
					borderColor: "stone.200",
					py: "2.5",
					px: "4",
					boxShadow: "sm",
					borderRadius: "lg",
				})}
			>
				<Segmented
					variant="pill"
					value={selectedStatus}
					onChange={(value) =>
						handleStatusChange(value as "All" | "Published" | "Draft")
					}
				>
					<HStack align="center" gap="2">
						<Segmented.Legend>Status</Segmented.Legend>
						<Segmented.Group>
							<Segmented.Option value="All">All</Segmented.Option>
							<Segmented.Option value="Open">Published</Segmented.Option>
							<Segmented.Option value="Closed">Draft</Segmented.Option>
						</Segmented.Group>
					</HStack>
				</Segmented>
				<Box
					className={css({
						width: "px",
						height: "18px",
						background: "stone.200",
						flexShrink: 0,
					})}
				/>
				<Menu placement="bottom-end">
					<Menu.FilterTrigger>Category</Menu.FilterTrigger>
					<Menu.Content>
						{Object.values(ProposalCategory).map((category) => (
							<Menu.CheckItem
								key={category}
								checked={selectedCategories.includes(category)}
								onCheckedChange={() => toggleCategory(category)}
							>
								{enumValueToReadableLabel(category)}
							</Menu.CheckItem>
						))}
					</Menu.Content>
				</Menu>
			</Box>
		</div>
	)
}
