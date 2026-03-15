import { useReadQuery } from "@apollo/client/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useState } from "react"
import z from "zod"
import { FabricMap, StaticElementsLayer, ViewportSync } from "#/features/fabric"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import {
	Box,
	ChipGroup,
	Divider,
	Input,
	Textarea,
	Tooltip,
	Typography,
	VStack,
} from "#/features/ui"
import { GetFabricDocument, type GetFabricQuery } from "#/graphql/generated"
import { useForm } from "#/lib/form"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/fabric/$id/publish")({
	component: RouteComponent,
	loader: ({ context, params }) => {
		const fabricQuery = context.preloadQuery(GetFabricDocument, {
			variables: {
				fabricId: params.id,
			},
		})
		return { fabricQuery }
	},
})

function RouteComponent() {
	const { fabricQuery } = Route.useLoaderData()
	const { data } = useReadQuery(fabricQuery)

	if (data.fabric.__typename === "NotFoundError") {
		return <div>Fabric not found</div>
	}
	const fabric = data.fabric

	return <Publish fabric={fabric} />
}

type Fabric = Extract<GetFabricQuery["fabric"], { __typename: "Fabric" }>

type Viewport = {
	center: { lat: number; lng: number }
	zoom: number
}

const VIEWPORT_EPSILON = {
	center: 1e-5,
	zoom: 1e-3,
}

const TITLE_MAX_LENGTH = 80
const DESCRIPTION_MAX_LENGTH = 500

function isSameViewport(a: Viewport, b: Viewport): boolean {
	return (
		Math.abs(a.center.lng - b.center.lng) < VIEWPORT_EPSILON.center &&
		Math.abs(a.center.lat - b.center.lat) < VIEWPORT_EPSILON.center &&
		Math.abs(a.zoom - b.zoom) < VIEWPORT_EPSILON.zoom
	)
}

