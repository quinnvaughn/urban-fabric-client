import { useMutation } from "@apollo/client/index.js"
import { useNavigate, useParams } from "@tanstack/react-router"
import { match } from "ts-pattern"
import z from "zod"
import { useSimulationMapContext } from "../../../context"
import { UpdateSimulationDocument } from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { useForm } from "../../../lib"
import { css } from "../../../styles/styled-system/css"
import { Button, Flex, Input, Sheet, Textarea } from "../../ui"

const schema = z.object({
	name: z.string().min(1, "Name can’t be empty"),
	description: z.string().optional(),
})

export function EditDetailsSheet() {
	const { simulation, activeOverlay, setActiveOverlay } =
		useSimulationMapContext()
	const [updateSimulation] = useMutation(UpdateSimulationDocument)
	const { addToast } = useToast()
	const navigate = useNavigate()
	const { simulationId } = useParams({
		from: "/_auth/dashboard/simulation/$simulationId",
	})

	const form = useForm({
		defaultValues: {
			name: simulation.name,
			description: simulation.description ?? "",
		},
		schema,
		onSubmit: async (
			{ name, description },
			{ setFormError, reset, setError },
		) => {
			try {
				const { data } = await updateSimulation({
					variables: { input: { id: simulationId, name, description } },
				})
				match(data?.updateSimulation)
					.with({ __typename: "Simulation" }, () => {
						reset({ name, description }) // sync form’s initial back to updated
						document.title = `${name} – Urban Fabric`
						setActiveOverlay(null)
					})
					.with({ __typename: "UnauthorizedError" }, () => {
						navigate({ to: "/login", replace: true })
					})
					.with(
						{ __typename: "NotFoundError" },
						{ __typename: "ForbiddenError" },
						(err) => {
							addToast({ message: err.message, intent: "danger" })
						},
					)
					.with({ __typename: "ValidationError" }, ({ errors }) => {
						for (const error of errors ?? []) {
							setError(error.field as keyof typeof form.values, error.message)
						}
					})
					.otherwise(() => {
						setFormError("Failed to update simulation", 3000)
					})
			} catch (err: any) {
				setFormError(err.message || "Network error", 3000)
			}
		},
	})

	return (
		<Sheet
			open={activeOverlay === "details"}
			onOpenChange={() => setActiveOverlay(null)}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					form.handleSubmit()
				}}
			>
				<Sheet.Content>
					<Sheet.Header>
						<Sheet.Title>Edit Simulation Details</Sheet.Title>
						<Sheet.Description>
							Here you can edit the details of your simulation.
						</Sheet.Description>
					</Sheet.Header>
					<Flex
						direction="column"
						gap="md"
						className={css({ px: "md", flex: 1 })}
					>
						<form.Field name="name">
							{(field) => (
								<Input
									placeholder="Simulation Name"
									error={field.meta.error}
									label="Name"
									{...field}
								/>
							)}
						</form.Field>
						<form.Field name="description">
							{(field) => (
								<Textarea
									placeholder="Simulation Description"
									error={field.meta.error}
									label="Description"
									{...field}
									value={field.value ?? ""}
								/>
							)}
						</form.Field>
					</Flex>
					<Sheet.Footer>
						<Flex gap="sm" direction="column">
							<form.Subscribe
								selector={(state) => [
									state.meta.isSubmitting,
									state.meta.canSubmit,
								]}
							>
								{([isSubmitting, canSubmit]) => (
									<Button
										type="submit"
										intent="secondary"
										disabled={isSubmitting || !canSubmit}
									>
										Save Changes
									</Button>
								)}
							</form.Subscribe>
							<Button
								variant="ghost"
								intent="tertiary"
								onClick={() => setActiveOverlay(null)}
							>
								Cancel
							</Button>
						</Flex>
					</Sheet.Footer>
				</Sheet.Content>
			</form>
		</Sheet>
	)
}
