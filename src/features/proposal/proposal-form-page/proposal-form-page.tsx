import type { ApolloCache } from "@apollo/client"
import { useApolloClient, useMutation } from "@apollo/client/react"
import { Link } from "@tanstack/react-router"
import { ChevronRight, ExternalLink, EyeOff, Save, Send } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { match } from "ts-pattern"
import z from "zod"
import {
	BackButton,
	Buildings3DLayer,
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
import { FieldLabel } from "#/features/ui/field"
import {
	type MapStyle,
	ProposalByFabricIdDocument,
	ProposalCategory,
	ProposalPhotoGroup,
	type ProposalPhotoInput,
	PublishProposalDocument,
	SaveDraftProposalDocument,
	UnpublishProposalDocument,
} from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import {
	addProposalToMyProposalsCache,
	adjustMyDashboardStatsCache,
	evictFabricListCaches,
	setFabricProposalInCache,
} from "#/lib/apollo"
import { useForm } from "#/lib/form"
import {
	formatLatitude,
	formatLongitude,
	isSameViewport,
	type Viewport,
} from "#/lib/geo"
import { useCurrentUser } from "#/lib/graphql/hooks/use-current-user"
import { enumValueToReadableLabel } from "#/lib/string"
import {
	uploadFabricThumbnail,
	uploadProposalThumbnail,
} from "#/lib/upload/thumbnail-upload"
import { css } from "#/styles/styled-system/css"
import {
	type ProposalFormPhoto,
	ProposalPhotoField,
} from "./proposal-photo-field"

const TITLE_MAX_LENGTH = 80
const DESCRIPTION_MIN_LENGTH = 150

const proposalPhotoSchema = z.object({
	id: z.string().optional(),
	url: z.string(),
	caption: z.string().optional(),
})

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
		.min(
			DESCRIPTION_MIN_LENGTH,
			`Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`,
		),
	categories: z.array(z.string()),
	existingConditionPhotos: z.array(proposalPhotoSchema),
	inspirationPhotos: z.array(proposalPhotoSchema),
})

type FormValues = z.infer<typeof schema>

export type ProposalFormData = {
	topbarTitle: string
	fabricId: string
	elements: ElementInstance[]
	center: { lat: number; lng: number }
	zoom: number
	mapStyle: MapStyle
	isIn3DMode: boolean
	initialThumbnail: string
	location?: { city: string; region: string; regionAbbr?: string | null }
	/** Link back to the fabric editor shown in the panel header. */
	fabricRef?: { id: string; title: string }
	initialValues: {
		title: string
		description: string
		categories: string[]
		existingConditionPhotos?: ProposalFormPhoto[]
		inspirationPhotos?: ProposalFormPhoto[]
	}
}

export type ProposalFormPageProps =
	| {
			mode: "create"
			data: ProposalFormData
			onPublishSuccess: (slug: string, title: string) => void
			onUnauthorized: () => void
	  }
	| {
			mode: "edit"
			proposalId: string
			published: boolean
			data: ProposalFormData
			/** Called after a draft is published via the Publish button. */
			onPublishSuccess?: (slug: string, title: string) => void
			onUnauthorized: () => void
	  }

