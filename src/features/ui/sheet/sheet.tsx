import type { ReactNode } from "react"
import { css, cx } from "../../../styles/styled-system/css"
import { Dialog, useDialog } from "../dialog"

export function Sheet(props: React.ComponentProps<typeof Dialog>) {
	return <Dialog {...props} />
}

Sheet.Trigger = Dialog.Trigger

Sheet.Content = function SheetContent({
	children,
	side = "right",
	className,
}: {
	children: ReactNode
	side?: "left" | "right" | "bottom"
	className?: string
}) {
	const { open } = useDialog()
	return (
		<Dialog.ContentBase>
			<div
				className={cx(
					css({
						position: "fixed",
						top: 0,
						right: side === "right" ? 0 : "auto",
						left: side === "left" ? 0 : "auto",
						bottom: side === "bottom" ? 0 : "auto",
						width: side === "bottom" ? "100%" : "400px",
						height: side === "bottom" ? "300px" : "100%",
						borderLeft: side === "right" ? "1px solid" : "none",
						borderRight: side === "left" ? "1px solid" : "none",
						borderTop: side === "bottom" ? "1px solid" : "none",
						borderColor: "neutral.200",
						bg: "neutral.0",
						transform: open
							? "translateX(0)"
							: side === "right"
								? "translateX(100%)"
								: side === "left"
									? "translateX(-100%)"
									: "translateY(100%)",
						transition: "transform 200ms ease",
						borderRadius: 0,
						maxWidth: "none",
						display: "flex",
						flexDirection: "column",
					}),
					className,
				)}
			>
				{children}
			</div>
		</Dialog.ContentBase>
	)
}

Sheet.Header = Dialog.Header
Sheet.Title = Dialog.Title
Sheet.Description = Dialog.Description

Sheet.Footer = function SheetFooter({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div
			className={cx(
				css({
					p: "md",
					marginTop: "auto",
				}),
				className,
			)}
		>
			{children}
		</div>
	)
}
