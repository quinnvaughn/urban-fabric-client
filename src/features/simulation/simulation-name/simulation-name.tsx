import { useMutation } from "@apollo/client/index.js"
import { useNavigate, useParams } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { z } from "zod"
import { useSimulationMapContext } from "../../../context"

import { UpdateSimulationDocument } from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { useForm } from "../../../lib"
import { css } from "../../../styles/styled-system/css"

const schema = z.object({
	name: z.string().min(1, "Name can’t be empty"),
})

export function SimulationName() {
	const { simulation, isEditing } = useSimulationMapContext()
	const [updateSimulation] = useMutation(UpdateSimulationDocument)
	const { addToast } = useToast()
	const navigate = useNavigate()
	const { simulationId } = useParams({
		from: "/_auth/dashboard/simulation/$simulationId",
	})

	const form = useForm({
		schema,
		defaultValues: { name: simulation.name },
		onSubmit: async ({ name }, { setFormError, reset }) => {
			try {
				const { data } = await updateSimulation({
					variables: { input: { id: simulationId, name } },
				})
				match(data?.updateSimulation)
					.with({ __typename: "Simulation" }, () => {
						reset({ name }) // sync form’s initial back to updated
						document.title = `${name} – Urban Fabric`
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
					.otherwise(() => {
						addToast({
							message: "Failed to update simulation name",
							intent: "danger",
						})
					})
			} catch (err: any) {
				setFormError(err.message || "Network error", 3000)
			}
		},
	})

	const inputStyles = css({
		p: "xs",
		textStyle: "md",
		width: "190px",
		textOverflow: "ellipsis",
		overflow: "hidden",
		whiteSpace: "nowrap",
		outlineColor: "secondary",
	})

	if (!isEditing) {
		return (
			<span className={inputStyles} title={simulation.name}>
				{simulation.name}
			</span>
		)
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				form.handleSubmit()
			}}
		>
			<form.Field name="name">
				{({ value, onChange, onBlur, meta }) => (
					<>
						<input
							value={value}
							onChange={onChange}
							onBlur={() => {
								onBlur()
								if (!meta.error) form.handleSubmit()
							}}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									e.preventDefault()
									form.reset() // revert to initial
									e.currentTarget.blur()
								}
								if (e.key === "Enter") {
									e.preventDefault()
									form.handleSubmit()
									e.currentTarget.blur()
								}
							}}
							className={inputStyles}
						/>
					</>
				)}
			</form.Field>
		</form>
	)
}
