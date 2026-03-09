import { createLink, type LinkComponent } from "@tanstack/react-router"
import { forwardRef } from "react"
import { css, cx } from "@/styles/styled-system/css"

interface SidebarLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	icon: React.ReactNode
}

const SidebarLinkInner = forwardRef<HTMLAnchorElement, SidebarLinkProps>(
	({ className, icon, children, ...props }, ref) => (
		<a
			ref={ref}
			className={cx(
				css({
					display: "flex",
					alignItems: "center",
					gap: "2",
					fontWeight: "medium",
					py: "2",
					px: "2.5",
					color: "stone.600",
					fontSize: "sm",
					borderRadius: "md",
					textDecoration: "none",
					transition:
						"background 150ms var(--easings-in-out), color 150ms var(--easings-in-out)",
					"&:hover:not([data-status=active])": {
						background: "stone.200",
						color: "stone.900",
					},
					"&[data-status=active]": {
						background: "teal.100",
						color: "teal.700",
					},
				}),
				className,
			)}
			{...props}
		>
			{icon}
			{children}
		</a>
	),
)

export const SidebarLink: LinkComponent<typeof SidebarLinkInner> =
	createLink(SidebarLinkInner)
