import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { cx } from "../../../styles/styled-system/css"
import {
	type ContainerVariantProps,
	container,
} from "../../../styles/styled-system/recipes"

type PolymorphicProps<C extends ElementType, Props> = Props &
	Omit<ComponentPropsWithoutRef<C>, keyof Props> & {
		as?: C
		children?: ReactNode
	}

type ContainerOwnProps = {
	maxWidth?: ContainerVariantProps["size"]
}

export function Container<C extends ElementType = "div">({
	as,
	maxWidth = "4xl",
	className: propsClass,
	children,
	...rest
}: PolymorphicProps<C, ContainerOwnProps>) {
	const Component = as || "div"

	const base = container({
		size: maxWidth,
	})

	const className = cx(base, propsClass)

	return (
		<Component className={className} {...rest}>
			{children}
		</Component>
	)
}
