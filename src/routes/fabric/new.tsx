import { useApolloClient, useMutation } from "@apollo/client/react"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react"
import { match } from "ts-pattern"
import { FabricEditor, FabricEditorSkeleton } from "#/features/fabric"
import {
	type GuestFabric,
	getOrCreateGuestFabric,
	localStorageHandler,
	readGuestFabric,
	updateGuestFabric,
} from "#/features/fabric/element-types/types"
import {
	useFabricPersistence,
	useFabricStore,
} from "#/features/fabric/fabric-store"
import { useGettingStartedModal } from "#/features/modals/getting-started-modal"
import { MobileGate, NudgeCard } from "#/features/ui"
import { CreateFabricDocument, MapStyle, MeDocument } from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import {
	addFabricToMyFabricsCache,
	adjustMyDashboardFabricCountCache,
} from "#/lib/apollo"
import { getLocationFromIp } from "#/lib/geo"
import { openModal } from "#/stores"

const GUEST_FABRIC_KEY = "guest-fabric"

export const Route = createFileRoute("/fabric/new")({
	component: RouteComponent,
	pendingComponent: FabricEditorSkeleton,
	loader: async ({ context }) => {
		const response = context.apolloClient.readQuery({
			query: MeDocument,
		})
		// if user is logged in, generate a fabric and redirect to it
		if (response?.me) {
			const center = await getLocationFromIp()
			const fabricResponse = await context.apolloClient.mutate({
				mutation: CreateFabricDocument,
				variables: {
					input: {
						center,
					},
				},
				update(cache, { data }) {
					if (data?.createFabric.__typename !== "Fabric") return
					addFabricToMyFabricsCache(cache, data.createFabric)
					adjustMyDashboardFabricCountCache(cache, 1)
				},
			})
			const result = fabricResponse.data?.createFabric
			return match(result)
				.with({ __typename: "UnauthorizedError" }, () => {
					throw redirect({ to: "/login", replace: true })
				})
				.with({ __typename: "Fabric" }, ({ id }) => {
					throw redirect({ to: `/fabric/$id`, params: { id }, replace: true })
				})
				.with(undefined, () => {
					throw redirect({ to: "/login", replace: true })
				})
				.exhaustive()
		}
		const center = await getLocationFromIp()
		return { center }
	},
})

function RouteComponent() {
	const { center } = Route.useLoaderData()
	const fabricRef = useRef<ReturnType<typeof getOrCreateGuestFabric> | null>(
		null,
	)

	const fabric = useSyncExternalStore(
		() => () => {},
		() => {
			if (!fabricRef.current) {
				fabricRef.current = getOrCreateGuestFabric(center, GUEST_FABRIC_KEY)
			}
			return fabricRef.current
		},
		() => null,
	)

	if (!fabric) return null
	return (
		<MobileGate>
			<Editor fabric={fabric} />
		</MobileGate>
	)
}

function Editor({ fabric }: { fabric: GuestFabric }) {
	const handler = useMemo(() => localStorageHandler(GUEST_FABRIC_KEY), [])
	const { initElements, elements } = useFabricStore()
	const showNudge = elements.length >= 3 && !fabric.nudgeDismissed
	useGettingStartedModal()
	const client = useApolloClient()
	const navigate = useNavigate()
	const [createFabric] = useMutation(CreateFabricDocument)
	const { capture } = useAnalytics()

	useEffect(() => {
		capture("fabric_created")
	}, [capture])

	useEffect(() => {
		if (showNudge) {
			capture("nudge_shown")
		}
	}, [showNudge, capture])

	useEffect(() => {
		let cancelled = false

		void handler.load?.().then((elements) => {
			if (cancelled) return
			initElements(elements)
		})

		return () => {
			cancelled = true
		}
	}, [handler, initElements])

	async function migrateGuestFabric() {
		const guest = readGuestFabric(GUEST_FABRIC_KEY)
		if (!guest) return null

		const fabricResult = await createFabric({
			variables: {
				input: {
					center: guest.center,
					zoom: guest.zoom,
					title: guest.title,
					elements: guest.elements,
					thumbnail: guest.thumbnail,
					mapStyle: guest.mapStyle,
				},
			},
		})

		const created = fabricResult.data?.createFabric
		if (created?.__typename !== "Fabric") return null

		localStorage.removeItem(GUEST_FABRIC_KEY)
		await client.resetStore()
		return created.id
	}

	function openAuthModal(intent: "save" | "publish" | "nudge") {
		const source = intent === "publish" ? "publish" : intent === "nudge" ? "nudge" : "save_draft"
		capture("signup_started", { source })
		openModal("auth", {
			title:
				intent === "publish"
					? "Create an account to publish"
					: "Save your fabric to your account",
			source,
			onAuthSuccess: async () => {
				const id = await migrateGuestFabric()
				if (!id) return
				if (intent === "publish") {
					navigate({ to: "/fabric/$id/publish", params: { id }, replace: true })
				} else {
					navigate({ to: "/fabric/$id", params: { id }, replace: true })
				}
			},
		})
	}

	useFabricPersistence(handler)
	return (
		<FabricEditor
			id={fabric.id}
			title={fabric.title}
			center={[fabric.center.lng, fabric.center.lat]}
			zoom={fabric.zoom}
			initialMapStyle={fabric.mapStyle ?? MapStyle.Default}
			hasProposal={false}
			onTitleSave={async (t) => {
				updateGuestFabric(
					(existing) => ({ ...existing, title: t }),
					GUEST_FABRIC_KEY,
				)
			}}
			onMapStyleChange={(style) => {
				updateGuestFabric(
					(existing) => ({ ...existing, mapStyle: style }),
					GUEST_FABRIC_KEY,
				)
			}}
			onViewportChange={async ({ center, zoom }) => {
				updateGuestFabric(
					(existing) => ({ ...existing, center, zoom }),
					GUEST_FABRIC_KEY,
				)
			}}
			onThumbnail={async (thumbnail) => {
				updateGuestFabric(
					(existing) => ({ ...existing, thumbnail }),
					GUEST_FABRIC_KEY,
				)
			}}
			onPublish={() => openAuthModal("publish")}
			onSave={() => openAuthModal("save")}
			nudge={
				showNudge ? (
					<NudgeCard
						title="Want others to see this?"
						description="Save your progress and share your ideas with your community."
						primaryAction={{
							label: "Create a free account",
							onClick: () => openAuthModal("save"),
						}}
						secondaryAction={{
							label: "Keep editing",
							onClick: () => {
								updateGuestFabric(
									(existing) => ({ ...existing, nudgeDismissed: true }),
									GUEST_FABRIC_KEY,
								)
							},
						}}
						onDismiss={() => {
							updateGuestFabric(
								(existing) => ({ ...existing, nudgeDismissed: true }),
								GUEST_FABRIC_KEY,
							)
						}}
					/>
				) : null
			}
		/>
	)
}
