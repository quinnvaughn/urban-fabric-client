import { useMutation } from "@apollo/client/react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Copy, EllipsisVertical, MapPin, Trash } from "lucide-react"
import { DateTime } from "luxon"
import { match } from "ts-pattern"
import {
	Badge,
	Card,
	HStack,
	Menu,
	Typography,
	useToast,
	VStack,
} from "#/features/ui"
import {
	CreateFabricDocument,
	DeleteFabricDocument,
	type FabricCardFragment,
} from "#/graphql/generated"
import {
	addFabricToMyFabricsCache,
	removeFabricFromMyFabricsCache,
} from "#/lib/apollo"
import { css, cx } from "#/styles/styled-system/css"

type Props = {
	fabric: FabricCardFragment
}

export function FabricCard({
	fabric: {
		center,
		elements,
		id,
		title,
		zoom,
		locationCity,
		locationRegion,
		locationRegionAbbr,
		thumbnail,
		updatedAt,
		proposal,
		__typename,
	},
}: Props) {
	const [duplicateFabric] = useMutation(CreateFabricDocument)
	const [deleteFabric] = useMutation(DeleteFabricDocument)
	const navigate = useNavigate()
	const toast = useToast()

	async function handleDuplicate() {
		const response = await duplicateFabric({
			variables: {
				input: {
					center: {
						lat: center.lat,
						lng: center.lng,
					},
					elements,
					thumbnail,
					title,
					zoom,
				},
			},
			update(cache, { data }) {
				if (data?.createFabric.__typename !== "Fabric") return

				addFabricToMyFabricsCache(cache, {
					__typename,
					id: data.createFabric.id,
					center,
					elements,
					zoom,
					title,
					thumbnail,
					locationCity,
					locationRegion,
					locationRegionAbbr,
					updatedAt: new Date().toISOString(),
					proposal: null,
				})
			},
		})

		match(response.data?.createFabric)
			.with({ __typename: "Fabric" }, ({ id: duplicatedId }) => {
				toast.success("Fabric duplicated")
				navigate({ to: "/fabric/$id", params: { id: duplicatedId } })
			})
			.with({ __typename: "UnauthorizedError" }, () => {
				navigate({ to: "/login", replace: true })
			})
			.otherwise(() => {
				toast.error("Unable to duplicate fabric")
			})
	}

	async function handleDelete() {
		const response = await deleteFabric({
			variables: { input: { id } },
			optimisticResponse: {
				__typename: "Mutation",
				deleteFabric: {
					__typename: "Fabric",
					id,
				},
			},
			update(cache, { data }) {
				if (data?.deleteFabric.__typename !== "Fabric") return
				removeFabricFromMyFabricsCache(cache, data.deleteFabric.id)
			},
		})

		match(response.data?.deleteFabric)
			.with({ __typename: "Fabric" }, () => {
				toast.success("Fabric deleted")
			})
			.with({ __typename: "UnauthorizedError" }, () => {
				navigate({ to: "/login", replace: true })
			})
			.with(
				{ __typename: "ConflictError" },
				{ __typename: "ForbiddenError" },
				{ __typename: "NotFoundError" },
				({ message }) => {
					toast.error(message)
				},
			)
			.otherwise(() => {
				toast.error("Unable to delete fabric")
			})
	}

	return (
		<Card
			size="sm"
			lift="md"
			shadow="sm"
			className={cx(
				"group",
				css({
					position: "relative",
					animation: "fadeUp 200ms var(--easings-out)",
				}),
			)}
		>
			<Link
				to="/fabric/$id"
				params={{ id }}
				className={css({
					position: "absolute",
					inset: "0",
					zIndex: "base",
				})}
			/>
			<Menu placement="bottom-end">
				<Menu.Trigger>
					<button
						type="button"
						className={css({
							position: "absolute",
							top: "2",
							right: "2",
							padding: "1",
							borderRadius: "md",
							color: "stone.400",
							opacity: "0",
							transition: "opacity 200ms, color 100ms, background 100ms",
							_groupHover: {
								opacity: "1",
								background: "rgb(255 255 255 / 0.8)",
								_hover: {
									color: "stone.900",
									background: "white",
								},
							},
							'&[aria-expanded="true"]': {
								opacity: "1",
								background: "white",
								color: "stone.900",
							},
							zIndex: "floating",
							cursor: "pointer",
						})}
					>
						<EllipsisVertical size={16} />
					</button>
				</Menu.Trigger>
				<Menu.Content>
					<Menu.Item onClick={() => void handleDuplicate()}>
						<Copy size={12} />
						Duplicate
					</Menu.Item>
					<Menu.Item
						disabled={!!proposal?.id}
						intent="danger"
						onClick={() => void handleDelete()}
					>
						<Trash size={12} />
						Delete
					</Menu.Item>
				</Menu.Content>
			</Menu>
			<Card.Media>
				<img src={thumbnail ?? ""} alt={`${title} map`} />
			</Card.Media>
			<Card.Body>
				<VStack gap="1">
					<Typography.Text
						size="sm"
						weight="semibold"
						lineHeight="normal"
						clamp={"2"}
					>
						{title}
					</Typography.Text>
					<HStack gap="1" align="center">
						<MapPin size={12} color={"var(--colors-stone-400)"} />
						<Typography.Text size="xs" color="stone.400">
							{locationCity}, {locationRegionAbbr ?? locationRegion}
						</Typography.Text>
					</HStack>
					<HStack
						gap="1"
						align="end"
						justify="space-between"
						className={css({ minHeight: "6" })}
					>
						<Typography.Text size="xs" color="stone.400">
							Edited {DateTime.fromISO(updatedAt).toFormat("LLL d")}
						</Typography.Text>
						{proposal?.id && (
							<Badge
								appearance="solid"
								tone={proposal.isPublished ? "accent" : "neutral"}
								size="xs"
								className={css({ alignSelf: "end" })}
							>
								{proposal.isPublished ? "Proposal" : "Draft"}
							</Badge>
						)}
					</HStack>
				</VStack>
			</Card.Body>
		</Card>
	)
}
