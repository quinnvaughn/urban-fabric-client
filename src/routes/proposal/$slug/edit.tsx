import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import type { ElementInstance } from "#/features/fabric/element-types/types"
import { ProposalFormPage } from "#/features/proposal"
import { GetProposalDocument, type GetProposalQuery } from "#/graphql/generated"

export const Route = createFileRoute("/proposal/$slug/edit")({
	component: RouteComponent,
	loader: ({ params, context }) => {
		const getProposalQuery = context.preloadQuery(GetProposalDocument, {
			variables: { slug: params.slug },
		})
		return { getProposalQuery }
	},
})

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

type Proposal = Extract<
	GetProposalQuery["proposalBySlug"],
	{ __typename: "Proposal" }
>

function EditProposal({ proposal }: { proposal: Proposal }) {
	const elements = proposal.snapshotElements as ElementInstance[]
	const navigate = Route.useNavigate()
	const published = proposal.publishedAt != null

	return (
		<ProposalFormPage
			mode="edit"
			proposalId={proposal.id}
			published={published}
			data={{
				topbarTitle: proposal.title,
				fabricId: proposal.fabricId,
				elements,
				center: {
					lat: proposal.snapshotCenter.lat,
					lng: proposal.snapshotCenter.lng,
				},
				zoom: proposal.snapshotZoom,
				initialThumbnail: "",
				initialValues: {
					title: proposal.title,
					description: proposal.description ?? "",
					categories: proposal.categories,
				},
			}}
			onPublishSuccess={(slug) =>
				navigate({ to: "/proposal/$slug", params: { slug } })
			}
			onUnauthorized={() => navigate({ to: "/login", replace: true })}
		/>
	)
}
