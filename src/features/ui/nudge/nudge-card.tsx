// nudge-card.tsx — unchanged API, rebuilt on Nudge primitive

import { css } from "@/styles/styled-system/css"
import { Button } from "../button"
import { HStack } from "../layout"
import { Nudge, type NudgeAnchor, type NudgeOffset } from "./nudge"

export interface NudgeCardAction {
	label: string
	onClick: () => void
}

export interface NudgeCardProps {
	title: string
	description?: string
	primaryAction: NudgeCardAction
	secondaryAction?: NudgeCardAction
	anchor?: NudgeAnchor
	offset?: NudgeOffset
	onDismiss?: () => void
	className?: string
}

export function NudgeCard({
	title,
	description,
	primaryAction,
	secondaryAction,
	anchor = { x: "center", y: "bottom" },
	offset = {},
	onDismiss,
	className,
}: NudgeCardProps) {
	return (
		<Nudge
			anchor={anchor}
			offset={offset}
			onDismiss={onDismiss}
			className={className}
			style={{ width: 264 }}
		>
			<Nudge.Body
				className={css({ display: "flex", flexDirection: "column", gap: "3" })}
			>
				<HStack justify="space-between" align="flex-start" gap="2">
					<Nudge.Title>{title}</Nudge.Title>
					{onDismiss && <Nudge.CloseButton />}
				</HStack>
				{description && <Nudge.Description>{description}</Nudge.Description>}
			</Nudge.Body>

			<Nudge.Footer
				className={css({
					border: "none",
					flexDirection: "column",
					gap: "1.5",
				})}
			>
				<Button
					appearance="solid"
					size="sm"
					fullWidth
					onClick={primaryAction.onClick}
				>
					{primaryAction.label}
				</Button>
				{secondaryAction && (
					<Button
						appearance="ghost"
						intent="neutral"
						size="sm"
						fullWidth
						onClick={secondaryAction.onClick}
					>
						{secondaryAction.label}
					</Button>
				)}
			</Nudge.Footer>
		</Nudge>
	)
}
