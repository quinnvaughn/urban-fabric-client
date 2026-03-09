import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Box, Card, Tabs, Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/_marketing/_auth")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<main
			className={css({
				backgroundColor: "bg.base",
				minHeight: "calc(100lvh - var(--uf-header-height))",
				w: "full",
			})}
		>
			<Box sx={{ mx: "auto", w: "full", maxW: "md", py: "8" }}>
				<VStack gap="8">
					<Box
						sx={{
							textAlign: "center",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "2",
						}}
						style={{ lineHeight: "1.12" }}
					>
						<h1
							className={css({
								fontFamily: "serif",
								fontWeight: "300",
								fontSize: "clamp(2rem, 5vw, 2.75rem)",
							})}
						>
							<span>Your neighborhood,</span>
							<br />
							<span
								className={css({
									fontFamily: "serif",
									color: "accent.default",
									fontStyle: "italic",
								})}
							>
								reimagined.
							</span>
						</h1>
						<Typography.Text tone="muted" size="sm">
							Design better streets. Share the vision. Make the case.
						</Typography.Text>
					</Box>
					<Card>
						<Card.Body>
							<Tabs>
								<Tabs.List>
									<Tabs.Link to="/login">Sign in</Tabs.Link>
									<Tabs.Link to="/register">Create account</Tabs.Link>
								</Tabs.List>
							</Tabs>
							<Outlet />
						</Card.Body>
					</Card>
				</VStack>
			</Box>
		</main>
	)
}
