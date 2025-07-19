import type { AllCategoriesFragment } from "../../../graphql/generated"
import { css } from "../../../styles/styled-system/css"

type Props = {
	categories: AllCategoriesFragment[]
}

export function SimulationMapLayers({ categories }: Props) {
	return (
		<div
			className={css({
				boxShadow: "sm",
				bg: "neutral.0",
				position: "absolute",
				top: 69,
				p: "md",
				borderRadius: "md",
				left: 20,
			})}
		>
			{categories.map((category) => (
				<div key={category.id}>
					<h3>{category.label}</h3>
					<ul>
						{category.layerTemplates.map((template) => (
							<li key={template.id}>{template.label}</li>
						))}
					</ul>
				</div>
			))}
		</div>
	)
}
