import type { ComponentPropsWithoutRef, ElementType, JSX } from "react"
import { css, cx } from "../../../../styled-system/css"

type PolymorphicProps<C extends ElementType, Props> = Props &
	Omit<ComponentPropsWithoutRef<C>, keyof Props> & {
		as?: C
		children?: JSX.Element
	}

type ContainerOwnProps = {
	maxWidth?: string
}

export function Container<C extends ElementType = "div">({
	as,
	maxWidth = "1200px",
	className: propsClass,
	children,
	...rest
}: PolymorphicProps<C, ContainerOwnProps>) {
	const Component = as || "div"

	const base = css({
		maxWidth,
		width: "100%",
		mx: "auto",
	})

	const className = cx(base, propsClass)

	return (
		<Component className={className} {...rest}>
			{children}
		</Component>
	)
}
