import type { ComponentPropsWithRef, ElementType, ReactNode } from "react"
import { css, cx } from "../../../../styled-system/css"

type Props<C extends ElementType = "div"> = {
	as?: C
	children: ReactNode
} & Omit<ComponentPropsWithRef<C>, "as" | "children">

export function Card<C extends ElementType = "div">({
	as,
	children,
	...props
}: Props<C>) {
	const Component = as || "div"

	const baseStyles = css({
		borderWidth: "1px",
		borderColor: "neutral.200",
		borderRadius: "lg",
		p: "lg",
		boxShadow: "md",
	})

	return (
		<Component {...props} className={cx(baseStyles, props.className)}>
			{children}
		</Component>
	)
}
