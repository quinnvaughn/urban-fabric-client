import { Info, Trash, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Fragment } from "react/jsx-runtime"
import { match, P } from "ts-pattern"
import {
	Box,
	Button,
	Segmented,
	Select,
	Stepper,
	Typography,
} from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { ELEMENT_TYPE_MAP } from "../element-types"
import type {
	ElementInstance,
	PropertyDescriptor,
} from "../element-types/types"
import { useFabricStore } from "../fabric-store"
import { nearestRoadName } from "../osrm-utils"

const EARTH_RADIUS_METERS = 6371008.8
const METERS_TO_FEET = 3.28084

function toRadians(degrees: number) {
	return (degrees * Math.PI) / 180
}

function segmentLengthMeters(a: [number, number], b: [number, number]): number {
	const [lng1, lat1] = a
	const [lng2, lat2] = b
	const dLat = toRadians(lat2 - lat1)
	const dLng = toRadians(lng2 - lng1)
	const lat1Rad = toRadians(lat1)
	const lat2Rad = toRadians(lat2)

	const sinLat = Math.sin(dLat / 2)
	const sinLng = Math.sin(dLng / 2)
	const haversine =
		sinLat * sinLat + Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinLng * sinLng
	const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))

	return EARTH_RADIUS_METERS * c
}

function lineLengthFeet(coordinates: [number, number][]): number {
	if (coordinates.length < 2) return 0

	let meters = 0
	for (let i = 1; i < coordinates.length; i += 1) {
		meters += segmentLengthMeters(coordinates[i - 1], coordinates[i])
	}

	return meters * METERS_TO_FEET
}