export function ProposalFormPage(props: ProposalFormPageProps) {
	const { data } = props
	const { elements } = data
	const { toast } = useToast()
	const client = useApolloClient()
	const [isSaving, setIsSaving] = useState(false)
	const [thumbnail, setThumbnail] = useState(data.initialThumbnail)
	const [hasProposalUploadTarget, setHasProposalUploadTarget] = useState(
		props.mode === "edit",
	)
	const captureThumbnailRef = useRef<(() => Promise<string>) | null>(null)

	const [viewport, setViewport] = useState<Viewport>({
		zoom: data.zoom,
		center: { lat: data.center.lat, lng: data.center.lng },
	})
	const [snapshotIsIn3DMode, setSnapshotIsIn3DMode] = useState(data.isIn3DMode)

	const handleViewportChange = useCallback((next: Viewport) => {
		setViewport((prev) => (isSameViewport(prev, next) ? prev : next))
	}, [])

	const isPublished = props.mode === "edit" && props.published

	const [isPreviewOpen, setIsPreviewOpen] = useState(false)
	const { user } = useCurrentUser()
	const creatorName = user?.name ?? ""

	const [saveDraftMutation] = useMutation(SaveDraftProposalDocument)
	const [publishProposalMutation] = useMutation(PublishProposalDocument)
	const [unpublishProposalMutation] = useMutation(UnpublishProposalDocument)
	const { capture } = useAnalytics()

	function evictProposalListCaches(cache: ApolloCache) {
		cache.evict({ fieldName: "exploreProposals" })
		cache.evict({ fieldName: "followingProposals" })
		cache.evict({ fieldName: "myProposals" })
		evictFabricListCaches(cache)
	}

	function buildPhotoInputs(values: FormValues): ProposalPhotoInput[] {
		return [
			...values.existingConditionPhotos.map((photo) => ({
				url: photo.url,
				caption: photo.caption || undefined,
				group: ProposalPhotoGroup.ExistingConditions,
			})),
			...values.inspirationPhotos.map((photo) => ({
				url: photo.url,
				caption: photo.caption || undefined,
				group: ProposalPhotoGroup.Inspirations,
			})),
		]
	}

	const getThumbnailForSubmit = useCallback(async () => {
		const capture = captureThumbnailRef.current
		if (!capture) return thumbnail
		try {
			const freshThumbnail = await capture()
			if (!freshThumbnail) return thumbnail
			setThumbnail(freshThumbnail)
			return freshThumbnail
		} catch {
			toast({
				title:
					"Could not upload the latest map image, using the current one instead",
				intent: "error",
			})
			return thumbnail
		}
	}, [thumbnail, toast])

	const uploadThumbnail = useCallback(
		async (blob: Blob) => {
			if (hasProposalUploadTarget) {
				return uploadProposalThumbnail(client, blob)
			}

			return uploadFabricThumbnail(client, blob)
		},
		[client, hasProposalUploadTarget],
	)

	async function saveDraft(values: FormValues) {
		const currentThumbnail = await getThumbnailForSubmit()
		const fabricId = data.fabricId
		const isCreateMode = props.mode === "create"
		const response = await saveDraftMutation({
			variables: {
				input: {
					fabricId,
					title: values.title || undefined,
					description: values.description || undefined,
					categories: values.categories.length
						? (values.categories as ProposalCategory[])
						: undefined,
					elements: elements,
					photos: buildPhotoInputs(values),
					center: { lat: viewport.center.lat, lng: viewport.center.lng },
					zoom: viewport.zoom,
					mapStyle: data.mapStyle,
					isIn3DMode: snapshotIsIn3DMode,
					thumbnail: currentThumbnail,
				},
			},
			update(cache, { data: mutationData }) {
				if (mutationData?.saveDraftProposal.__typename !== "Proposal") return
				const proposal = mutationData.saveDraftProposal
				if (isCreateMode) {
					addProposalToMyProposalsCache(cache, proposal)
					adjustMyDashboardStatsCache(cache, {
						proposalDelta: 1,
						unpublishedProposalDelta: 1,
					})
					setFabricProposalInCache(cache, fabricId, {
						id: proposal.id,
						isPublished: proposal.isPublished,
					})
					cache.writeQuery({
						query: ProposalByFabricIdDocument,
						variables: { fabricId },
						data: {
							__typename: "Query" as const,
							proposalByFabricId: {
								__typename: "Proposal" as const,
								id: proposal.id,
								slug: proposal.slug,
							},
						},
					})
				}
				evictProposalListCaches(cache)
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
				setHasProposalUploadTarget(true)
				capture("draft_saved")
				toast({ title: "Draft saved", intent: "success" })
			})
			.otherwise(() => {
				toast({ title: "An unexpected error occurred", intent: "error" })
			})
	}

	async function publishProposal(values: FormValues) {
		const currentThumbnail = await getThumbnailForSubmit()
		const fabricId = data.fabricId
		const isCreateMode = props.mode === "create"
		const response = await publishProposalMutation({
			variables: {
				input: {
					fabricId,
					title: values.title,
					description: values.description,
					categories: values.categories as ProposalCategory[],
					elements: elements,
					photos: buildPhotoInputs(values),
					center: { lat: viewport.center.lat, lng: viewport.center.lng },
					zoom: viewport.zoom,
					mapStyle: data.mapStyle,
					isIn3DMode: snapshotIsIn3DMode,
					thumbnail: currentThumbnail,
				},
			},
			update(cache, { data: mutationData }) {
				if (mutationData?.publishProposal.__typename !== "Proposal") return
				const proposal = mutationData.publishProposal
				if (isCreateMode) {
					addProposalToMyProposalsCache(cache, proposal)
					adjustMyDashboardStatsCache(cache, {
						proposalDelta: 1,
					})
					setFabricProposalInCache(cache, fabricId, {
						id: proposal.id,
						isPublished: proposal.isPublished,
					})
					cache.writeQuery({
						query: ProposalByFabricIdDocument,
						variables: { fabricId },
						data: {
							__typename: "Query",
							proposalByFabricId: {
								__typename: "Proposal",
								id: proposal.id,
								slug: proposal.slug,
							},
						},
					})
				} else if (props.mode === "edit" && !props.published) {
					adjustMyDashboardStatsCache(cache, {
						unpublishedProposalDelta: -1,
					})
				}
				evictProposalListCaches(cache)
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
			.with({ __typename: "Proposal" }, ({ slug, title }) => {
				setHasProposalUploadTarget(true)
				capture("proposal_published")
				if (props.mode === "create") {
					props.onPublishSuccess(slug, title)
				} else {
					props.onPublishSuccess?.(slug, title)
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
			update(cache, { data: mutationData }) {
				if (mutationData?.unpublishProposal.__typename !== "Proposal") return
				adjustMyDashboardStatsCache(cache, {
					unpublishedProposalDelta: 1,
				})
			},
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
			existingConditionPhotos: data.initialValues.existingConditionPhotos ?? [],
			inspirationPhotos: data.initialValues.inspirationPhotos ?? [],
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
						<Tooltip placement="bottom-end">
							<Tooltip.Trigger>
								<span
									className={css({
										cursor: !title.trim() ? "not-allowed" : "pointer",
									})}
								>
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
								</span>
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
										Description
										<Textarea.Counter
											current={field.value.length}
											min={DESCRIPTION_MIN_LENGTH}
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
						<Divider label="Photos (optional)" />
						<VStack gap="2">
							<VStack gap="1.5" justify="center">
								<HStack justify="space-between" fullWidth>
									<FieldLabel>Existing conditions</FieldLabel>
									<Typography.Text color="stone.400" size="xxs">
										What's there now
									</Typography.Text>
								</HStack>
								<Typography.Text size="xxs" color="stone.500">
									Street-level photos that show the current problem — the
									missing sidewalk, the dangerous intersection, the empty lot.
								</Typography.Text>
								<form.Field name="existingConditionPhotos">
									{(field) => (
										<ProposalPhotoField
											group={ProposalPhotoGroup.ExistingConditions}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								</form.Field>
							</VStack>
							<VStack gap="1.5" justify="center">
								<HStack justify="space-between" fullWidth>
									<FieldLabel>Inspiration & references</FieldLabel>
									<Typography.Text color="stone.400" size="xxs">
										What it could look like
									</Typography.Text>
								</HStack>
								<Typography.Text size="xxs" color="stone.500">
									Photos from other cities, before/afters, renders, or advocacy
									graphics that show this has been done before.
								</Typography.Text>
								<form.Field name="inspirationPhotos">
									{(field) => (
										<ProposalPhotoField
											group={ProposalPhotoGroup.Inspirations}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								</form.Field>
							</VStack>
						</VStack>
						<Divider label="Map view" />
						<VStack gap="1" justify="center">
							<FieldLabel>Default view center</FieldLabel>
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
						<label
							className={css({
								display: "flex",
								alignItems: "start",
								gap: "3",
								cursor: "pointer",
								userSelect: "none",
							})}
						>
							<input
								type="checkbox"
								checked={snapshotIsIn3DMode}
								onChange={(event) =>
									setSnapshotIsIn3DMode(event.currentTarget.checked)
								}
								className={css({
									width: "4",
									height: "4",
									marginTop: "0.5",
									accentColor: "brand.default",
									flexShrink: 0,
								})}
							/>
							<VStack gap="0.5">
								<FieldLabel>Open proposal in 3D mode</FieldLabel>
								<Typography.Text size="xxs" color="stone.500">
									Viewers will still be able to switch modes after opening the
									proposal.
								</Typography.Text>
							</VStack>
						</label>
						<FabricComposition elements={elements} />
					</Box>
					<Box
						className={css({
							flexShrink: 0,
							px: "7",
							py: "3.5",
							display: "flex",
							justifyContent: "space-between",
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
						mapStyle={data.mapStyle}
					>
						<Buildings3DLayer enabled={snapshotIsIn3DMode} />
						<StaticElementsLayer elements={elements} />
						<ThumbnailSync
							onThumbnail={uploadThumbnail}
							onCaptureReady={(capture) => {
								captureThumbnailRef.current = capture
							}}
							captureSignal={snapshotIsIn3DMode}
							elements={elements}
						/>
						<ViewportSync
							viewport={viewport}
							onViewportChange={handleViewportChange}
						/>
						<PublishProposalMapTopbar />
						<PublishProposalMapHud
							is3DMode={snapshotIsIn3DMode}
							onToggle3DMode={() => setSnapshotIsIn3DMode((value) => !value)}
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
							isIn3DMode: snapshotIsIn3DMode,
							location: data.location,
							creatorName,
						}}
					/>
				)}
			</form.Subscribe>
		</Box>
	)
}
