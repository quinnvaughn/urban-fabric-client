import { useMutation } from "@apollo/client/react"
import { Link } from "@tanstack/react-router"
import { ChevronRight, ExternalLink, EyeOff, Save, Send } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { match } from "ts-pattern"
import z from "zod"
import {
	BackButton,
	FabricComposition,
	FabricMap,
	StaticElementsLayer,
	ViewportSync,
} from "#/features/fabric"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { ThumbnailSync } from "#/features/fabric/thumbnail-sync"
import { ProposalPreviewModal } from "#/features/proposal/proposal-preview-modal"
import { PublishProposalMapHud } from "#/features/proposal/publish-proposal-map-hud/publish-proposal-map-hud"
import { PublishProposalMapTopbar } from "#/features/proposal/publish-proposal-map-topbar/publish-proposal-map-topbar"
import {
	Box,
	Button,
	ChipGroup,
	Divider,
	HStack,
	Input,
	Textarea,
	Tooltip,
	Typography,
	useToast,
	VStack,
} from "#/features/ui"
import {
	ProposalCategory,
	PublishProposalDocument,
	SaveDraftProposalDocument,
	UnpublishProposalDocument,
} from "#/graphql/generated"
import { useForm } from "#/lib/form"
import {
	formatLatitude,
	formatLongitude,
	isSameViewport,
	type Viewport,
} from "#/lib/geo"
import { useCurrentUser } from "#/lib/graphql/hooks/use-current-user"
import { enumValueToReadableLabel } from "#/lib/string"
import { css } from "#/styles/styled-system/css"

const TITLE_MAX_LENGTH = 80
const DESCRIPTION_MAX_LENGTH = 1500

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

type FormValues = z.infer<typeof schema>

export type ProposalFormData = {
	topbarTitle: string
	fabricId: string
	elements: ElementInstance[]
	center: { lat: number; lng: number }
	zoom: number
	initialThumbnail: string
	location?: { city: string; region: string; regionAbbr?: string | null }
	/** Link back to the fabric editor shown in the panel header. */
	fabricRef?: { id: string; title: string }
	initialValues: {
		title: string
		description: string
		categories: string[]
	}
}

export type ProposalFormPageProps =
	| {
			mode: "create"
			data: ProposalFormData
			onPublishSuccess: (slug: string) => void
			onUnauthorized: () => void
	  }
	| {
			mode: "edit"
			proposalId: string
			published: boolean
			data: ProposalFormData
			/** Called after a draft is published via the Publish button. */
			onPublishSuccess?: (slug: string) => void
			onUnauthorized: () => void
	  }

