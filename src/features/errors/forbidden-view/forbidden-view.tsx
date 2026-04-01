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

export function ForbiddenView() {
	const { data: currentUser } = useCurrentUser()
	return (
		<Fragment>
			<Box
				className={css({
					position: "fixed",
					inset: 0,
					zIndex: 0,
					overflow: "hidden",
					opacity: 0.18,
					bg: "stone.100",
				})}
			>
				<svg
					viewBox="0 0 1200 800"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMidYMid slice"
					className={css({ width: "100%", height: "100%" })}
				>
					<title>Forbidden</title>
					<rect x="0" y="0" width="1200" height="800" fill="none"></rect>
					<line
						x1="0"
						y1="140"
						x2="1200"
						y2="140"
						stroke="#2c2a27"
						stroke-width="2.5"
					></line>
					<line
						x1="0"
						y1="280"
						x2="1200"
						y2="280"
						stroke="#2c2a27"
						stroke-width="1.5"
					></line>
					<line
						x1="0"
						y1="380"
						x2="1200"
						y2="380"
						stroke="#2c2a27"
						stroke-width="2.5"
					></line>
					<line
						x1="0"
						y1="520"
						x2="1200"
						y2="520"
						stroke="#2c2a27"
						stroke-width="1.5"
					></line>
					<line
						x1="0"
						y1="650"
						x2="1200"
						y2="650"
						stroke="#2c2a27"
						stroke-width="2.5"
					></line>
					<line
						x1="160"
						y1="0"
						x2="160"
						y2="800"
						stroke="#2c2a27"
						stroke-width="2.5"
					></line>
					<line
						x1="340"
						y1="0"
						x2="340"
						y2="800"
						stroke="#2c2a27"
						stroke-width="1.5"
					></line>
					<line
						x1="580"
						y1="0"
						x2="580"
						y2="800"
						stroke="#2c2a27"
						stroke-width="2.5"
					></line>
					<line
						x1="760"
						y1="0"
						x2="760"
						y2="800"
						stroke="#2c2a27"
						stroke-width="1.5"
					></line>
					<line
						x1="980"
						y1="0"
						x2="980"
						y2="800"
						stroke="#2c2a27"
						stroke-width="2.5"
					></line>
					<rect
						x="165"
						y="145"
						width="170"
						height="130"
						fill="#2c2a27"
						opacity="0.06"
						rx="2"
					></rect>
					<rect
						x="345"
						y="145"
						width="230"
						height="130"
						fill="#2c2a27"
						opacity="0.04"
						rx="2"
					></rect>
					<rect
						x="585"
						y="145"
						width="170"
						height="130"
						fill="#2c2a27"
						opacity="0.06"
						rx="2"
					></rect>
					<rect
						x="165"
						y="285"
						width="170"
						height="90"
						fill="#2c2a27"
						opacity="0.04"
						rx="2"
					></rect>
					<rect
						x="345"
						y="285"
						width="230"
						height="90"
						fill="#2c2a27"
						opacity="0.07"
						rx="2"
					></rect>
					<rect
						x="585"
						y="285"
						width="170"
						height="90"
						fill="#2c2a27"
						opacity="0.04"
						rx="2"
					></rect>
					<rect
						x="165"
						y="385"
						width="170"
						height="130"
						fill="#2c2a27"
						opacity="0.06"
						rx="2"
					></rect>
					<rect
						x="765"
						y="285"
						width="210"
						height="230"
						fill="#2c2a27"
						opacity="0.05"
						rx="2"
					></rect>
					<rect
						x="165"
						y="525"
						width="170"
						height="120"
						fill="#2c2a27"
						opacity="0.04"
						rx="2"
					></rect>
					<rect
						x="345"
						y="525"
						width="230"
						height="120"
						fill="#2c2a27"
						opacity="0.06"
						rx="2"
					></rect>
					<rect
						x="585"
						y="525"
						width="170"
						height="120"
						fill="#2c2a27"
						opacity="0.04"
						rx="2"
					></rect>
				</svg>
			</Box>
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
												to={currentUser ? "/dashboard" : "/"}
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
												to={currentUser ? "/dashboard/explore" : "/explore"}
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
