import { css } from "../../../styles/styled-system/css"
import { useMapContext } from "../../ui/fabric-map/fabric-map"
import { Flex } from "../../ui/flex"
import { IconButton } from "../../ui/icon-button"

export function SimulationMapFooter() {
	const map = useMapContext()
	const iconButton = css({
		p: "sm",
		boxShadow: "sm",
		border: "1px solid",
		borderColor: "neutral.200",
		bg: "neutral.100",
		opacity: 0.85,
		borderRadius: "sm",
		_hover: {
			bg: "neutral.200",
		},
	})
	return (
		<Flex
			justify={"end"}
			align={"center"}
			className={css({
				position: "absolute",
				bottom: "0px",
				left: "0px",
				width: "100%",
				zIndex: 1,
				py: "md",
				px: "lg",
			})}
		>
			<div
				className={css({
					padding: "xs",
					position: "absolute",
					bottom: "0px",
					left: "0px",
					borderRadius: "sm",
					backgroundColor: "rgba(255, 255, 255, 0.7)",
				})}
			>
				Urban Fabric. Data from{" "}
				<a
					href="https://www.maptiler.com/copyright/"
					target="_blank"
					rel="noopener"
				>
					&copy; MapTiler
				</a>{" "}
				<a
					href="https://www.openstreetmap.org/copyright"
					target="_blank"
					rel="noopener"
				>
					&copy; OpenStreetMap contributors
				</a>
			</div>
			<Flex gap="sm">
				<IconButton
					name="NavigationArrow"
					className={iconButton}
					onClick={() => {
						navigator.geolocation.getCurrentPosition(
							(pos) => {
								map.flyTo({
									center: [pos.coords.longitude, pos.coords.latitude],
									zoom: 14,
								})
							},
							(err) => {
								console.error("Geolocation error:", err)
							},
						)
					}}
				/>
				<IconButton
					name="Minus"
					className={iconButton}
					onClick={() => map.zoomOut()}
				/>
				<IconButton
					name="Plus"
					className={iconButton}
					onClick={() => map.zoomIn()}
				/>
			</Flex>
		</Flex>
	)
}
