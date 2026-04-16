import { useEffect, useRef, useState } from "react"
import { Box, Button, Textarea } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	url: string
	alt: string
	caption?: string
	onDone: (caption: string) => void
}

export function ElementPhotoCaptionEditor({
	url,
	alt,
	caption = "",
	onDone,
}: Props) {
	const [draftCaption, setDraftCaption] = useState(caption)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		setDraftCaption(caption)
	}, [caption])

	useEffect(() => {
		textareaRef.current?.focus()
		textareaRef.current?.select()
	}, [])

	return (
		<Box
			className={css({
				display: "flex",
				flexDirection: "column",
				gap: "3",
				padding: "3",
				borderRadius: "xl",
				border: "1px solid",
				borderColor: "stone.200",
				background: "stone.50",
			})}
		>
			<Box
				className={css({
					aspectRatio: "1",
					overflow: "hidden",
					borderRadius: "lg",
					background: "stone.300",
				})}
			>
				<img
					src={url}
					alt={alt}
					className={css({
						width: "100%",
						height: "100%",
						objectFit: "cover",
						display: "block",
					})}
				/>
			</Box>
			<Textarea>
				<Textarea.Field
					ref={textareaRef}
					value={draftCaption}
					maxLength={140}
					minRows={3}
					resize="vertical"
					placeholder="Add a caption... (optional)"
					onChange={(e) => setDraftCaption(e.target.value)}
					onKeyDown={(e) => {
						if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
							e.preventDefault()
							onDone(draftCaption.trim())
						}
					}}
				/>
			</Textarea>
			<Box
				className={css({
					display: "flex",
					justifyContent: "flex-end",
				})}
			>
				<Button
					appearance="solid"
					intent="primary"
					size="sm"
					onClick={() => onDone(draftCaption.trim())}
				>
					Done
				</Button>
			</Box>
		</Box>
	)
}
