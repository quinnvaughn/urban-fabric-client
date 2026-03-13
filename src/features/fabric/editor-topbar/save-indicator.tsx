import { match } from "ts-pattern"
import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useFabricStore } from "../fabric-store"

export function SaveIndicator() {
	const saveStatus = useFabricStore((state) => state.saveStatus)

	return match(saveStatus)
		.with("saved", () => (
			<Box
				className={css({
					display: "flex",
					alignItems: "center",
					gap: "1",
					fontSize: "xs",
					color: "green.500",
					transition: "opacity 150ms",
					opacity: saveStatus === "saved" ? 1 : 0,
				})}
			>
				<Box
					className={css({
						display: "inline-block",
						width: "4px",
						height: "4px",
						borderRadius: "full",
						backgroundColor: "teal.400",
					})}
				/>
				<span>Saved</span>
			</Box>
		))
		.with("saving", () => (
			<Box
				className={css({
					fontSize: "xs",
					color: "blue.500",
				})}
			>
				Saving...
			</Box>
		))
		.with("error", () => (
			<Box
				className={css({
					fontSize: "xs",
					color: "red.500",
				})}
			>
				Error saving
			</Box>
		))
		.otherwise(() => null)
}
