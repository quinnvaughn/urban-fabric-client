import { useState } from "react"
import { match } from "ts-pattern"
import { useSimulationMapContext } from "../../../context"
import { css } from "../../../styles/styled-system/css"
import { Flex } from "../../ui"

type Props = {
	simulationName: string
}

export function SimulationMapHeader({
	simulationName: initialSimulationName,
}: Props) {
	const { isInEditMode } = useSimulationMapContext()
	const [simulationName, setSimulationName] = useState(initialSimulationName)

	function submitNameChange(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		// TODO: send the updated name to the server
	}

	return (
		<Flex
			as="header"
			justify={"between"}
			className={css({
				p: "md",
				bg: "neutral.0",
				borderBottom: "1px solid",
				borderColor: "neutral.200",
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
			})}
		>
			{match(isInEditMode)
				.with(true, () => (
					<form onSubmit={submitNameChange}>
						<input
							type="text"
							value={simulationName}
							onChange={(e) => setSimulationName(e.target.value)}
						/>
					</form>
				))
				.with(false, () => (
					<h1 className={css({ fontSize: "lg", fontWeight: "bold" })}>
						{simulationName}
					</h1>
				))
				.exhaustive()}
		</Flex>
	)
}
