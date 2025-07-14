import type { ComponentPropsWithRef, ElementType, ReactNode } from "react"
import React from "react"
import { css, cx } from "../../../../styled-system/css"
import { Flex } from "../flex"
import { Grid } from "../grid"
import { Typography } from "../typography"

type Props = {
	children: ReactNode
} & Omit<ComponentPropsWithRef<"div">, "children">

export function Card({ children, ...props }: Props) {
	const baseStyles = css({
		borderWidth: "1px",
		borderColor: "neutral.200",
		borderRadius: "lg",
		p: "md",
		boxShadow: "md",
		display: "flex",
		flexDirection: "column",
		gap: "md",
	})

	return (
		<div {...props} className={cx(baseStyles, props.className)}>
			{children}
		</div>
	)
}

type CardChildrenProps = {
	children: ReactNode
	className?: string
}

Card.Header = function CardHeader({ children, className }: CardChildrenProps) {
	const childArray = React.Children.toArray(children)
	const hasAction = childArray.some(
		(child) => React.isValidElement(child) && child.type === Card.Action,
	)

	return (
		<Grid
			templateColumns={hasAction ? "1fr auto" : undefined}
			alignItems={"start"}
			autoRows="min-content"
			templateRows={"auto auto"}
			gap="xxs"
			className={className}
		>
			{children}
		</Grid>
	)
}

Card.Title = function Title({ children, className }: CardChildrenProps) {
	return (
		<Typography.Heading level={5} className={className}>
			{children}
		</Typography.Heading>
	)
}

Card.Description = function Description({
	children,
	className,
}: CardChildrenProps) {
	return (
		<Typography.Text color="muted" textStyle={"sm"} className={className}>
			{children}
		</Typography.Text>
	)
}

Card.Action = function CardAction({ children, className }: CardChildrenProps) {
	return (
		<div
			className={cx(
				css({
					justifySelf: "flex-end",
					alignSelf: "flex-start",
					gridRowStart: "1",
					gridRow: "span 2 / span 2",
					gridColumnStart: "2",
				}),
				className,
			)}
		>
			{children}
		</div>
	)
}

Card.Content = function CardContent({
	children,
	className,
}: CardChildrenProps) {
	return (
		<Flex direction="column" gap="sm" className={className}>
			{children}
		</Flex>
	)
}

Card.Footer = function CardFooter({ children, className }: CardChildrenProps) {
	return (
		<Flex direction={"column"} gap="sm" align={"center"} className={className}>
			{children}
		</Flex>
	)
}
