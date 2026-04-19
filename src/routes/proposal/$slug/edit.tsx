import { useQuery, useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { NotFoundView } from "#/features/errors"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { ProposalFormPage } from "#/features/proposal"
import { MobileGate } from "#/features/ui"
import {
	GetFabricDocument,
	type GetFabricQuery,
	GetProposalForEditDocument,
	type GetProposalForEditQuery,
} from "#/graphql/generated"
import { openModal } from "#/stores"

export const Route = createFileRoute("/proposal/$slug/edit")({
	component: RouteComponent,
	loader: ({ params, context }) => {
		const getProposalQuery = context.preloadQuery(GetProposalForEditDocument, {
			variables: { slug: params.slug },
		})
		return { getProposalQuery }
	},
})

type Proposal = Extract<
	GetProposalForEditQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>
type Fabric = Extract<GetFabricQuery["fabric"], { __typename: "Fabric" }>

function RouteComponent() {
	const { getProposalQuery } = Route.useLoaderData()
	const { data } = useReadQuery(getProposalQuery)

	if (
		!data?.proposalBySlug ||
		data.proposalBySlug.__typename === "NotFoundError"
	) {
		return <NotFoundView />
	}

	return <EditProposal proposal={data.proposalBySlug} />
}

function EditProposal({ proposal }: { proposal: Proposal }) {
	const { data: fabricData } = useQuery(GetFabricDocument, {
		variables: { fabricId: proposal.fabricId },
	})

	if (!fabricData) return null
	if (fabricData.fabric.__typename !== "Fabric") {
		return <div>Fabric not found</div>
	}

	return <EditProposalForm proposal={proposal} fabric={fabricData.fabric} />
}

function EditProposalForm({
	proposal,
	fabric,
}: {
	proposal: Proposal
	fabric: Fabric
}) {
	const elements = Array.isArray(proposal.snapshotElements)
		? (proposal.snapshotElements as ElementInstance[])
		: (fabric.elements as ElementInstance[])
	const navigate = Route.useNavigate()

	return (
		<MobileGate size="lg">
			<ProposalFormPage
				mode="edit"
				proposalId={proposal.id}
				published={proposal.isPublished}
				data={{
					topbarTitle: proposal.title,
					fabricId: proposal.fabricId,
					elements,
					center: {
						lat: proposal.snapshotCenter.lat,
						lng: proposal.snapshotCenter.lng,
					},
					zoom: proposal.snapshotZoom,
					mapStyle: proposal.snapshotMapStyle,
					isIn3DMode: proposal.snapshotIsIn3DMode ?? fabric.isIn3DMode,
					initialThumbnail: proposal.snapshotThumbnail,
					initialValues: {
						title: proposal.title,
						description: proposal.description ?? "",
						categories: proposal.categories,
						existingConditionPhotos: proposal.existingConditionPhotos.map(
							(photo) => ({
								id: photo.id,
								url: photo.url,
								caption: photo.caption ?? "",
							}),
						),
						inspirationPhotos: proposal.inspirationPhotos.map((photo) => ({
							id: photo.id,
							url: photo.url,
							caption: photo.caption ?? "",
						})),
					},
				}}
				onPublishSuccess={(slug, title) => {
					navigate({
						to: "/proposal/$slug",
						params: { slug },
						search: {
							tab: undefined,
							comment: undefined,
							parent: undefined,
						},
					}).then(() => {
						setTimeout(() => {
							openModal("shareProposal", {
								link: `${window.location.origin}/proposal/${slug}`,
								title,
								eyebrow: "Your proposal is live!",
								description:
									"Share it with your community to get as many eyes on it as possible.",
								source: "post_update",
							})
						}, 600)
					})
				}}
				onUnauthorized={() => navigate({ to: "/login", replace: true })}
			/>
		</MobileGate>
	)
}
