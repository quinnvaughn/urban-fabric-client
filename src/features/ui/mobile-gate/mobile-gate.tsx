import { useRouter } from "@tanstack/react-router"
import { Copy, Mail } from "lucide-react"
import { useEffect } from "react"
import { useAnalytics } from "#/lib/analytics"
import { useCurrentUser } from "#/lib/graphql"
import { type MobileGateSize, useIsMobile, useTransientText } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { Button } from "../button"
import { Box, VStack } from "../layout"
import { Logo } from "../logo"
import { useToast } from "../toast"
import { Typography } from "../typography"

type Props = {
	children: React.ReactNode
	size?: MobileGateSize
}

export function MobileGate({ children, size = "sm" }: Props) {
	const isMobile = useIsMobile(size)
	const toast = useToast()
	const [copyText, setCopyText] = useTransientText("Copy link", "Copied!", 2000)
	const { user } = useCurrentUser()
	const router = useRouter()
	const { capture } = useAnalytics()

	useEffect(() => {
		if (isMobile) capture("editor_mobile_wall_viewed")
	}, [isMobile, capture])

	function handleCopyLink() {
		navigator.clipboard.writeText(window.location.href).then(setCopyText)
		capture("editor_mobile_link_copied")
		toast.success("Link copied to clipboard!", {
			description: "You can now paste it anywhere you like.",
		})
	}

	if (isMobile) {
		return (
			<Box
				className={css({
					width: "screen",
					height: "screen",
					background: "stone.50",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					py: "10",
					px: "8",
					textAlign: "center",
				})}
			>
				<VStack gap="8" align="center">
					<VStack gap="2.5" align="center">
						<VStack gap="6" align="center">
							<Logo withText={false} />
							<Typography.Text
								color="brand.default"
								letterSpacing="wider"
								size="3xs"
								weight="semibold"
								transform="uppercase"
							>
								Urban Fabric
							</Typography.Text>
						</VStack>
						<VStack gap="5" align="center">
							<VStack gap="3" align="center">
								<Typography.Heading
									as="h1"
									size="xl"
									fontStyle="italic"
									font="serif"
									weight="light"
									lineHeight="tight"
								>
									This one needs a bigger screen.
								</Typography.Heading>
								<Box
									className={css({
										width: "10",
										height: "px",
										background: "stone.300",
									})}
								/>
							</VStack>
							<Typography.Text
								size="md"
								color="stone.700"
								lineHeight="relaxed"
								className={css({ maxW: "280px" })}
							>
								The editor works best on a laptop or desktop. Send yourself a
								link and pick this up from there.
							</Typography.Text>
						</VStack>
					</VStack>
					<VStack
						gap="2.5"
						align="stretch"
						className={css({ maxW: "280px", width: "100%" })}
					>
						<a
							className={button({
								appearance: "solid",
								intent: "brand",
								size: "md",
							})}
							href={`mailto:${user?.email ?? ""}?subject=${encodeURIComponent("Urban Fabric")}&body=${encodeURIComponent(window.location.href)}`}
							onClick={() => capture("editor_mobile_email_sent")}
						>
							<Mail size={12} />
							Email me this link
						</a>
						<Button
							appearance="outline"
							intent="brand"
							startIcon={<Copy size={12} />}
							onClick={handleCopyLink}
						>
							{copyText}
						</Button>
						<button
							type="button"
							onClick={() => {
								capture("editor_mobile_go_back")
								router.history.back()
							}}
							className={css({
								color: "stone.700",
								fontSize: "sm",
								textDecoration: "underline",
							})}
						>
							Go back to safety
						</button>
					</VStack>
				</VStack>
			</Box>
		)
	}

	return children
}
