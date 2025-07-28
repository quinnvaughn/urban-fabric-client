import { useParams } from "@tanstack/react-router"
import { createContext, useContext, useMemo, useState } from "react"
import type {
	AllCategoriesFragment,
	SelectedTemplateFragment,
	SimulationInfoFragment,
	SimulationScenarioFragment,
} from "../../graphql/generated"
import type { PropertiesSchema } from "./types"

type Overlays = "details" | "delete" | null

type SimulationMapContext = {
	selectedTemplate: SelectedTemplateFragment | null
	openTemplate: (template: SelectedTemplateFragment) => void
	propertiesSchema: PropertiesSchema | null
	currentProperties: Record<string, any> | null
	updateProperty: (key: string, value: any) => void
	// openInstance: (instance: LayerInstance) => void
	closePanel: () => void
	simulation: SimulationInfoFragment
	selectedScenario: SimulationScenarioFragment
	categories: AllCategoriesFragment[]
	activeOverlay: Overlays
	setActiveOverlay: React.Dispatch<React.SetStateAction<Overlays>>
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
	const [propertiesSchema, setPropertiesSchema] =
		useState<PropertiesSchema | null>(null)

	const [activeOverlay, setActiveOverlay] = useState<Overlays>(null)

	// NEW: persistent store for template properties
	const [propertiesByTemplate, setPropertiesByTemplate] = useState<
		Record<string, Record<string, any>>
	>({})

	const currentProperties = useMemo(() => {
		if (!selectedTemplate) return null
		return propertiesByTemplate[selectedTemplate.id] || null
	}, [selectedTemplate, propertiesByTemplate])

	const selectedScenario = useMemo(() => {
		return (
			simulation.scenarios.find((scenario) => scenario.id === scenarioId) ||
			simulation.scenarios[0]
		)
	}, [simulation.scenarios, scenarioId])

	function openTemplate(template: SelectedTemplateFragment) {
		setSelectedTemplate(template)
		setPropertiesSchema(template.propertiesSchema)

		// Lazy-init properties if this template hasn’t been opened yet
		setPropertiesByTemplate((prev) =>
			prev[template.id]
				? prev
				: {
						...prev,
						[template.id]: Object.fromEntries(
							Object.entries(template.propertiesSchema).map(([k, v]: any) => [
								k,
								v.default,
							]),
						),
					},
		)
	}

	function closePanel() {
		setSelectedTemplate(null)
	}

	function updateProperty(key: string, value: any) {
		if (!selectedTemplate) return
		setPropertiesByTemplate((prev) => ({
			...prev,
			[selectedTemplate.id]: {
				...(prev[selectedTemplate.id] ?? {}),
				[key]: value,
			},
		}))
	}

	return (
		<SimulationMapContext.Provider
			value={{
				selectedTemplate,
				openTemplate,
				currentProperties,
				updateProperty,
				closePanel,
				propertiesSchema,
				simulation,
				selectedScenario,
				categories,
				activeOverlay,
				setActiveOverlay,
			}}
		>
			{children}
		</SimulationMapContext.Provider>
	)
}
