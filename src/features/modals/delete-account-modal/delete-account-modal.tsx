import { useApolloClient, useMutation } from "@apollo/client/react"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState, useTransition } from "react"
import { match } from "ts-pattern"
import {
	Button,
	Input,
	Modal,
	Typography,
	useToast,
	VStack,
} from "#/features/ui"
import { DeleteAccountDocument } from "#/graphql/generated"

type Props = {
	open: boolean
	onClose: () => void
}

export function DeleteAccountModal({ open, onClose }: Props) {
	const [deleteAccount] = useMutation(DeleteAccountDocument)
	const [isPending, startTransition] = useTransition()
	const client = useApolloClient()
	const navigate = useNavigate()
	const toast = useToast()
	const [deleteText, setDeleteText] = useState("")
	const isDeleteConfirmed = deleteText.trim().toLowerCase() === "delete"

	useEffect(() => {
		if (!open) setDeleteText("")
	}, [open])

	function handleDeleteAccount() {
		if (!isDeleteConfirmed) return

		startTransition(async () => {
			try {
				const response = await deleteAccount()
				match(response.data?.deleteAccount)
					.with({ __typename: "DeleteAccountResponse" }, async ({ data }) => {
						if (!data) {
							toast.error("Unable to delete account")
							return
						}
						await client.clearStore()
						onClose()
						toast.success("Account deleted")
						await navigate({ to: "/", replace: true })
					})
					.with({ __typename: "UnauthorizedError" }, async () => {
						await navigate({ to: "/login", replace: true })
					})
					.with({ __typename: "NotFoundError" }, ({ message }) => {
						toast.error(message)
					})
					.otherwise(() => {
						toast.error("An unexpected error occurred")
					})
			} catch {
				toast.error("Unable to delete account")
			}
		})
	}

	return (
		<Modal open={open} onClose={onClose} size="sm">
			<Modal.Header>
				<VStack gap="1">
					<Modal.Eyebrow color="danger.default">Danger zone</Modal.Eyebrow>
					<Modal.Title size="lg">Delete account?</Modal.Title>
				</VStack>
				<Modal.CloseBtn />
			</Modal.Header>
			<Modal.Body>
				<VStack gap="5">
					<Typography.Text size="sm" color="stone.600" lineHeight="tight">
						This will permanently delete your account and all of your fabrics
						and proposals. There's no going back.
					</Typography.Text>
					<Typography.Text size="sm" color="stone.700" lineHeight="tight">
						Type <Typography.Inline weight="semibold">delete</Typography.Inline>{" "}
						to continue
					</Typography.Text>
					<Input>
						<Input.Field
							value={deleteText}
							onChange={(event) => setDeleteText(event.target.value)}
							autoComplete="off"
							autoCapitalize="none"
							spellCheck={false}
						/>
					</Input>
				</VStack>
			</Modal.Body>
			<Modal.Footer>
				<Button
					type="button"
					size="sm"
					appearance="outline"
					onClick={onClose}
					disabled={isPending}
				>
					Cancel
				</Button>
				<Button
					type="button"
					size="sm"
					intent="danger"
					onClick={handleDeleteAccount}
					disabled={isPending || !isDeleteConfirmed}
				>
					{isPending ? "Deleting..." : "Delete account"}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
