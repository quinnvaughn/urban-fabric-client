import { useParams } from "@tanstack/react-router"
import { createContext, useContext, useMemo, useState } from "react"
import type {
	AllCategoriesFragment,
	SelectedTemplateFragment,
	SimulationInfoFragment,
	SimulationScenarioFragment,
} from "../../graphql/generated"
import type { PropertiesSchema } from "./types"

type SimulationMapContext = {
	selectedTemplate: SelectedTemplateFragment | null
	openTemplate: (template: SelectedTemplateFragment) => void
	propertiesSchema: PropertiesSchema | null
	currentProperties: Record<string, any> | null
	setProperties: (props: Record<string, any>) => void
	updateProperty: (key: string, value: any) => void
	// openInstance: (instance: LayerInstance) => void
	closePanel: () => void
	simulation: SimulationInfoFragment
	selectedScenario: SimulationScenarioFragment
	categories: AllCategoriesFragment[]
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
	simulation,
	categories,
}: {
	children: React.ReactNode
	simulation: SimulationInfoFragment
	categories: AllCategoriesFragment[]
}) {
	const { scenarioId } = useParams({
		from: "/_auth/dashboard/simulation/$simulationId/scenario/$scenarioId",
	})
	const [selectedTemplate, setSelectedTemplate] =
		useState<SelectedTemplateFragment | null>(null)
	const [currentProperties, setCurrentProperties] = useState<Record<
		string,
		any
	> | null>(null)
	const [propertiesSchema, setPropertiesSchema] =
		useState<PropertiesSchema | null>(null)

	const selectedScenario = useMemo(() => {
		return (
			simulation.scenarios.find((scenario) => scenario.id === scenarioId) ||
			simulation.scenarios[0]
		)
	}, [simulation.scenarios, scenarioId])

	function openTemplate(template: SelectedTemplateFragment) {
		setSelectedTemplate(template)
		// setSelectedInstance(null)
		setCurrentProperties(
			Object.fromEntries(
				Object.entries(template.propertiesSchema).map(([k, v]: any) => [
					k,
					v.default,
				]),
			),
		)
		setPropertiesSchema(template.propertiesSchema)
	}

	function closePanel() {
		setSelectedTemplate(null)
		// setSelectedInstance(null)
		setCurrentProperties(null)
	}

	function updateProperty(key: string, value: any) {
		setCurrentProperties((prev) => (prev ? { ...prev, [key]: value } : prev))
	}

	return (
		<SimulationMapContext.Provider
			value={{
				selectedTemplate,
				openTemplate,
				currentProperties,
				setProperties: setCurrentProperties,
				updateProperty,
				closePanel,
				propertiesSchema,
				simulation,
				selectedScenario,
				categories,
			}}
		>
			{children}
		</SimulationMapContext.Provider>
	)
}
