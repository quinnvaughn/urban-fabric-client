import { createContext, useContext } from "react"

type SimulationMapContext = {}

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
	return (
		<SimulationMapContext.Provider value={{}}>
			{children}
		</SimulationMapContext.Provider>
	)
}
