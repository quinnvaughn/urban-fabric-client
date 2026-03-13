import { useMutation } from "@apollo/client/react"
import { useEffect, useRef } from "react"
import { Box } from "#/features/ui"
import { UpdateFabricTitleDocument } from "#/graphql/generated"
import { css } from "#/styles/styled-system/css"
import { useFabricStore } from "../fabric-store"

type Props = {
	id: string
	title: string
}

export function EditorTitleInput({ id, title }: Props) {
	const text = useFabricStore((state) => state.title)
	const initTitle = useFabricStore((state) => state.initTitle)
	const setText = useFabricStore((state) => state.setTitle)
	const setSaveStatus = useFabricStore((state) => state.setSaveStatus)
	const [updateTitle] = useMutation(UpdateFabricTitleDocument)
	const initializedFabricId = useRef<string | null>(null)

	// Initialize local title from server data when opening a fabric.
	useEffect(() => {
		if (initializedFabricId.current === id) {
			return
		}
		initTitle(title)
		initializedFabricId.current = id
	}, [id, initTitle, title])

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
				onBlur={async () => {
					if (text.trim() === "") {
						initTitle(title)
						return
					}
					setSaveStatus("saving")
					try {
						await updateTitle({
							variables: { input: { id, title: text.trim() } },
						})
						setSaveStatus("saved")
						setTimeout(() => setSaveStatus("idle"), 2000)
					} catch {
						setSaveStatus("error")
					}
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
