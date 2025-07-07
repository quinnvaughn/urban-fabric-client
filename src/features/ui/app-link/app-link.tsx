import { createLink, type LinkComponent } from "@tanstack/react-router"
import type { JSX } from "react"
import { css, cx } from "../../../../styled-system/css"

type BaseLinkProps = JSX.IntrinsicElements["a"] & {
	variant?: "primary" | "secondary"
	size?: "sm" | "md" | "lg"
}

const BasicLink = ({
	variant,
	children,
	size = "md",
	className: propsClass,
	...rest
}: BaseLinkProps) => {
	const base = css({
		textDecoration: "none",
		cursor: "pointer",
		fontWeight: "medium",
	})
	const variantClasses =
		variant === "primary"
			? css({ color: "primary", _hover: { textDecoration: "underline" } })
			: variant === "secondary"
				? css({ color: "secondary" })
				: ""

	const sizeClasses =
		size === "sm"
			? css({ fontSize: "sm" })
			: size === "lg"
				? css({ fontSize: "lg" })
				: css({ fontSize: "md" })

	return (
		<a {...rest} className={cx(base, variantClasses, sizeClasses, propsClass)}>
			{children}
		</a>
	)
}

const CreatedLink = createLink(BasicLink)

export const AppLink: LinkComponent<typeof BasicLink> = (props) => {
	return <CreatedLink preload="intent" {...props} />
}
