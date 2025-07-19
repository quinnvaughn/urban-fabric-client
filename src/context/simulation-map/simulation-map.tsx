import { createContext, useContext, useState } from "react"
import { useKeyBindings } from "../../hooks"

type SimulationMapContext = {
	isInEditMode: boolean
	toggleEditMode: () => void
}

const SimulationMapContext = createContext<SimulationMapContext | undefined>(
	undefined,
)

export function useSimulationMapContext() {
	const context = useContext(SimulationMapContext)
	if (!context) {
		throw new Error(
			"useSimulationMapContext must be used within a SimulationMapProvider",
		)
	}
	return context
}
export function SimulationMapProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [isInEditMode, setIsInEditMode] = useState(false)

	const toggleEditMode = () => {
		setIsInEditMode((prev) => !prev)
	}

	useKeyBindings([
		{ key: "E", shift: true, handler: toggleEditMode },
		{ key: "S", shift: true, handler: () => console.log("Save simulation") },
	])

	return (
		<SimulationMapContext.Provider value={{ isInEditMode, toggleEditMode }}>
			{children}
		</SimulationMapContext.Provider>
	)
}