export function ProposalFormPage(props: ProposalFormPageProps) {
	const { data } = props
	const { elements } = data
	const { toast } = useToast()
	const [isSaving, setIsSaving] = useState(false)
	const [thumbnail, setThumbnail] = useState(data.initialThumbnail)
	const captureThumbnailRef = useRef<(() => Promise<string>) | null>(null)

	const [viewport, setViewport] = useState<Viewport>({
		zoom: data.zoom,
		center: { lat: data.center.lat, lng: data.center.lng },
	})

	const handleViewportChange = useCallback((next: Viewport) => {
		setViewport((prev) => (isSameViewport(prev, next) ? prev : next))
	}, [])

	const isPublished = props.mode === "edit" && props.published

	const [isPreviewOpen, setIsPreviewOpen] = useState(false)
	const { data: meData } = useCurrentUser()
	const creatorName = meData?.me?.name ?? ""

	const [saveDraftMutation] = useMutation(SaveDraftProposalDocument)
	const [publishProposalMutation] = useMutation(PublishProposalDocument)
	const [unpublishProposalMutation] = useMutation(UnpublishProposalDocument)

	const getThumbnailForSubmit = useCallback(async () => {
		const capture = captureThumbnailRef.current
		if (!capture) return thumbnail
		const freshThumbnail = await capture()
		setThumbnail(freshThumbnail)
		return freshThumbnail
	}, [thumbnail])

	async function saveDraft(values: FormValues) {
		const currentThumbnail = await getThumbnailForSubmit()
		const response = await saveDraftMutation({
			variables: {
				input: {
					fabricId: data.fabricId,
					title: values.title || undefined,
					description: values.description || undefined,
					categories: values.categories.length
						? (values.categories as ProposalCategory[])
						: undefined,
					elements: elements,
					center: { lat: viewport.center.lat, lng: viewport.center.lng },
					zoom: viewport.zoom,
					thumbnail: currentThumbnail,
				},
			},
		})
		match(response.data?.saveDraftProposal)
			.with({ __typename: "ForbiddenError" }, ({ message }) => {
				toast({ title: message, intent: "error" })
			})
			.with({ __typename: "UnauthorizedError" }, () => {
				props.onUnauthorized()
			})
			.with({ __typename: "NotFoundError" }, () => {
				toast({ title: "Fabric not found", intent: "error" })
			})
			.with({ __typename: "Proposal" }, () => {
				toast({ title: "Draft saved", intent: "success" })
			})
			.otherwise(() => {
				toast({ title: "An unexpected error occurred", intent: "error" })
			})
	}

	async function publishProposal(values: FormValues) {
		const currentThumbnail = await getThumbnailForSubmit()
		const response = await publishProposalMutation({
			variables: {
				input: {
					fabricId: data.fabricId,
					title: values.title,
					description: values.description,
					categories: values.categories as ProposalCategory[],
					elements: elements,
					center: { lat: viewport.center.lat, lng: viewport.center.lng },
					zoom: viewport.zoom,
					thumbnail: currentThumbnail,
				},
			},
		})
		match(response.data?.publishProposal)
			.with({ __typename: "ForbiddenError" }, () => {
				toast({
					title: "You don't have permission to publish",
					intent: "error",
				})
			})
			.with({ __typename: "UnauthorizedError" }, () => {
				props.onUnauthorized()
			})
			.with({ __typename: "NotFoundError" }, () => {
				toast({ title: "Fabric not found", intent: "error" })
			})
			.with({ __typename: "Proposal" }, ({ slug }) => {
				if (props.mode === "create") {
					props.onPublishSuccess(slug)
				} else {
					props.onPublishSuccess?.(slug)
				}
			})
			.otherwise(() => {
				toast({ title: "An unexpected error occurred", intent: "error" })
			})
	}

	async function unpublishProposal() {
		if (props.mode !== "edit") return
		const response = await unpublishProposalMutation({
			variables: { input: { id: props.proposalId } },
		})
		match(response.data?.unpublishProposal)
			.with({ __typename: "ForbiddenError" }, ({ message }) => {
				toast({ title: message, intent: "error" })
			})
			.with({ __typename: "UnauthorizedError" }, () => {
				props.onUnauthorized()
			})
			.with({ __typename: "NotFoundError" }, ({ message }) => {
				toast({ title: message, intent: "error" })
			})
			.with({ __typename: "Proposal" }, () => {
				toast({ title: "Proposal unpublished", intent: "success" })
			})
			.otherwise(() => {
				toast({ title: "An unexpected error occurred", intent: "error" })
			})
	}

	const form = useForm({
		defaultValues: {
			title: data.initialValues.title,
			description: data.initialValues.description,
			categories: data.initialValues.categories,
		},
		schema,
		onSubmit: async (values) => {
			await publishProposal(values)
		},
	})

	async function handleLeftButtonClick() {
		setIsSaving(true)
		try {
			if (isPublished) {
				await unpublishProposal()
			} else {
				await saveDraft(form.values())
			}
		} finally {
			setIsSaving(false)
		}
	}

	const eyebrow =
		props.mode === "create"
			? "New proposal"
			: isPublished
				? "Published Proposal"
				: "Draft"

	const panelTitle =
		props.mode === "create"
			? "Tell people what you built"
			: "Edit Proposal Details"

	const panelSubtext =
		props.mode === "create"
			? "A proposal is a public snapshot of your fabric. Give it a title and description so others understand what you're proposing and why."
			: isPublished
				? "Changes you save will update the live proposal immediately. Viewers will see the updated title, description, and map view."
				: "This proposal hasn't been published yet. Save your changes as a draft, or publish it to make it visible to others."

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
				<Box
					id="topbar-left"
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
					<Typography.Text
						size="sm"
						weight="semibold"
						color="stone.900"
						truncate
					>
						{data.topbarTitle}
					</Typography.Text>
				</Box>
				<form.Subscribe selector={(s) => s.values.title}>
					{(title) => (
						<Tooltip>
							<Tooltip.Trigger>
								<Button
									size="sm"
									appearance="outline"
									intent="neutral"
									type="button"
									disabled={!title.trim()}
									onClick={() => setIsPreviewOpen(true)}
								>
									<ExternalLink size={14} />
									Preview
								</Button>
							</Tooltip.Trigger>
							{!title.trim() && (
								<Tooltip.Content>Add a title to preview</Tooltip.Content>
							)}
						</Tooltip>
					)}
				</form.Subscribe>
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
				<form
					onSubmit={form.handleSubmit}
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
								letterSpacing="wider"
								transform="uppercase"
								weight="semibold"
							>
								{eyebrow}
							</Typography.Text>
							<Typography.Text
								font="serif"
								size="2xl"
								fontStyle="italic"
								weight="light"
							>
								{panelTitle}
							</Typography.Text>
							<Typography.Text size="sm" color="stone.600" lineHeight="relaxed">
								{panelSubtext}
							</Typography.Text>
							{data.fabricRef && (
								<Tooltip>
									<Tooltip.Trigger>
										<Link
											to="/fabric/$id"
											params={{ id: data.fabricRef.id }}
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
											<span>{data.fabricRef.title}</span>
											<ChevronRight size={10} aria-hidden="true" />
										</Link>
									</Tooltip.Trigger>
									<Tooltip.Content>Return to fabric editor</Tooltip.Content>
								</Tooltip>
							)}
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
						<Divider label="Proposal details" />
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
										{Object.values(ProposalCategory).map((category) => (
											<ChipGroup.Chip key={category} value={category}>
												{enumValueToReadableLabel(category)}
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
						<VStack gap="1" justify="center">
							<Typography.Text
								id="view-center-label"
								size="xs"
								color="stone.700"
								lineHeight="normal"
								weight="semibold"
							>
								Default view center
							</Typography.Text>
							<HStack id="coord-readout" align="center" gap="2.5">
								<Box
									id="coord-readout-value"
									className={css({
										fontVariantNumeric: "tabular-nums",
										userSelect: "none",
										background: "rgba(245, 242, 236, 0.4)",
										border: "1px dashed",
										borderColor: "stone.300",
										borderRadius: "md",
										flex: 1,
										py: "2",
										px: "3",
									})}
								>
									<Typography.Text
										lineHeight="none"
										size="sm"
										weight="normal"
										color="stone.700"
									>
										{`${formatLatitude(viewport.center.lat)}, ${formatLongitude(viewport.center.lng)}`}
									</Typography.Text>
								</Box>
								<Typography.Text
									id="coord-readout-zoom"
									size="xs"
									color="stone.500"
									className={css({ whiteSpace: "nowrap", flexShrink: 0 })}
								>
									Zoom:{" "}
									<Typography.Inline color="stone.800" weight="semibold">
										{viewport.zoom.toFixed(0)}
									</Typography.Inline>
								</Typography.Text>
							</HStack>
							<Typography.Text size="xxs" color="stone.500">
								Pan and zoom the map on the right to set what viewers see when
								they first open this proposal.
							</Typography.Text>
						</VStack>
						<FabricComposition elements={elements} />
					</Box>
					<Box
						className={css({
							flexShrink: 0,
							px: "7",
							py: "3.5",
							display: "flex",
							justifyContent: "flex",
							alignItems: "center",
							gap: "2.5",
						})}
						id="panel-footer"
					>
						<Box className={css({ flex: 1 })} id="panel-footer-left">
							<form.Subscribe selector={(s) => s.meta.isSubmitting}>
								{(isSubmitting) => (
									<Button
										size="sm"
										appearance="outline"
										intent={isPublished ? "danger" : "neutral"}
										type="button"
										disabled={isSaving || isSubmitting}
										onClick={handleLeftButtonClick}
									>
										{isPublished ? (
											<>
												<EyeOff size={14} />
												{isSaving ? "Unpublishing..." : "Unpublish"}
											</>
										) : (
											<>
												<Save size={14} />
												{isSaving ? "Saving..." : "Save draft"}
											</>
										)}
									</Button>
								)}
							</form.Subscribe>
						</Box>
						<form.Subscribe
							selector={(s) => [s.meta.canSubmit, s.meta.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									size="sm"
									intent="brand"
									type="submit"
									disabled={!canSubmit || isSubmitting || isSaving}
								>
									{isPublished ? (
										<>
											<Save size={14} />
											{isSubmitting ? "Saving..." : "Save Changes"}
										</>
									) : (
										<>
											<Send size={14} />
											{isSubmitting ? "Publishing..." : "Publish"}
										</>
									)}
								</Button>
							)}
						</form.Subscribe>
					</Box>
				</form>
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
						<ThumbnailSync
							onThumbnail={async (t) => setThumbnail(t)}
							onCaptureReady={(capture) => {
								captureThumbnailRef.current = capture
							}}
						/>
						<ViewportSync
							viewport={viewport}
							onViewportChange={handleViewportChange}
						/>
						<PublishProposalMapTopbar />
						<PublishProposalMapHud
							currentViewport={{
								center: [viewport.center.lng, viewport.center.lat],
								zoom: viewport.zoom,
							}}
							fabricViewport={{
								center: [data.center.lng, data.center.lat],
								zoom: data.zoom,
							}}
						/>
					</FabricMap>
				</Box>
			</Box>
			<form.Subscribe selector={(s) => s.values}>
				{(values) => (
					<ProposalPreviewModal
						open={isPreviewOpen}
						onClose={() => setIsPreviewOpen(false)}
						data={{
							title: values.title,
							description: values.description,
							categories: values.categories,
							elements,
							center: viewport.center,
							zoom: viewport.zoom,
							location: data.location,
							creatorName,
						}}
					/>
				)}
			</form.Subscribe>
		</Box>
	)
}
