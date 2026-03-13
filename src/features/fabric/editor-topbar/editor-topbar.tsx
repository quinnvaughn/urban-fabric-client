import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { BackButton } from "./back-button"
import { EditorTitleInput } from "./editor-title-input"
import { SaveIndicator } from "./save-indicator"

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
			<SaveIndicator />
			<Box className={css({ flexShrink: 0 })}>
				<Link
					to="/fabric/$id/publish"
					params={{ id }}
					className={button({
						appearance: "solid",
						intent: "brand",
						size: "sm",
					})}
				>
					Publish proposal <ChevronRight size={12} />
				</Link>
			</Box>
		</header>
	)
}
