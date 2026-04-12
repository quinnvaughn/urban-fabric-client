import { Link, useLocation } from "@tanstack/react-router"
import { MenuIcon, XIcon } from "lucide-react"
import type { ButtonHTMLAttributes } from "react"
import { useState } from "react"
import { match } from "ts-pattern"
import { Avatar, HStack, Menu } from "#/features/ui"
import type { MeFragment } from "#/graphql/generated"
import { useCurrentUser } from "#/lib/graphql"
import { useIsMobile } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"
import { button } from "#/styles/styled-system/recipes"
import { UserMenuItems } from "../user-menu-content"

type AuthenticatedAction = "dashboard" | "new-fabric"
type AuthenticatedActionMode = AuthenticatedAction | "dashboard-and-new-fabric"
type NavViewerState =
	| { kind: "loading" }
	| { kind: "authenticated"; user: MeFragment }
	| { kind: "guest" }

interface PublicNavActionsProps {
	authenticatedAction?: AuthenticatedActionMode
}

type AuthenticatedNavAction = {
	to: "/dashboard" | "/fabric/new"
	label: string
	appearance: "outline" | "solid"
	intent: "brand" | "neutral"
}

type GuestNavAction = {
	to: "/explore" | "/login" | "/fabric/new"
	label: string
	appearance?: "ghost" | "outline" | "solid"
	intent?: "brand" | "neutral"
	hideOnPaths: string[]
}

const authenticatedActionConfig: Record<
	AuthenticatedActionMode,
	AuthenticatedNavAction[]
> = {
	dashboard: [
		{
			to: "/dashboard",
			label: "Dashboard",
			appearance: "outline",
			intent: "neutral",
		},
	],
	"new-fabric": [
		{
			to: "/fabric/new",
			label: "Create fabric",
			appearance: "solid",
			intent: "brand",
		},
	],
	"dashboard-and-new-fabric": [
		{
			to: "/dashboard",
			label: "Dashboard",
			appearance: "outline",
			intent: "neutral",
		},
		{
			to: "/fabric/new",
			label: "Create fabric",
			appearance: "solid",
			intent: "brand",
		},
	],
}

const guestActionConfig: GuestNavAction[] = [
	{
		to: "/explore",
		label: "Explore proposals",
		appearance: "ghost",
		intent: "neutral",
		hideOnPaths: ["/explore"],
	},
	{
		to: "/login",
		label: "Sign in",
		appearance: "outline",
		intent: "neutral",
		hideOnPaths: ["/login", "/register"],
	},
	{
		to: "/fabric/new",
		label: "Start designing",
		appearance: "solid",
		intent: "brand",
		hideOnPaths: ["/fabric/new"],
	},
]

export function PublicNavActions({
	authenticatedAction = "dashboard",
}: PublicNavActionsProps) {
	const isMobile = useIsMobile()
	const location = useLocation()
	const { user, loading } = useCurrentUser()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const guestActions = guestActionConfig.filter(
		(action) => !action.hideOnPaths.includes(location.pathname),
	)

	const viewerState: NavViewerState = loading
		? { kind: "loading" }
		: user
			? { kind: "authenticated", user }
			: { kind: "guest" }

	return match({ viewerState, isMobile })
		.with({ viewerState: { kind: "loading" } }, () => null)
		.with(
			{ viewerState: { kind: "authenticated" }, isMobile: true },
			({ viewerState }) => (
				<AuthenticatedMobileNav
					name={viewerState.user.name}
					profilePictureUrl={viewerState.user.profilePictureUrl}
					actions={authenticatedActionConfig[authenticatedAction]}
					isMenuOpen={isMenuOpen}
					onMenuOpenChange={setIsMenuOpen}
				/>
			),
		)
		.with(
			{ viewerState: { kind: "authenticated" }, isMobile: false },
			({ viewerState }) => (
				<AuthenticatedDesktopNav
					actions={authenticatedActionConfig[authenticatedAction]}
					name={viewerState.user.name}
					profilePictureUrl={viewerState.user.profilePictureUrl}
					isMenuOpen={isMenuOpen}
					onMenuOpenChange={setIsMenuOpen}
				/>
			),
		)
		.with({ viewerState: { kind: "guest" }, isMobile: true }, () => (
			<GuestMobileNav
				actions={guestActions}
				isMenuOpen={isMenuOpen}
				onMenuOpenChange={setIsMenuOpen}
			/>
		))
		.with({ viewerState: { kind: "guest" }, isMobile: false }, () => (
			<GuestDesktopNav actions={guestActions} />
		))
		.exhaustive()
}

