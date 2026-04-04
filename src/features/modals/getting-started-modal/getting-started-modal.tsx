import { ArrowRight, House, PencilLineIcon } from "lucide-react"
import { useState } from "react"
import {
	Box,
	Button,
	HStack,
	Kbd,
	Modal,
	Typography,
	VStack,
} from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"

export const GETTING_STARTED_SEEN_KEY = "getting-started-seen"

type Props = {
	open: boolean
	onClose: () => void
}

function DiagramBox({
	label,
	name,
	description,
}: {
	label: string
	name: string
	description: string
}) {
	return (
		<Box
			className={css({
				flex: 1,
				borderRadius: "md",
				background: "stone.50",
				padding: "3",
				display: "flex",
				flexDirection: "column",
				gap: "1",
				borderStyle: "solid",
				borderWidth: "1px",
				borderColor: "stone.200",
			})}
		>
			<Typography.Text
				letterSpacing="wider"
				size="3xs"
				transform="uppercase"
				weight="bold"
				color="stone.400"
			>
				{label}
			</Typography.Text>
			<Typography.Text size="sm" weight="semibold" color="stone.800">
				{name}
			</Typography.Text>
			<Typography.Text size="xs" color="stone.500" lineHeight="snug">
				{description}
			</Typography.Text>
		</Box>
	)
}

type StepContentProps = {
	icon: React.ReactNode
	title: string
	children: React.ReactNode
}

function StepContent({ icon, title, children }: StepContentProps) {
	return (
		<VStack gap="4">
			<Box
				className={css({
					w: "11",
					h: "11",
					borderRadius: "lg",
					background: "teal.50",
					borderStyle: "solid",
					borderWidth: "1px",
					borderColor: "teal.100",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
					color: "teal.500",
				})}
			>
				{icon}
			</Box>
			<Typography.Text size="xl" font="serif" lineHeight="snug">
				{title}
			</Typography.Text>
			{children}
		</VStack>
	)
}

function Callout({
	children,
	type = "brand",
}: {
	children: React.ReactNode
	type?: "brand" | "accent"
}) {
	return (
		<Box
			className={css({
				background: type === "brand" ? "teal.50" : "coral.100",
				borderRadius: "md",
				p: "3",
				borderStyle: "solid",
				borderWidth: "1px",
				borderColor: type === "brand" ? "teal.100" : "coral.200",
			})}
		>
			{children}
		</Box>
	)
}

function LastStep() {
	const { user } = useCurrentUser()
	return (
		<StepContent
			key="command-palette"
			icon={
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<title>A few things to know</title>
					<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
				</svg>
			}
			title="A few things to know"
		>
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				<Typography.Inline weight="bold" color="stone.700">
					Command palette
				</Typography.Inline>{" "}
				— press <Kbd>⌘</Kbd>
				<Kbd>K</Kbd> to search for any element type by name and jump straight
				into drawing it.
			</Typography.Text>
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				<Typography.Inline weight="bold" color="stone.700">
					Editing
				</Typography.Inline>{" "}
				— switch to Select (<Kbd>V</Kbd>) to click and move segments, or press{" "}
				<Kbd>Del</Kbd> to remove one. Double-click a waypoint on a segment to
				remove just that point.
			</Typography.Text>
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				<Typography.Inline weight="bold" color="stone.700">
					Publishing
				</Typography.Inline>{" "}
				— when your design is ready, hit "Publish" in the top bar. You'll add a
				title, description, and categories, then your proposal goes live with a
				shareable link.
			</Typography.Text>
			{!user && (
				<Callout>
					<Typography.Text size="sm" color="stone.800">
						You don't need an account to explore the editor. Sign up when you're
						ready to save and publish your work.
					</Typography.Text>
				</Callout>
			)}
		</StepContent>
	)
}

