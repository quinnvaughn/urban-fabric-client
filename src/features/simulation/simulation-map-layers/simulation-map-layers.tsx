import { useSimulationMapContext } from "../../../context"
import type { AllCategoriesFragment } from "../../../graphql/generated"
import { css, cx } from "../../../styles/styled-system/css"
import { Collapsible, Flex, Icon, Typography } from "../../ui"
import { FloatingPanel } from "../floating-panel"

type Props = {
	categories: AllCategoriesFragment[]
}

export function SimulationMapLayers({ categories }: Props) {
	const { openTemplate, selectedTemplate } = useSimulationMapContext()
	return (
		<FloatingPanel top={60} left={20} width={300} maxHeightOffset={100}>
			<Flex direction="column">
				{categories.map((cat) => (
					<Collapsible key={cat.id} defaultOpen>
						<Collapsible.Trigger>
							{({ open }) => (
								<Flex
									align="center"
									gap="xs"
									justify={"between"}
									className={css({
										p: "sm",
									})}
								>
									<Flex gap="xs" align="center">
										<Icon name={cat.icon || ""} size={16} />
										<Typography.Heading level={5}>
											{cat.label}
										</Typography.Heading>
									</Flex>
									<Icon
										size={18}
										name="CaretDown"
										className={cx(
											css({
												transition: "transform 0.2s ease",
											}),
											open && css({ transform: "rotate(180deg)" }),
										)}
									/>
								</Flex>
							)}
						</Collapsible.Trigger>
						{cat.layerTemplates.length > 0 && (
							<Collapsible.Content>
								<ul>
									{cat.layerTemplates.map((template) => (
										<li key={template.id}>
											<button
												type="button"
												onClick={() => openTemplate(template)}
												className={cx(
													css({
														width: "100%",
														p: "sm",
														paddingLeft: "xl",
														borderRadius: "md",
														cursor: "pointer",
														backgroundColor:
															selectedTemplate?.id === template.id
																? "neutral.200"
																: "transparent",
														transition: "background-color 0.2s ease",
														_hover: {
															bg: "neutral.100",
														},
													}),
												)}
											>
												<Flex align="center" gap="xs">
													<Icon name={template.icon || ""} size={16} />
													<Typography.Text>{template.label}</Typography.Text>
												</Flex>
											</button>
										</li>
									))}
								</ul>
							</Collapsible.Content>
						)}
					</Collapsible>
				))}
			</Flex>
		</FloatingPanel>
	)
}
