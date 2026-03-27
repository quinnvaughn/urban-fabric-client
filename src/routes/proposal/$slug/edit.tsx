import { useQuery, useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
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
		return <div>Proposal not found</div>
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
}: { proposal: Proposal; fabric: Fabric }) {
	const elements = fabric.elements as ElementInstance[]
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
						lat: fabric.center.lat,
						lng: fabric.center.lng,
					},
					zoom: fabric.zoom,
					mapStyle: fabric.mapStyle,
					initialThumbnail: "",
					initialValues: {
						title: proposal.title,
						description: proposal.description ?? "",
						categories: proposal.categories,
					},
				}}
				onPublishSuccess={(slug, title) => {
					navigate({ to: "/proposal/$slug", params: { slug } }).then(() => {
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
