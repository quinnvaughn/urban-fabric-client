import { Button, Card, Typography, VStack } from "#/features/ui"
import { useModalStore } from "#/stores"
import { css } from "#/styles/styled-system/css"

export function DeleteAccountCard() {
	const open = useModalStore((state) => state.open)

	return (
		<Card size="sm" shadow="sm">
			<Card.Body>
				<VStack gap="3">
					<VStack gap="1">
						<Typography.Text weight="bold" size="sm" color="danger.default">
							Delete account
						</Typography.Text>
						<Typography.Text size="sm" color="stone.600" lineHeight="tight">
							Permanently removes your account and all associated data. This
							cannot be undone.
						</Typography.Text>
					</VStack>
					<Button
						className={css({ alignSelf: "start" })}
						size="sm"
						intent="danger"
						appearance="outline"
						onClick={() => open("deleteAccount")}
					>
						Delete my account
					</Button>
				</VStack>
			</Card.Body>
		</Card>
	)
}
