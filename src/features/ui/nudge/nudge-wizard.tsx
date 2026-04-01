import * as React from "react"
import { css } from "@/styles/styled-system/css"
import { Button } from "../button"
import { HStack } from "../layout"
import { Nudge, type NudgeAnchor, type NudgeOffset } from "./nudge"

export interface NudgeWizardStep {
	title: string
	description: string
}

export interface NudgeWizardProps {
	label?: string
	steps: NudgeWizardStep[]
	anchor?: NudgeAnchor
	offset?: NudgeOffset
	onDismiss?: () => void
	onComplete?: () => void
	className?: string
}

export function NudgeWizard({
	label = "Quick tour",
	steps,
	anchor = { x: "center", y: "bottom" },
	offset = {},
	onDismiss,
	onComplete,
	className,
}: NudgeWizardProps) {
	const [stepIndex, setStepIndex] = React.useState(0)
	const isFirst = stepIndex === 0
	const isLast = stepIndex === steps.length - 1
	const current = steps[stepIndex]

	return (
		<Nudge
			anchor={anchor}
			offset={offset}
			onDismiss={onDismiss}
			className={className}
		>
			<Nudge.Header label={label}>
				<Nudge.CloseButton />
			</Nudge.Header>

			<Nudge.Body
				className={css({
					display: "flex",
					flexDirection: "column",
					gap: "1.5",
				})}
			>
				<Nudge.Title>{current.title}</Nudge.Title>
				<Nudge.Description>{current.description}</Nudge.Description>
			</Nudge.Body>
			<Nudge.Footer>
				<HStack justify="space-between" align="center" fullWidth>
					<HStack gap="1">
						{steps.map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here because the steps array is static and does not change order.
								key={i}
								className={css({
									h: "1",
									borderRadius: "full",
									transition: "all 0.2s",
									background: i === stepIndex ? "teal.400" : "stone.300",
									w: i === stepIndex ? "3.5" : "1",
								})}
							/>
						))}
					</HStack>

					<HStack gap="1.5" align="center">
						{isFirst && !isLast && (
							<Button
								appearance="ghost"
								intent="neutral"
								size="xs"
								onClick={onDismiss}
							>
								Skip
							</Button>
						)}
						{!isFirst && (
							<Button
								appearance="ghost"
								intent="neutral"
								size="xs"
								onClick={() => setStepIndex((i) => i - 1)}
							>
								Back
							</Button>
						)}
						<Button
							appearance="solid"
							size="xs"
							onClick={() => {
								if (isLast) {
									onComplete?.()
									onDismiss?.()
								} else setStepIndex((i) => i + 1)
							}}
						>
							{isLast ? "Done" : "Next"}
						</Button>
					</HStack>
				</HStack>
			</Nudge.Footer>
		</Nudge>
	)
}
