import { useMutation } from "@apollo/client/react"
import { useState } from "react"
import { Box } from "#/features/ui"
import { UpdateFabricTitleDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"

type Props = {
	id: string
	title: string
}

export function EditorTitleInput({ id, title }: Props) {
	const [text, setText] = useState(title)
	const [updateTitle] = useMutation(UpdateFabricTitleDocument)
	return (
		<Box className={css({ minWidth: 0, flex: 1, maxWidth: "400px" })}>
			<input
				type="text"
				className={css({
					border: "none",
					cursor: { base: "default", _hover: "text" },
					font: "sans",
					fontSize: "sm",
					fontWeight: "semibold",
					borderBottomStyle: "solid",
					borderBottomWidth: "1px",
					borderBottomColor: "transparent",
					_hover: {
						borderBottomColor: "stone.300",
					},
					_focus: {
						borderBottomColor: "teal.500",
						_hover: {
							borderBottomColor: "teal.500",
						},
					},
					outline: "none",
					width: "100%",
					minWidth: 0,
					transition: "border-color 150ms, color 150ms",
					borderRadius: 0,
				})}
				value={text}
				onChange={(e) => setText(e.target.value)}
				onBlur={() => {
					if (text.trim() === "") {
						setText(title)
						return
					}
					updateTitle({ variables: { input: { id, title: text.trim() } } })
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.currentTarget.blur()
					}
				}}
				placeholder="Untitled"
			/>
		</Box>
	)
}
