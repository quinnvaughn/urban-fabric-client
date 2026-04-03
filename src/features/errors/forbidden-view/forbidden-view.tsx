import { Link } from "@tanstack/react-router"
import { Fragment } from "react/jsx-runtime"
import {
	Box,
	Card,
	Divider,
	ExternalLink,
	HStack,
	Typography,
	VStack,
} from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { BackgroundGrid } from "../background-grid"

export function ForbiddenView() {
	const { user } = useCurrentUser()
	return (
		<Fragment>
			<BackgroundGrid />
			<Box
				className={css({
					zIndex: "raised",
					minHeight: "screen",
					display: "flex",
					flexDir: "column",
					alignItems: "center",
					justify: "center",
					py: "10",
					px: "6",
					textAlign: "center",
					position: "relative",
				})}
			>
				<Card
					size="lg"
					variant="elevated"
					className={css({
						animation: "rise 0.6s var(--easings-spring) both",
						maxW: "lg",
					})}
				>
					<Card.Body>
						<VStack gap="9" align="center">
							<Box
								className={css({
									display: "flex",
									justify: "center",
									animation: "wobble 0.7s var(--easings-spring) 0.3s both",
								})}
							>
								<Box
									className={css({
										position: "relative",
										width: "100px",
										height: "100px",
									})}
								>
									<Box
										className={css({
											width: "100px",
											height: "100px",
											background: "coral.500",
											clipPath:
												"polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexDir: "column",
											gap: "px",
										})}
									>
										<Typography.Text
											size="4xs"
											weight="bold"
											letterSpacing="wider"
											transform="uppercase"
											color="white"
										>
											Error
										</Typography.Text>
										<Typography.Heading
											as="p"
											size="xl"
											weight="bold"
											color="white"
											lineHeight="none"
										>
											403
										</Typography.Heading>
									</Box>
								</Box>
							</Box>
							<VStack gap="3" align="center">
								<Typography.Text
									size="xs"
									weight="semibold"
									transform="uppercase"
									letterSpacing="wider"
									color="stone.500"
									className={css({
										animation: "rise 0.5s var(--easings-spring) 0.15s both",
									})}
								>
									Access Denied
								</Typography.Text>
								<VStack gap="4" align="center">
									<Typography.Heading
										as="h1"
										size="2xl"
										weight="light"
										font="serif"
										lineHeight="snug"
										className={css({
											animation: "rise 0.5s var(--easings-spring) 0.2s both",
										})}
									>
										Road closed.
										<br />
										<Typography.Inline color="coral.500" fontStyle="italic">
											No detour available.
										</Typography.Inline>
									</Typography.Heading>
									<VStack gap="9" align="center">
										<Typography.Text
											size="md"
											color="stone.600"
											lineHeight="relaxed"
											className={css({
												animation: "rise 0.5s var(--easings-spring) 0.25s both",
											})}
										>
											This area is off-limits — kind of like that parking lot
											the city turned into a "park" but locked every gate. You
											don't have permission to be here, and unlike most zoning
											hearings, this decision isn't up for public comment.
										</Typography.Text>
										<HStack
											gap="3"
											wrap
											className={css({
												animation: "rise 0.5s var(--easings-spring) 0.35s both",
											})}
										>
											<Link
												to={user ? "/dashboard" : "/"}
												className={button({
													size: "md",
													appearance: "solid",
													intent: "brand",
												})}
											>
												Go Home
											</Link>
											<Link
												className={button({
													size: "md",
													appearance: "outline",
													intent: "neutral",
												})}
												to={user ? "/dashboard/explore" : "/explore"}
											>
												Explore proposals
											</Link>
										</HStack>
										<Divider lines="both" />
										<Typography.Text
											size="sm"
											color="stone.500"
											className={css({
												animation: "rise 0.5s var(--easings-spring) 0.45s both",
											})}
										>
											Think this is a mistake?{" "}
											<ExternalLink href="mailto:quinn@urbanfabric.app">
												Let us know.
											</ExternalLink>
										</Typography.Text>
									</VStack>
								</VStack>
							</VStack>
						</VStack>
					</Card.Body>
				</Card>
			</Box>
		</Fragment>
	)
}
