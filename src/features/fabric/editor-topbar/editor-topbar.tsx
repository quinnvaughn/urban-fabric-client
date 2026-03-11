import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { BackButton } from "./back-button"
import { EditorTitleInput } from "./editor-title-input"

type Props = {
	title: string
	id: string
}

export function EditorTopbar({ title, id }: Props) {
	return (
		<header
			className={css({
				height: "var(--uf-topbar-height)",
				borderBottomStyle: "solid",
				borderBottomWidth: "1px",
				borderBottomColor: "border.default",
				background: "white",
				position: "fixed",
				top: 0,
				left: 0,
				zIndex: 1000,
				inset: "0 0 auto 0",
				display: "flex",
				alignItems: "center",
				px: "4",
				gap: "2.5",
			})}
		>
			<Box
				className={css({
					display: "flex",
					alignItems: "center",
					gap: "2.5",
					flex: 1,
					minWidth: 0,
				})}
			>
				<BackButton />
				<Box
					className={css({
						width: "px",
						height: "18px",
						background: "stone.200",
						flexShrink: 0,
					})}
				/>
				<EditorTitleInput id={id} title={title} />
			</Box>
		</header>
	)
}
