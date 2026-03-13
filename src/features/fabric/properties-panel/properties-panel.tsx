import { Info, Trash, X } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { match, P } from "ts-pattern"
import { Box, Button, Segmented, Stepper, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { ELEMENT_TYPE_MAP } from "../element-types"
import type { PropertyDescriptor } from "../element-types/types"
import { useFabricStore } from "../fabric-store"

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
			.with({ kind: "select" }, () => <div key={prop.key}>select</div>)
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
				zIndex: 100,
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
