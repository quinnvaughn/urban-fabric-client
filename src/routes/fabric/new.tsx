import { useApolloClient, useMutation } from "@apollo/client/react"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { useAnalytics } from "#/lib/analytics"
import { match } from "ts-pattern"
import {
	DrawingLayer,
	EditorCommandPalette,
	EditorHUD,
	EditorTopbar,
	ElementPanel,
	FabricMap,
	PropertiesPanel,
	SelectLayer,
	ViewportTracker,
} from "#/features/fabric"
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
import { ThumbnailSync } from "#/features/fabric/thumbnail-sync"
import { MobileGate } from "#/features/ui"
import { CreateFabricDocument, MapStyle, MeDocument } from "#/graphql/generated"
import {
	addFabricToMyFabricsCache,
	adjustMyDashboardFabricCountCache,
} from "#/lib/apollo"
import { getLocationFromIp } from "#/lib/geo"
import { openModal } from "#/stores"

const GUEST_FABRIC_KEY = "guest-fabric"

export const Route = createFileRoute("/fabric/new")({
	component: RouteComponent,
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
	const { initElements } = useFabricStore()
	useGettingStartedModal()
	const client = useApolloClient()
	const navigate = useNavigate()
	const [createFabric] = useMutation(CreateFabricDocument)
	const { capture } = useAnalytics()
	const [mapStyle, setMapStyle] = useState(fabric.mapStyle ?? MapStyle.Default)

	useEffect(() => {
		capture("fabric_created")
	}, [capture])

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
				},
			},
		})

		const created = fabricResult.data?.createFabric
		if (created?.__typename !== "Fabric") return null

		localStorage.removeItem(GUEST_FABRIC_KEY)
		await client.resetStore()
		return created.id
	}

	function openAuthModal(intent: "save" | "publish") {
		capture("signup_started", {
			source: intent === "publish" ? "publish" : "save_draft",
		})
		openModal("auth", {
			title:
				intent === "publish"
					? "Create an account to publish"
					: "Save your fabric to your account",
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
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<EditorTopbar
				id={fabric.id}
				title={fabric.title}
				hasProposal={false}
				onTitleSave={async (t) => {
					updateGuestFabric(
						(existing) => ({ ...existing, title: t }),
						GUEST_FABRIC_KEY,
					)
				}}
				onPublish={() => openAuthModal("publish")}
				onSave={() => openAuthModal("save")}
				mapStyle={mapStyle}
				onMapStyleChange={(style) => {
					setMapStyle(style)
					updateGuestFabric(
						(existing) => ({ ...existing, mapStyle: style }),
						GUEST_FABRIC_KEY,
					)
				}}
			/>
			<ElementPanel />
			<PropertiesPanel />
			<EditorCommandPalette />
			<FabricMap
				center={[fabric.center.lng, fabric.center.lat]}
				zoom={fabric.zoom}
				bearing={0}
				mapStyle={mapStyle}
			>
				<DrawingLayer />
				<SelectLayer />
				<ViewportTracker
					onViewportChange={async ({ center, zoom }) => {
						updateGuestFabric(
							(existing) => ({ ...existing, center, zoom }),
							GUEST_FABRIC_KEY,
						)
					}}
				/>
				<ThumbnailSync
					onThumbnail={async (thumbnail) => {
						updateGuestFabric(
							(existing) => ({ ...existing, thumbnail }),
							GUEST_FABRIC_KEY,
						)
					}}
				/>
				<EditorHUD />
			</FabricMap>
		</div>
	)
}
