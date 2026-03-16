import { useRouter } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { css } from "#/styles/styled-system/css"

export function BackButton() {
	const router = useRouter()
	const onBack = () => router.history.back()
	return (
		<button
			type="button"
			onClick={onBack}
			className={css({
				color: { base: "stone.500", _hover: "stone.900" },
				background: { base: "transparent", _hover: "stone.200" },
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "30px",
				height: "30px",
				borderRadius: "md",
				border: "none",
				cursor: "pointer",
				transition:
					"background-color 150ms var(--easings-in-out), color 150ms var(--easings-in-out)",
				flexShrink: 0,
			})}
			title="Go back"
		>
			<ChevronLeft size={16} />
		</button>
	)
}
