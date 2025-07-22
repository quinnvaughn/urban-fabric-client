import { useMutation } from "@apollo/client"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useRef } from "react"
import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import { UpdateSimulationDocument } from "../../../graphql/generated"
import { useToast } from "../../../hooks"
import { css, cx } from "../../../styles/styled-system/css"

export function SimulationName() {
	const { isEditing, name, setName } = useSimulationMapContext()
	const [updateSimulation] = useMutation(UpdateSimulationDocument)
	const { simulationId } = useParams({
		from: "/_auth/dashboard/simulation/$simulationId",
	})
	const navigate = useNavigate()
	const { addToast } = useToast()
	const ref = useRef<HTMLInputElement>(null)

	async function handleNameChange(newName: string) {
		setName(newName)
		const result = await updateSimulation({
			variables: { input: { id: simulationId, name: newName } },
		})

		match(result.data?.updateSimulation)
			.with({ __typename: "Simulation" }, () => {
				ref.current?.blur()
			})
			.with({ __typename: "UnauthorizedError" }, () => {
				// navigate to login
				navigate({ to: "/login", replace: true })
			})
			.with(
				{ __typename: "NotFoundError" },
				{ __typename: "ForbiddenError" },
				(error) => {
					addToast({ message: error.message, intent: "danger" })
				},
			)
			.otherwise(() => {
				addToast({
					message: "Failed to update simulation name",
					intent: "danger",
				})
			})
	}

	const styles = css({
		p: "xs",
		textStyle: "md",
	})

	return isEditing ? (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				handleNameChange(name)
			}}
		>
			<input
				type="text"
				ref={ref}
				value={name}
				onChange={(e) => setName(e.target.value)}
				className={cx(styles, css({ outlineColor: "secondary" }))}
			/>
		</form>
	) : (
		<span className={styles}>{name}</span>
	)
}
