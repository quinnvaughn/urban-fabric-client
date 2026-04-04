import { Link } from "@tanstack/react-router"
import { Fragment } from "react/jsx-runtime"
import {
	Badge,
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

export function NotFoundView() {
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
									animation: "rise 0.5s var(--easings-spring) 0.1s both",
								})}
							>
								<Box
									className={css({
										animation: "wobble 0.7s var(--easings-spring) 0.3s both",
									})}
								>
									<svg
										width="48"
										height="60"
										viewBox="0 0 48 60"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>Not Found</title>
										<path
											d="M24 0C10.745 0 0 10.745 0 24c0 16.5 24 36 24 36s24-19.5 24-36C48 10.745 37.255 0 24 0z"
											fill="#d9f0ea"
										></path>
										<path
											d="M24 2C11.85 2 2 11.85 2 24c0 15.4 22 34 22 34s22-18.6 22-34C46 11.85 36.15 2 24 2z"
											stroke="#1a6b5a"
											strokeWidth="1.5"
											fill="#d9f0ea"
										></path>
										<text
											x="24"
											y="30"
											textAnchor="middle"
											fontSize="18"
											fontWeight="600"
											fill="#1a6b5a"
											fontFamily="sans-serif"
										>
											?
										</text>
									</svg>
								</Box>
							</Box>
							<VStack gap="3" align="center">
								<HStack>
									<Badge appearance="solid" size="xs" tone="muted">
										404
									</Badge>
								</HStack>
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
									Page Not Found
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
										This block
										<br />
										is{" "}
										<Typography.Inline color="coral.500" fontStyle="italic">
											missing from the map.
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
											Whatever you were looking for doesn't exist here. Could've
											been demolished, rezoned, or maybe it was never built.
											Either way, the lot is empty and the permit has expired.
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
											Broken link?{" "}
											<ExternalLink href="mailto:quinn@urbanfabric.app">
												Let us know
											</ExternalLink>{" "}
											and we'll fix the zoning.
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
