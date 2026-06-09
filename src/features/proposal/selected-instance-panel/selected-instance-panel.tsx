import { X } from "lucide-react"
import { useState } from "react"
import { Fragment } from "react/jsx-runtime"
import { ElementPhotoCard } from "#/features/fabric"
import { ELEMENT_TYPE_MAP } from "#/features/fabric/element-types"
import {
	type ElementInstance,
	normalizeElementPhoto,
} from "#/features/fabric/element-types/types"
import { useCalculatedRows } from "#/features/fabric/use-calculated-rows"
import {
	Box,
	Button,
	Divider,
	HStack,
	Lightbox,
	Swatch,
	Typography,
	VStack,
} from "#/features/ui"
import { capitalize } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

type Props = {
	instance: ElementInstance
	onClose: () => void
}

export function SelectedInstancePanel({ instance, onClose }: Props) {
	const elementType = ELEMENT_TYPE_MAP[instance.typeId]
	const calculatedRows = useCalculatedRows(instance, elementType ?? null)
	const photos = (instance.photos ?? []).map(normalizeElementPhoto)
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

	const propertyRows =
		elementType?.properties
			.filter((p) => p.showInProposal !== false)
			.map((p) => {
				const raw = instance.properties?.[p.key]
				if (raw == null) return null
				const unit = p.input.kind === "slider" ? p.input.unit : undefined
				const value = unit ? `${raw} ${unit}` : capitalize(String(raw))
				return { key: p.key, label: p.label, value }
			})
			.filter((r) => r != null) ?? []

	const allRows = [...propertyRows, ...calculatedRows]

	return (
		<Fragment>
			<Box
				className={css({
					p: "4",
					flexShrink: 0,
					display: "flex",
					alignItems: "flex-start",
					gap: "2.5",
					borderBottom: "1px solid",
					borderBottomColor: "stone.200",
					position: "sticky",
					top: 0,
					background: "white",
				})}
			>
				<VStack gap="1" className={css({ flex: 1 })}>
					<Typography.Text
						size="xxs"
						color="coral.500"
						weight="semibold"
						transform="uppercase"
						letterSpacing="wider"
					>
						Element
					</Typography.Text>
					<HStack gap="2">
						<Swatch size="3" color={elementType?.baseMapStyle.color} />
						<Typography.Text size="md" color="stone.900" weight="semibold">
							{elementType?.title}
						</Typography.Text>
					</HStack>
				</VStack>
				<Button appearance="ghost" intent="neutral" size="xs" onClick={onClose}>
					<X size={14} />
				</Button>
			</Box>
			<Box
				className={css({
					flex: 1,
					p: "4",
				})}
			>
				<VStack gap="3.5">
					{instance.title && (
						<Typography.Text size="lg" color="stone.900" weight="semibold">
							{instance.title}
						</Typography.Text>
					)}
					{instance.note ? (
						<VStack gap="2">
							<Divider label="Note" />
							<Typography.Text
								size="sm"
								color="stone.700"
								whiteSpace="pre-wrap"
							>
								{instance.note}
							</Typography.Text>
						</VStack>
					) : (
						<Typography.Text
							size="sm"
							color="stone.400"
							fontStyle="italic"
							lineHeight="relaxed"
						>
							No note for this element.
						</Typography.Text>
					)}
					{photos.length > 0 && (
						<VStack gap="2">
							<Divider label="Photos" />
							<Box
								className={css({
									display: "grid",
									gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
									gap: "2",
								})}
							>
								{photos.map((photo, index) => (
									<ElementPhotoCard
										key={photo.url}
										url={photo.url}
										alt={
											instance.title
												? `${instance.title} photo`
												: "Element photo"
										}
										caption={photo.caption}
										onCaptionClick={() => setLightboxIndex(index)}
									/>
								))}
							</Box>
						</VStack>
					)}
					<VStack gap="2">
						<Divider label="Properties" />
						<div>
							{allRows.map((row) => (
								<Box
									key={row.key}
									className={css({
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										gap: "3",
										borderBottom: "1px solid",
										borderBottomColor: {
											base: "stone.100",
											_lastOfType: "transparent",
										},
										py: "2",
									})}
								>
									<Typography.Text size="sm" color="stone.500">
										{row.label}
									</Typography.Text>
									<Typography.Text
										size="sm"
										color="stone.900"
										textAlign="right"
										weight="medium"
									>
										{row.value as string}
									</Typography.Text>
								</Box>
							))}
						</div>
					</VStack>
				</VStack>
			</Box>
			{lightboxIndex != null && (
				<Lightbox
					photos={photos.map((photo) => ({
						src: photo.url,
						caption: photo.caption,
						alt: instance.title ? `${instance.title} photo` : "Element photo",
					}))}
					initialIndex={lightboxIndex}
					onClose={() => setLightboxIndex(null)}
				/>
			)}
		</Fragment>
	)
}