function formatCoordinate(coord?: [number, number]) {
	if (!coord) return "--"
	const [lng, lat] = coord
	return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

function coordinateKey(coord?: [number, number]) {
	if (!coord) return ""
	return `${coord[0].toFixed(5)},${coord[1].toFixed(5)}`
}

function getCalculatedValue(
	key: string,
	instance: ElementInstance,
	streetNames?: { from: string | null; to: string | null },
) {
	if (key === "length") {
		return lineLengthFeet(instance.coordinates)
	}

	const points = instance.waypoints.length
		? instance.waypoints
		: instance.coordinates
	if (key === "from") {
		return streetNames?.from ?? formatCoordinate(points[0])
	}
	if (key === "to") {
		return streetNames?.to ?? formatCoordinate(points[points.length - 1])
	}

	return "--"
}

function formatCalculatedValue(value: string | number, unit?: string) {
	if (typeof value !== "number") return value
	const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10
	return unit ? `${rounded} ${unit}` : String(rounded)
}

export function PropertiesPanel() {
	const selectedInstance = useFabricStore(
		(state) =>
			state.elements.find((e) => e.id === state.selectedInstanceId) ?? null,
	)
	const setSelectedInstanceId = useFabricStore(
		(state) => state.setSelectedInstanceId,
	)
	const updateElement = useFabricStore((state) => state.updateElement)

	const deleteElement = useFabricStore((state) => state.deleteElement)

	const descriptor = selectedInstance
		? ELEMENT_TYPE_MAP[selectedInstance.typeId]
		: null

	const routeEndpoints = useMemo(() => {
		if (!selectedInstance) return { from: undefined, to: undefined }
		const points = selectedInstance.waypoints.length
			? selectedInstance.waypoints
			: selectedInstance.coordinates
		return {
			from: points[0],
			to: points[points.length - 1],
		}
	}, [selectedInstance])

	const fromKey = coordinateKey(routeEndpoints.from)
	const toKey = coordinateKey(routeEndpoints.to)
	const streetNameCacheRef = useRef(new Map<string, string>())
	const [streetNames, setStreetNames] = useState<{
		from: string | null
		to: string | null
	}>({ from: null, to: null })

	useEffect(() => {
		if (!selectedInstance || !routeEndpoints.from || !routeEndpoints.to) {
			setStreetNames({ from: null, to: null })
			return
		}

		let cancelled = false

		async function resolveStreetName(
			coord: [number, number],
			key: string,
		): Promise<string | null> {
			const cached = streetNameCacheRef.current.get(key)
			if (cached) return cached

			try {
				const name = await nearestRoadName(coord[0], coord[1])
				if (name) {
					streetNameCacheRef.current.set(key, name)
				}
				return name
			} catch {
				return null
			}
		}

		Promise.all([
			resolveStreetName(routeEndpoints.from, fromKey),
			resolveStreetName(routeEndpoints.to, toKey),
		]).then(([fromName, toName]) => {
			if (cancelled) return
			setStreetNames({ from: fromName, to: toName })
		})

		return () => {
			cancelled = true
		}
	}, [selectedInstance, routeEndpoints, fromKey, toKey])

	const calculatedRows = descriptor
		? descriptor.calculated.map((field) => ({
				...field,
				value: selectedInstance
					? getCalculatedValue(field.key, selectedInstance, streetNames)
					: "--",
			}))
		: []

	function renderComponent(prop: PropertyDescriptor) {
		const currentValue =
			(selectedInstance?.properties[prop.key] as string | undefined) ??
			String(prop.default)

		function handleChange(value: string) {
			if (!selectedInstance) return
			updateElement(selectedInstance.id, {
				properties: { ...selectedInstance.properties, [prop.key]: value },
			})
		}

		const label = prop.description ? (
			<span
				className={css({
					display: "inline-flex",
					alignItems: "center",
					gap: "1",
				})}
			>
				{prop.label}
				<span
					title={prop.description}
					className={css({
						display: "inline-flex",
						color: "stone.400",
						cursor: "help",
					})}
				>
					<Info size={12} />
				</span>
			</span>
		) : (
			prop.label
		)

		return match(prop.input)
			.with({ kind: "segmented" }, (c) => (
				<Segmented
					key={prop.key}
					value={currentValue}
					onChange={handleChange}
					fullWidth
				>
					<Segmented.Legend>{label}</Segmented.Legend>
					<Segmented.Group>
						{c.options.map((o) => (
							<Segmented.Option
								key={o.value}
								value={o.value}
								icon={o.icon}
								title={o.description}
							>
								{o.label}
							</Segmented.Option>
						))}
					</Segmented.Group>
				</Segmented>
			))
			.with({ kind: "select" }, (select) => (
				<Select key={prop.key} value={currentValue} onChange={handleChange}>
					<Select.Label>{label}</Select.Label>
					<Select.Trigger />
					<Select.Options>
						{select.options.map((o) => (
							<Select.Option key={o.value} value={o.value}>
								{o.label}
							</Select.Option>
						))}
					</Select.Options>
				</Select>
			))
			.with({ kind: "stepper" }, (step) => (
				<Stepper
					key={prop.key}
					size="md"
					value={Number(currentValue)}
					onChange={(val) => handleChange(String(val))}
					min={step.min}
					max={step.max}
					step={step.step}
					format={(val) => (step.unit ? `${val} ${step.unit}` : String(val))}
				>
					<Stepper.Label>{label}</Stepper.Label>
					<Stepper.Control />
				</Stepper>
			))
			.with({ kind: "toggle" }, () => <div key={prop.key}>toggle</div>)
			.exhaustive()
	}

	return (
		<Box
			className={css({
				position: "fixed",
				top: "calc(var(--uf-header-height) + 20px)",
				right: "20px",
				width: "272px",
				zIndex: "panel",
				maxHeight: "calc(100vh - var(--uf-header-height) - 120px)",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				background: "white",
				border: "1px solid",
				borderColor: "border.subtle",
				borderRadius: "lg",
				boxShadow: "md",
				animation: selectedInstance
					? "fadeInRight 0.42s var(--easings-spring) 0.12s both"
					: "none",
				opacity: selectedInstance ? 1 : 0,
				transform: selectedInstance ? "translateX(0)" : "translateX(20px)",
				transition: "opacity 0.42s, transform 200ms var(--easings-in-out)",
				pointerEvents: selectedInstance ? "auto" : "none",
			})}
		>
			{!descriptor || !selectedInstance ? null : (
				<Fragment>
					<Box
						className={css({
							display: "flex",
							alignItems: "center",
							justify: "between",
							px: "3.5",
							paddingTop: "3",
							paddingBottom: "2.5",
							borderBottom: "1px solid",
							borderColor: "border.subtle",
							flexShrink: 0,
						})}
					>
						<Typography.Text
							size="xxs"
							weight="semibold"
							tracking="wider"
							color="stone.500"
							transform="uppercase"
						>
							{descriptor.title}
						</Typography.Text>
						<button
							type="button"
							onClick={() => setSelectedInstanceId(null)}
							className={css({
								width: "6",
								height: "6",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								border: "none",
								background: { base: "transparent", _hover: "stone.200" },
								borderRadius: "sm",
								color: { base: "stone.500", _hover: "stone.900" },
								cursor: "pointer",
								transition: "background 150ms, color 150ms",
							})}
						>
							<X size={12} />
						</button>
					</Box>
					<Box
						className={css({
							flex: 1,
							overflowY: "auto",
							padding: "3.5",
							display: "flex",
							flexDirection: "column",
							gap: "3.5",
							scrollbarWidth: "thin",
							scrollbarColor: "stone.300 transparent",
						})}
					>
						{match(descriptor.properties)
							.with([], () => (
								<Typography.Text
									size="sm"
									color="stone.500"
									className={css({ textAlign: "center" })}
								>
									No configurable properties
								</Typography.Text>
							))
							.with(P.array(P._), (props) =>
								props.map((val) => renderComponent(val)),
							)
							.exhaustive()}
					</Box>
					{calculatedRows.length > 0 && (
						<Box
							className={css({
								py: "2.5",
								px: "3.5",
								borderTop: "1px solid",
								borderTopColor: "border.subtle",
								display: "flex",
								flexDirection: "column",
								gap: "2",
								flexShrink: 0,
							})}
						>
							{calculatedRows.map((field) => (
								<Box
									key={field.key}
									className={css({
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										gap: "2",
									})}
								>
									<Typography.Text
										size="xs"
										color="stone.500"
										weight="semibold"
									>
										{field.label}
									</Typography.Text>
									<Typography.Text size="sm" color="stone.800" weight="medium">
										{formatCalculatedValue(field.value, field.unit)}
									</Typography.Text>
								</Box>
							))}
						</Box>
					)}
					<Box
						className={css({
							py: "3",
							px: "3.5",
							borderTop: "1px solid",
							borderTopColor: "border.subtle",
							flexShrink: 0,
						})}
					>
						<Button
							intent="danger"
							appearance="outline"
							fullWidth
							onClick={() => deleteElement(selectedInstance.id)}
						>
							<Trash size={14} />
							Remove
						</Button>
					</Box>
				</Fragment>
			)}
		</Box>
	)
}
