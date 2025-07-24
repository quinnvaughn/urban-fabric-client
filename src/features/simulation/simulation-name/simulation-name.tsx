import { useMutation } from "@apollo/client/index.js"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
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

	const [localName, setLocalName] = useState(name)
	const escapePressed = useRef(false)

	// Sync localName with context name when edit mode starts or name changes externally
	useEffect(() => {
		if (isEditing) {
			setLocalName(name)
		}
	}, [isEditing, name])
	async function handleNameChange(newName: string) {
		setName(newName)
		const result = await updateSimulation({
			variables: { input: { id: simulationId, name: newName } },
		})

		match(result.data?.updateSimulation)
			.with({ __typename: "Simulation" }, () => {
				ref.current?.blur()
				document.title = `${newName} - Urban Fabric`
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

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Escape") {
			e.preventDefault()
			escapePressed.current = true
			setLocalName(name)
			ref.current?.blur()
		}
	}

	async function onBlur() {
		if (escapePressed.current) {
			escapePressed.current = false
			return
		}
		await handleNameChange(localName)
	}

	const styles = css({
		p: "xs",
		textStyle: "md",
		width: "190px",
		textOverflow: "ellipsis",
		overflow: "hidden",
		whiteSpace: "nowrap",
	})

	return isEditing ? (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				await handleNameChange(name)
			}}
		>
			<input
				type="text"
				ref={ref}
				value={localName}
				onKeyDown={onKeyDown}
				onChange={(e) => setLocalName(e.target.value)}
				onBlur={onBlur}
				className={cx(styles, css({ outlineColor: "secondary" }))}
			/>
		</form>
	) : (
		<span className={styles} title={name}>
			{name}
		</span>
	)
}