const steps: React.ReactNode[] = [
	<StepContent
		key="redesign"
		icon={<House size={20} />}
		title="Redesign your streets, on a real map"
	>
		<VStack gap="2.5">
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				Urban Fabric is a place to draw and share built environment proposals on
				actual locations. Bike lanes, bus lanes, pedestrian zones, parking
				removals -- layered on top of the real road network so anyone can see
				exactly what you're envisioning.
			</Typography.Text>
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				Your proposals become a public page others can view, share, and build
				on. It's a creative and civic communication tool in one.
			</Typography.Text>
			<Callout>
				<Typography.Text size="sm" color="stone.800">
					<Typography.Inline color="stone.900" weight="bold">
						You're in the editor right now.{" "}
					</Typography.Inline>
					Navigate the map, pick an element type, and start drawing.
				</Typography.Text>
			</Callout>
		</VStack>
	</StepContent>,
	<StepContent
		key="fabrics-and-proposals"
		icon={
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<title>Fabrics and proposals</title>
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14 2 14 8 20 8"></polyline>
				<line x1="12" y1="18" x2="12" y2="12"></line>
				<line x1="9" y1="15" x2="15" y2="15"></line>
			</svg>
		}
		title="Fabrics and proposals"
	>
		<VStack gap="2.5">
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				Two concepts worth knowing:
			</Typography.Text>
			<HStack gap="2" align="stretch">
				<DiagramBox
					label="Fabric"
					name="Your design work"
					description="The map elements you draw. Lives in the editor. Can be a rough sketch or a fully worked-out proposal."
				/>
				<HStack align="center">
					<ArrowRight size={20} color="var(--colors-stone-300)" />
				</HStack>
				<DiagramBox
					label="Proposal"
					name="The public page"
					description="When you're ready, publish your fabric as a proposal with a title, description, and categories. That's what others see and share."
				/>
			</HStack>
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				One fabric becomes one proposal. You can keep editing your fabric and
				republish anytime to update it.
			</Typography.Text>
		</VStack>
	</StepContent>,
	<StepContent
		key="draw"
		icon={<PencilLineIcon size={20} />}
		title="How to draw an element"
	>
		<VStack gap="2.5">
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				Select an element type from the left panel -- like "Bike Lane" -- then
				click the Draw tool (or press <Kbd>D</Kbd>).
			</Typography.Text>
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				Click along a road to place waypoints. The editor snaps each point to
				the road network, so you're always drawing on real geometry.
			</Typography.Text>
			<Callout type="accent">
				<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
					<Typography.Inline color="stone.900" weight="bold">
						Important:
					</Typography.Inline>{" "}
					pressing <Kbd>↵</Kbd> Enter is what actually creates the element.
					Clicking waypoints is just placing points -- nothing is added to your
					fabric until you press Enter to finish.
				</Typography.Text>
			</Callout>
			<Typography.Text size="sm" color="stone.700" lineHeight="relaxed">
				Press <Kbd>Esc</Kbd> to cancel a drawing in progress without adding
				anything.
			</Typography.Text>
		</VStack>
	</StepContent>,
	<LastStep key="last-step" />,
]

function handleClose(onClose: () => void) {
	localStorage.setItem(GETTING_STARTED_SEEN_KEY, "1")
	onClose()
}

export function GettingStartedModal({ open, onClose }: Props) {
	const [stepIndex, setStepIndex] = useState(0)
	const isFirst = stepIndex === 0
	const isLast = stepIndex === steps.length - 1

	const close = () => handleClose(onClose)

	return (
		<Modal open={open} onClose={close}>
			<Modal.Header>
				<Modal.Title>Getting Started</Modal.Title>
				<Modal.CloseBtn />
			</Modal.Header>
			<Modal.Body>{steps[stepIndex]}</Modal.Body>
			<Modal.Footer>
				<HStack justify="space-between" gap="3" className={css({ flex: 1 })}>
					<HStack gap="2" align="center">
						{steps.map((_, i) => (
							<button
								type="button"
								key={`step-indicator-${
									// biome-ignore lint/suspicious/noArrayIndexKey: This is a static array that won't change, so using the index as a key is fine here.
									i
								}`}
								onClick={() => setStepIndex(i)}
								className={css({
									w: stepIndex === i ? "4.5" : "1.5",
									h: "1.5",
									background: stepIndex === i ? "teal.400" : "stone.200",
									cursor: "pointer",
									transition: "background 200ms, width 200ms",
									borderRadius: "full",
								})}
							/>
						))}
					</HStack>
					<HStack gap="2" align="center">
						{!isFirst && (
							<Button
								appearance="ghost"
								intent="neutral"
								onClick={() => setStepIndex((i) => i - 1)}
							>
								Back
							</Button>
						)}
						{isLast ? (
							<Button appearance="solid" intent="brand" onClick={close}>
								Start designing
							</Button>
						) : (
							<Button
								appearance="solid"
								intent="brand"
								onClick={() => setStepIndex((i) => i + 1)}
							>
								Next
							</Button>
						)}
					</HStack>
				</HStack>
			</Modal.Footer>
		</Modal>
	)
}
