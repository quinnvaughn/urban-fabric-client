import type * as React from "react"
import { Button, Card, HStack, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	title: string
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
	children: React.ReactNode
	submitDisabled?: boolean
	submitLabel?: string
}

export function SettingsSectionCard({
	title,
	onSubmit,
	children,
	submitDisabled,
	submitLabel = "Save",
}: Props) {
	return (
		<Card size="sm" shadow="sm">
			<form onSubmit={onSubmit} noValidate>
				<Card.Body>
					<VStack gap="4">
						<Typography.Text weight="bold" size="sm">
							{title}
						</Typography.Text>
						<VStack gap="2">{children}</VStack>
					</VStack>
				</Card.Body>
				<Card.Footer>
					<HStack justify="end" gap="4" className={css({ w: "full" })}>
						<Button type="submit" size="sm" disabled={submitDisabled}>
							{submitLabel}
						</Button>
					</HStack>
				</Card.Footer>
			</form>
		</Card>
	)
}
