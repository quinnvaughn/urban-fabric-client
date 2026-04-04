import { type KeyboardEvent, useEffect, useRef, useState } from "react"
import { Box, Button, Textarea, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useCommentEditStore } from "../comment-edit-store"

type Props = {
	id: string
	body: string
	prefix?: string
	onSave: (body: string) => Promise<boolean> | boolean
}

export function EditableCommentBody({ id, body, prefix, onSave }: Props) {
	const { editingTarget, draftBody, setDraftBody, cancelEditing } =
		useCommentEditStore()
	const [isSaving, setIsSaving] = useState(false)
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
	const isEditing = editingTarget?.id === id

	useEffect(() => {
		if (!isEditing) return

		textAreaRef.current?.focus()
		textAreaRef.current?.setSelectionRange(draftBody.length, draftBody.length)
	}, [draftBody.length, isEditing])

	async function handleSave() {
		if (!draftBody.trim()) return

		setIsSaving(true)
		try {
			const didSave = await onSave(draftBody.trim())
			if (didSave) {
				cancelEditing()
			}
		} finally {
			setIsSaving(false)
		}
	}

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
			event.preventDefault()
			void handleSave()
		}

		if (event.key === "Escape") {
			event.preventDefault()
			cancelEditing()
		}
	}

	if (!isEditing) {
		return (
			<Typography.Text
				size="md"
				color="stone.700"
				lineHeight="relaxed"
				whiteSpace="pre-wrap"
			>
				{prefix}
				{body}
			</Typography.Text>
		)
	}

	return (
		<Box className={css({ display: "grid", gap: "2" })}>
			<Textarea>
				<Textarea.Field
					ref={textAreaRef}
					value={draftBody}
					onChange={(event) => setDraftBody(event.target.value)}
					onKeyDown={handleKeyDown}
					resize="none"
				/>
			</Textarea>
			<Box
				className={css({
					display: "flex",
					justifyContent: "flex-end",
					gap: "2",
				})}
			>
				<Button
					type="button"
					size="xs"
					appearance="outline"
					intent="neutral"
					onClick={cancelEditing}
					disabled={isSaving}
				>
					Cancel
				</Button>
				<Button
					type="button"
					size="xs"
					onClick={() => void handleSave()}
					loading={isSaving}
					disabled={!draftBody.trim()}
				>
					Save
				</Button>
			</Box>
		</Box>
	)
}