const schema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(
			TITLE_MAX_LENGTH,
			`Title must be at most ${TITLE_MAX_LENGTH} characters`,
		),
	description: z
		.string()
		.max(
			DESCRIPTION_MAX_LENGTH,
			`Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
		),
	categories: z.array(z.string()),
})

const categories = [
	"Bike infrastructure",
	"Pedestrian",
	"Transit",
	"Parking",
	"Traffic safety",
	"Streetscape",
]

function Publish({ fabric }: { fabric: Fabric }) {
	const elements: ElementInstance[] = Array.isArray(fabric.elements)
		? (fabric.elements as ElementInstance[])
		: []
	const [viewport, setViewport] = useState<Viewport>({
		zoom: fabric.zoom,
		center: {
			lat: fabric.center.lat,
			lng: fabric.center.lng,
		},
	})

	const handleViewportChange = useCallback((next: Viewport) => {
		setViewport((prev) => (isSameViewport(prev, next) ? prev : next))
	}, [])

	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
		},
		schema,
	})

	return (
		<Box
			className={css({
				display: "flex",
				flexDirection: "column",
				height: "100dvh",
				overflow: "hidden",
			})}
		>
			<Box
				id="publish-topbar"
				className={css({
					flexShrink: 0,
					height: "var(--uf-header-height)",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					px: "5",
					gap: "2.5",
					background: "white",
					borderBottom: "1px solid",
					borderBottomColor: "border.subtle",
					boxShadow: "sm",
					animation: "fadeDown 0.38s var(--easings-spring) both",
					position: "relative",
					zIndex: "raised",
				})}
			>
				<ChevronLeft size={16} />
			</Box>
			<Box
				id="main-content"
				className={css({
					flex: 1,
					display: "flex",
					overflow: "hidden",
					animation: "fadeInLeft 0.42s var(--easings-spring) 0.06s both",
				})}
			>
				<Box
					id="form-panel"
					className={css({
						width: "440px",
						flexShrink: 0,
						background: "white",
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						borderRight: "1px solid",
						borderRightColor: "border.subtle",
						boxShadow: "lg",
					})}
				>
					<Box
						id="panel-header"
						className={css({
							px: "7",
							paddingTop: "6",
							paddingBottom: "5",
							flexShrink: 0,
							borderBottom: "1px solid",
							borderBottomColor: "border.subtle",
						})}
					>
						<VStack gap="1.5">
							<Typography.Text
								id="pane-eyebrow"
								size="xxs"
								color="coral.500"
								tracking="wider"
								transform="uppercase"
								weight="semibold"
							>
								New proposal
							</Typography.Text>
							<Typography.Text font="serif" size="2xl" italic weight="light">
								Tell people what you built
							</Typography.Text>
							<Typography.Text size="sm" color="stone.600" leading="relaxed">
								A proposal is a public snapshot of your fabric. Give it a title
								and description so others understand what you're proposing and
								why.
							</Typography.Text>
							<Tooltip>
								<Tooltip.Trigger>
									<Link
										to="/fabric/$id"
										params={{ id: fabric.id }}
										className={css({
											display: "inline-flex",
											alignSelf: "start",
											alignItems: "center",
											gap: "2",
											py: "1.5",
											paddingRight: "2.5",
											paddingLeft: "2",
											border: "1px solid",
											borderColor: { base: "teal.200", _hover: "teal.300" },
											borderRadius: "full",
											background: { base: "teal.100", _hover: "teal.200" },
											fontSize: "xs",
											fontWeight: "medium",
											color: "teal.700",
											textDecoration: "none",
											transition: "background 150ms, border-color 150ms",
										})}
									>
										<Box
											as="span"
											id="fabric-ref-dot"
											className={css({
												width: "1.5",
												height: "1.5",
												borderRadius: "full",
												background: "teal.500",
												flexShrink: 0,
											})}
											aria-hidden="true"
										/>
										<span>{fabric.title}</span>
										<ChevronRight size={10} aria-hidden="true" />
									</Link>
								</Tooltip.Trigger>
								<Tooltip.Content>Return to fabric editor</Tooltip.Content>
							</Tooltip>
						</VStack>
					</Box>
					<Box
						id="panel-body"
						className={css({
							flex: 1,
							overflowY: "auto",
							py: "6",
							px: "7",
							borderBottom: "1px solid",
							borderBottomColor: "border.subtle",
							display: "flex",
							flexDirection: "column",
							gap: "5",
						})}
					>
						<form.Field name="title">
							{(field) => (
								<Input invalid={!!field.meta.error} required>
									<Input.Label>
										Title
										<Input.Counter
											current={field.value.length}
											max={TITLE_MAX_LENGTH}
										/>
									</Input.Label>
									<Input.Field
										placeholder="Describe your proposal in one line..."
										{...field}
									/>
									<Input.Error>{field.meta.error}</Input.Error>
								</Input>
							)}
						</form.Field>
						<form.Field name="description">
							{(field) => (
								<Textarea invalid={!!field.meta.error}>
									<Textarea.Label>
										Description{" "}
										<Textarea.Counter
											current={field.value.length}
											max={DESCRIPTION_MAX_LENGTH}
										/>
									</Textarea.Label>
									<Textarea.Field
										rows={6}
										resize="vertical"
										placeholder="What are you proposing, and why? Who does it benefit? Any tradeoffs worth sharing?"
										{...field}
									/>
									<Textarea.Description>
										Plain text only for now.
									</Textarea.Description>
									<Textarea.Error>{field.meta.error}</Textarea.Error>
								</Textarea>
							)}
						</form.Field>
						<form.Field name="categories">
							{(field) => (
								<ChipGroup value={field.value} onChange={field.onChange}>
									<ChipGroup.Label>Categories</ChipGroup.Label>
									<ChipGroup.Group>
										{categories.map((category) => (
											<ChipGroup.Chip key={category} value={category}>
												{category}
											</ChipGroup.Chip>
										))}
									</ChipGroup.Group>
									<ChipGroup.Description>
										Select all that apply.
									</ChipGroup.Description>
								</ChipGroup>
							)}
						</form.Field>
						<Divider label="Map view" />
					</Box>
				</Box>
				<Box
					id="map-area"
					className={css({
						flex: 1,
						position: "relative",
						overflow: "hidden",
						animation: "fadeInRight 0.42s var(--easings-spring) 0.1s both",
					})}
				>
					<FabricMap
						center={[viewport.center.lng, viewport.center.lat]}
						zoom={viewport.zoom}
					>
						<StaticElementsLayer elements={elements} />
						<ViewportSync
							viewport={viewport}
							onViewportChange={handleViewportChange}
						/>
					</FabricMap>
				</Box>
			</Box>
		</Box>
	)
}
