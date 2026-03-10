import { useReadQuery } from "@apollo/client/react"
import { createFileRoute } from "@tanstack/react-router"
import { Greeting, SectionHeader, StatRow } from "#/features/dashboard"
import { FabricCard } from "#/features/fabric"
import { Grid, VStack } from "#/features/ui"
import { MeDocument } from "#/graphql/generated"

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const userQuery = context.preloadQuery(MeDocument)

		return { userQuery }
	},
})

function RouteComponent() {
	const { userQuery } = Route.useLoaderData()
	const { data } = useReadQuery(userQuery)
	return (
		<div>
			<VStack gap="8">
				<VStack gap="6">
					<Greeting userName={data.me?.name.split(" ")[0] ?? ""} numLikes={3} />
					<StatRow
						stats={[
							{
								label: "fabrics",
								value: 12,
								delta: "2 drafts",
								neutral: true,
							},
							{
								label: "proposals",
								value: 4,
								delta: "1 unpublished",
								neutral: true,
							},
							{
								label: "total views",
								value: 8900,
								delta: "^ +12% this week",
							},
							{
								label: "likes",
								value: 341,
								delta: "^ 3 new",
							},
						]}
					/>
				</VStack>
				<VStack gap="6">
					<SectionHeader type="fabrics" total={12} />
					<Grid gap="3" cols={3}>
						<FabricCard
							lastEdited="2026-05-20T14:48:00.000Z"
							title="Main St: protected bike lanes & roundabouts at every intersection"
							mapImage={
								<svg
									viewBox="0 0 300 120"
									xmlns="http://www.w3.org/2000/svg"
									preserveAspectRatio="xMidYMid slice"
								>
									<title>Example map image for a fabric</title>
									{/* Background */}
									<rect width="300" height="120" fill="#f5f2ec" />
									{/* Blocks */}
									<rect
										x="0"
										y="0"
										width="90"
										height="55"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="110"
										y="0"
										width="80"
										height="55"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="210"
										y="0"
										width="90"
										height="55"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="0"
										y="75"
										width="90"
										height="45"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="110"
										y="75"
										width="80"
										height="45"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="210"
										y="75"
										width="90"
										height="45"
										fill="#ebe6dc"
										rx="2"
									/>
									{/* Streets */}
									<rect x="0" y="55" width="300" height="20" fill="#d9d2c4" />
									<rect x="90" y="0" width="20" height="120" fill="#d9d2c4" />
									<rect x="190" y="0" width="20" height="120" fill="#d9d2c4" />
									{/* Proposed: protected bike lane (coral strip) */}
									<rect
										x="0"
										y="55"
										width="300"
										height="4"
										fill="#d4735e"
										opacity="0.75"
									/>
									{/* Proposed: tree canopy median (teal dots) */}
									<circle cx="50" cy="65" r="7" fill="#1a6b5a" opacity="0.55" />
									<circle
										cx="150"
										cy="65"
										r="7"
										fill="#1a6b5a"
										opacity="0.55"
									/>
									<circle
										cx="250"
										cy="65"
										r="7"
										fill="#1a6b5a"
										opacity="0.55"
									/>
									{/* Roundabout at intersection */}
									<circle
										cx="100"
										cy="65"
										r="9"
										fill="#d9d2c4"
										stroke="#c8c4ba"
										strokeWidth="1"
									/>
									<circle cx="100" cy="65" r="4" fill="#b2e0d5" />
									<circle
										cx="200"
										cy="65"
										r="9"
										fill="#d9d2c4"
										stroke="#c8c4ba"
										strokeWidth="1"
									/>
									<circle cx="200" cy="65" r="4" fill="#b2e0d5" />
								</svg>
							}
						/>
						<FabricCard
							lastEdited="2026-06-03T14:48:00.000Z"
							title="Harlem Ave dedicated bus lane — 12 min time savings"
							mapImage={
								<svg
									viewBox="0 0 300 120"
									xmlns="http://www.w3.org/2000/svg"
									preserveAspectRatio="xMidYMid slice"
								>
									<title>Example map image for a fabric</title>
									<rect width="300" height="120" fill="#f5f2ec" />
									{/* Blocks */}
									<rect
										x="0"
										y="0"
										width="110"
										height="45"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="130"
										y="0"
										width="170"
										height="45"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="0"
										y="65"
										width="110"
										height="55"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="130"
										y="65"
										width="170"
										height="55"
										fill="#ebe6dc"
										rx="2"
									/>
									{/* Streets */}
									<rect x="0" y="45" width="300" height="20" fill="#d9d2c4" />
									<rect x="110" y="0" width="20" height="120" fill="#d9d2c4" />
									{/* Bus lane proposal */}
									<rect
										x="0"
										y="45"
										width="300"
										height="5"
										fill="#d4901e"
										opacity="0.6"
									/>
									{/* Station stops */}
									<rect
										x="55"
										y="43"
										width="24"
										height="14"
										fill="#1a6b5a"
										opacity="0.8"
										rx="2"
									/>
									<rect
										x="175"
										y="43"
										width="24"
										height="14"
										fill="#1a6b5a"
										opacity="0.8"
										rx="2"
									/>
									<text
										x="67"
										y="53"
										textAnchor="middle"
										fontFamily="DM Sans,sans-serif"
										fontSize="5"
										fill="white"
										fontWeight="600"
									>
										BUS
									</text>
									<text
										x="187"
										y="53"
										textAnchor="middle"
										fontFamily="DM Sans,sans-serif"
										fontSize="5"
										fill="white"
										fontWeight="600"
									>
										BUS
									</text>
								</svg>
							}
						/>
						<FabricCard
							lastEdited="2026-04-15T14:48:00.000Z"
							title="Elm Ave shared street + widened sidewalks near school"
							mapImage={
								<svg
									viewBox="0 0 300 120"
									xmlns="http://www.w3.org/2000/svg"
									preserveAspectRatio="xMidYMid slice"
								>
									<title>Example map image for a fabric</title>
									<rect width="300" height="120" fill="#f5f2ec" />
									{/* Blocks */}
									<rect
										x="0"
										y="0"
										width="130"
										height="50"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="150"
										y="0"
										width="150"
										height="50"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="0"
										y="70"
										width="130"
										height="50"
										fill="#ebe6dc"
										rx="2"
									/>
									<rect
										x="150"
										y="70"
										width="150"
										height="50"
										fill="#ebe6dc"
										rx="2"
									/>
									{/* Streets */}
									<rect x="0" y="50" width="300" height="20" fill="#d9d2c4" />
									<rect x="130" y="0" width="20" height="120" fill="#d9d2c4" />
									{/* Wide sidewalk proposal (teal) */}
									<rect
										x="0"
										y="68"
										width="300"
										height="5"
										fill="#1a6b5a"
										opacity="0.5"
									/>
									{/* Shared path marker (dashed) */}
									<rect
										x="0"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									<rect
										x="30"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									<rect
										x="60"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									<rect
										x="90"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									<rect
										x="160"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									<rect
										x="190"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									<rect
										x="220"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									<rect
										x="250"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									<rect
										x="280"
										y="51"
										width="20"
										height="3"
										fill="white"
										opacity="0.6"
									/>
									{/* Trees */}
									<circle cx="60" cy="43" r="6" fill="#278d75" opacity="0.5" />
									<circle cx="200" cy="43" r="6" fill="#278d75" opacity="0.5" />
									<circle cx="60" cy="78" r="6" fill="#278d75" opacity="0.5" />
									<circle cx="200" cy="78" r="6" fill="#278d75" opacity="0.5" />
									{/* Crossing signal */}
									<rect
										x="128"
										y="48"
										width="4"
										height="12"
										fill="#504c45"
										rx="1"
									/>
								</svg>
							}
						/>
					</Grid>
				</VStack>
			</VStack>
		</div>
	)
}
