import { createLink, type LinkComponentProps } from "@tanstack/react-router"
import * as React from "react"
import { cx } from "@/styles/styled-system/css"
import {
	type LinkVariantProps,
	link as linkRecipe,
} from "@/styles/styled-system/recipes"

// ---------- Base anchor ----------
// Used by both the plain <a> and TanStack's createLink wrapper.

export interface LinkAnchorProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		LinkVariantProps {}

const LinkAnchor = React.forwardRef<HTMLAnchorElement, LinkAnchorProps>(
	({ variant, size, className, ...rest }, ref) => {
		const styles = linkRecipe({ variant, size })
		return <a ref={ref} className={cx(styles, className)} {...rest} />
	},
)
LinkAnchor.displayName = "LinkAnchor"

// ---------- Router link ----------

const CreatedRouterLink = createLink(LinkAnchor)

export type RouterLinkProps = LinkComponentProps<typeof LinkAnchor>

export function Link({ ...props }: RouterLinkProps) {
	return <CreatedRouterLink preload="intent" {...props} />
}
Link.displayName = "Link"

// ---------- Plain anchor ----------
// For external URLs or cases where you don't want router integration.

export { LinkAnchor as ExternalLink }
