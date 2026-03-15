import { useApolloClient, useMutation } from "@apollo/client/react"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import {
	useEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from "react"
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
import { AuthModal } from "#/features/modals/auth-modal"
import { CreateFabricDocument, MeDocument } from "#/graphql/generated"

const getLocationFromIp = createServerFn({ method: "GET" }).handler(
	async () => {
		const ip =
			getRequestHeader("x-forwarded-for") ?? getRequestHeader("x-real-ip") ?? ""
		if (!ip) {
			return { lat: 34.0195, lng: -118.4912 } // default to Santa Monica in dev
		}
		const res = await fetch(
			`https://api.ipwho.org/${ip}?apiKey=${process.env.IP_WHO_KEY}`,
		)
		console.log("IP Geolocation response:", await res.clone().text()) // Log the raw response for debugging
		const { lat, lon } = await res.json()
		return { lat, lng: lon }
	},
)

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
	return <Editor fabric={fabric} />
}

function Editor({ fabric }: { fabric: GuestFabric }) {
	const handler = useMemo(() => localStorageHandler(GUEST_FABRIC_KEY), [])
	const initElements = useFabricStore((state) => state.initElements)
	const client = useApolloClient()
	const navigate = useNavigate()
	const [createFabric] = useMutation(CreateFabricDocument)

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

	const [isAuthModalOpen, setAuthModalOpen] = useState(false)

	async function handleAuthSuccess() {
		const guest = readGuestFabric(GUEST_FABRIC_KEY)
		if (!guest) return

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
		if (created?.__typename !== "Fabric") return

		const { id } = created

		localStorage.removeItem(GUEST_FABRIC_KEY)
		await client.resetStore()
		navigate({ to: "/fabric/$id/publish", params: { id }, replace: true })
	}

	useFabricPersistence(handler)
	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<EditorTopbar
				id={fabric.id}
				title={fabric.title}
				onTitleSave={async (t) => {
					updateGuestFabric(
						(existing) => ({ ...existing, title: t }),
						GUEST_FABRIC_KEY,
					)
				}}
				onPublish={() => setAuthModalOpen(true)}
			/>
			<ElementPanel />
			<PropertiesPanel />
			<EditorCommandPalette />
			<FabricMap
				center={[fabric.center.lng, fabric.center.lat]}
				zoom={fabric.zoom}
				bearing={0}
			>
				<DrawingLayer />
				<SelectLayer />
				<ViewportTracker
					onViewportChange={async ({ center, zoom, thumbnail }) => {
						updateGuestFabric(
							(existing) => ({ ...existing, center, zoom, thumbnail }),
							GUEST_FABRIC_KEY,
						)
					}}
				/>
				<EditorHUD />
			</FabricMap>
			<AuthModal
				open={isAuthModalOpen}
				onClose={() => setAuthModalOpen(false)}
				onAuthSuccess={handleAuthSuccess}
			/>
		</div>
	)
}