function AuthenticatedMobileNav({
	name,
	profilePictureUrl,
	actions,
	isMenuOpen,
	onMenuOpenChange,
}: {
	name: string
	profilePictureUrl?: string | null
	actions: AuthenticatedNavAction[]
	isMenuOpen: boolean
	onMenuOpenChange: (open: boolean) => void
}) {
	return (
		<Menu
			placement="bottom-end"
			open={isMenuOpen}
			onOpenChange={onMenuOpenChange}
		>
			<Menu.Trigger>
				<button type="button" className={css({ cursor: "pointer" })}>
					<Avatar name={name} size="sm" tone="accent" profilePictureUrl={profilePictureUrl} />
				</button>
			</Menu.Trigger>
			<Menu.Content>
				{actions.map((action) => (
					<Menu.Link key={action.to} to={action.to}>
						{action.label}
					</Menu.Link>
				))}
				<Menu.Separator />
				<UserMenuItems onBeforeLogout={() => onMenuOpenChange(false)} />
			</Menu.Content>
		</Menu>
	)
}

function AuthenticatedDesktopNav({
	actions,
	name,
	profilePictureUrl,
	isMenuOpen,
	onMenuOpenChange,
}: {
	actions: AuthenticatedNavAction[]
	name: string
	profilePictureUrl?: string | null
	isMenuOpen: boolean
	onMenuOpenChange: (open: boolean) => void
}) {
	return (
		<HStack align="center" gap="2.5">
			{actions.map((action) => (
				<Link
					key={action.to}
					to={action.to}
					className={button({
						appearance: action.appearance,
						intent: action.intent,
						size: "sm",
					})}
				>
					{action.label}
				</Link>
			))}
			<Menu
				placement="bottom-end"
				open={isMenuOpen}
				onOpenChange={onMenuOpenChange}
			>
				<Menu.Trigger>
					<button type="button" className={css({ cursor: "pointer" })}>
						<Avatar name={name} size="sm" tone="accent" profilePictureUrl={profilePictureUrl} />
					</button>
				</Menu.Trigger>
				<Menu.Content>
					<UserMenuItems onBeforeLogout={() => onMenuOpenChange(false)} />
				</Menu.Content>
			</Menu>
		</HStack>
	)
}

function GuestMobileNav({
	actions,
	isMenuOpen,
	onMenuOpenChange,
}: {
	actions: GuestNavAction[]
	isMenuOpen: boolean
	onMenuOpenChange: (open: boolean) => void
}) {
	return (
		<Menu
			placement="bottom-end"
			open={isMenuOpen}
			onOpenChange={onMenuOpenChange}
		>
			<Menu.Trigger>
				<MobileMenuTrigger isOpen={isMenuOpen} />
			</Menu.Trigger>
			<Menu.Content>
				<GuestMenuItems actions={actions} />
			</Menu.Content>
		</Menu>
	)
}

function GuestDesktopNav({ actions }: { actions: GuestNavAction[] }) {
	return (
		<HStack align="center" gap="4">
			{actions.map((action) => (
				<Link
					key={action.to}
					to={action.to}
					className={button({
						appearance: action.appearance,
						intent: action.intent,
						size: "sm",
					})}
				>
					{action.label}
				</Link>
			))}
		</HStack>
	)
}

function GuestMenuItems({ actions }: { actions: GuestNavAction[] }) {
	return (
		<>
			{actions.map((action) => (
				<Menu.Link key={action.to} to={action.to}>
					{action.label}
				</Menu.Link>
			))}
		</>
	)
}

function MobileMenuTrigger(
	props: ButtonHTMLAttributes<HTMLButtonElement> & { isOpen: boolean },
) {
	const { isOpen, ...buttonProps } = props

	return (
		<button
			type="button"
			{...buttonProps}
			className={css({
				cursor: "pointer",
				position: "relative",
				w: "20px",
				h: "20px",
			})}
		>
			<MenuIcon
				size={20}
				color="var(--colors-stone-900)"
				style={getMobileMenuIconStyle({
					isOpen,
					openTransform: "rotate(45deg) scale(0.8)",
					closedTransform: "rotate(0deg) scale(1)",
					visibleWhenOpen: false,
				})}
			/>
			<XIcon
				size={20}
				color="var(--colors-stone-900)"
				style={getMobileMenuIconStyle({
					isOpen,
					openTransform: "rotate(0deg) scale(1)",
					closedTransform: "rotate(-45deg) scale(0.8)",
					visibleWhenOpen: true,
				})}
			/>
		</button>
	)
}

function getMobileMenuIconStyle({
	isOpen,
	openTransform,
	closedTransform,
	visibleWhenOpen,
}: {
	isOpen: boolean
	openTransform: string
	closedTransform: string
	visibleWhenOpen: boolean
}) {
	const isVisible = visibleWhenOpen ? isOpen : !isOpen
	const transform = isOpen ? openTransform : closedTransform

	return {
		position: "absolute" as const,
		inset: 0,
		transition: "opacity 150ms ease, transform 150ms ease",
		opacity: isVisible ? 1 : 0,
		transform,
	}
}
