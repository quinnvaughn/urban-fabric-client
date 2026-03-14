import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { useRef, useSyncExternalStore } from "react"
import { match } from "ts-pattern"
import {
	DrawingLayer,
	EditorHUD,
	EditorTopbar,
	ElementPanel,
	FabricMap,
	PropertiesPanel,
	SelectLayer,
	ViewportTracker,
} from "#/features/fabric"
import { localStorageHandler } from "#/features/fabric/element-types/types"
import { useFabricPersistence } from "#/features/fabric/fabric-store"
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

type GuestFabric = {
	id: string
	title: string
	center: { lat: number; lng: number }
	zoom: number
	bearing: number
}

function getOrCreateGuestFabric(center: {
	lat: number
	lng: number
}): GuestFabric {
	const existing = localStorage.getItem(GUEST_FABRIC_KEY)
	if (existing) return JSON.parse(existing)
	const fabric = {
		id: crypto.randomUUID(),
		title: "Untitled Fabric",
		center,
		zoom: 15,
		bearing: 0,
	}
	localStorage.setItem(GUEST_FABRIC_KEY, JSON.stringify(fabric))
	return fabric
}

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
				fabricRef.current = getOrCreateGuestFabric(center)
			}
			return fabricRef.current
		},
		() => null,
	)

	if (!fabric) return null
	return <Editor fabric={fabric} />
}

function Editor({ fabric }: { fabric: GuestFabric }) {
	const handler = localStorageHandler(fabric.id)
	useFabricPersistence(handler)
	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<EditorTopbar
				id={fabric.id}
				title={fabric.title}
				onTitleSave={async (t) => {
					const existing = JSON.parse(
						localStorage.getItem(GUEST_FABRIC_KEY) ?? "{}",
					)
					localStorage.setItem(
						GUEST_FABRIC_KEY,
						JSON.stringify({ ...existing, title: t }),
					)
				}}
			/>
			<ElementPanel />
			<PropertiesPanel />
			<FabricMap
				center={[fabric.center.lng, fabric.center.lat]}
				zoom={fabric.zoom}
				bearing={fabric.bearing}
			>
				<DrawingLayer />
				<SelectLayer />
				<ViewportTracker
					onViewportChange={async ({ center, zoom, bearing }) => {
						const existing = JSON.parse(
							localStorage.getItem(GUEST_FABRIC_KEY) ?? "{}",
						)
						localStorage.setItem(
							GUEST_FABRIC_KEY,
							JSON.stringify({ ...existing, center, zoom, bearing }),
						)
					}}
				/>
				<EditorHUD />
			</FabricMap>
		</div>
	)
}
