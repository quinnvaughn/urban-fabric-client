import { createLink, type LinkComponent } from "@tanstack/react-router"
import type { JSX } from "react"
import { cx } from "../../../styles/styled-system/css"
import {
	type LinkVariantProps,
	link,
} from "../../../styles/styled-system/recipes"

type BaseLinkProps = JSX.IntrinsicElements["a"] & LinkVariantProps

const BasicLink = ({
	variant,
	children,
	size = "md",
	className: propsClass,
	...rest
}: BaseLinkProps) => {
	return (
		<a {...rest} className={cx(link({ size, variant }), propsClass)}>
			{children}
		</a>
	)
}

const CreatedLink = createLink(BasicLink)

export const AppLink: LinkComponent<typeof BasicLink> = (props) => {
	return <CreatedLink preload="intent" {...props} />
}
