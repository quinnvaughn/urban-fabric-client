import { useMutation } from "@apollo/client/index.js"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { match } from "ts-pattern"
import {
	CreateSimulationDocument,
	UserSimulationsDocument,
} from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { Route as DashboardRoute } from "../../../routes/_auth/dashboard/_shell/index"
import { css } from "../../../styles/styled-system/css"
import { AppLink, Button, Flex, Typography } from "../../ui"

type NavItem = {
	label: string
	to: string
}

const navItems: NavItem[] = [
	{
		label: "Simulations",
		to: DashboardRoute.to,
	},
]

export function DashboardSidebar() {
	const [createCanvas] = useMutation(CreateSimulationDocument)
	const navigate = useNavigate()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { addToast } = useToast()

	async function handleCreateSimulation() {
		setIsSubmitting(true)
		try {
			const result = await createCanvas({
				variables: { input: { name: "Untitled Simulation" } },
				refetchQueries: [{ query: UserSimulationsDocument }],
			})
			match(result.data?.createSimulation)
				.with({ __typename: "Simulation" }, (simulation) => {
					navigate({
						to: "/dashboard/simulation/$simulationId",
						params: { simulationId: simulation.id },
					})
				})
				.otherwise(() => {
					// we get an unauthorized error if the user is not logged in
					navigate({ to: "/login", replace: true })
				})
		} catch {
			addToast({ message: "Failed to create simulation", intent: "danger" })
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Flex
			as="aside"
			direction={"column"}
			className={css({
				p: "lg",
				width: "240px",
				borderRight: "1px solid",
				borderRightColor: "neutral.200",
				height: "100%",
				overflowY: "auto",
				bg: "neutral.0",
				gap: "md",
			})}
		>
			<Typography.Heading level={4}>Menu</Typography.Heading>
			<Flex direction="column" as="nav" flex="full">
				<Flex direction="column" gap="sm" flex="auto">
					{navItems.map((item) => (
						<AppLink
							key={item.to}
							to={item.to}
							className={css({
								px: "sm",
								py: "xs",
								borderRadius: "md",
								_hover: { bg: "neutral.100" },
							})}
							activeProps={{
								className: css({
									fontWeight: "bold",
									bg: "neutral.100",
									textDecoration: "none",
								}),
							}}
						>
							{item.label}
						</AppLink>
					))}
				</Flex>
				<Button
					variant="solid"
					intent="primary"
					disabled={isSubmitting}
					onClick={handleCreateSimulation}
				>
					+ Create Simulation
				</Button>
			</Flex>
		</Flex>
	)
}
