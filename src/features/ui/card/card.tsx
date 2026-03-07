import * as React from "react"
import { cx } from "@/styles/styled-system/css"
import { type CardVariantProps, card } from "@/styles/styled-system/recipes"

// ---------- Context ----------

interface CardContextValue {
	styles: ReturnType<typeof card>
}

const CardContext = React.createContext<CardContextValue | null>(null)

function useCardContext() {
	const ctx = React.useContext(CardContext)
	if (!ctx) {
		throw new Error(
			"Card.Header, Card.Body, and Card.Footer must be used within <Card>",
		)
	}
	return ctx
}

// ---------- Root ----------

export interface CardRootProps
	extends React.HTMLAttributes<HTMLDivElement>,
		CardVariantProps {}

function CardRoot({
	size,
	variant,
	className,
	children,
	...rest
}: CardRootProps) {
	const styles = card({ size, variant })

	return (
		<CardContext.Provider value={{ styles }}>
			<div className={cx(styles.root, className)} {...rest}>
				{children}
			</div>
		</CardContext.Provider>
	)
}

// ---------- Media ----------
function CardMedia({
	className,
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	const { styles } = useCardContext()
	return <div className={cx(styles.media, className)} {...rest} />
}
CardMedia.displayName = "Card.Media"

// ---------- Header ----------

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardHeader({ className, ...rest }: CardHeaderProps) {
	const { styles } = useCardContext()
	return <div className={cx(styles.header, className)} {...rest} />
}
CardHeader.displayName = "Card.Header"

// ---------- Body ----------

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardBody({ className, ...rest }: CardBodyProps) {
	const { styles } = useCardContext()
	return <div className={cx(styles.body, className)} {...rest} />
}
CardBody.displayName = "Card.Body"

// ---------- Footer ----------

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardFooter({ className, ...rest }: CardFooterProps) {
	const { styles } = useCardContext()
	return <div className={cx(styles.footer, className)} {...rest} />
}
CardFooter.displayName = "Card.Footer"

// ---------- Dot-notation export ----------

export const Card = Object.assign(CardRoot, {
	Media: CardMedia,
	Header: CardHeader,
	Body: CardBody,
	Footer: CardFooter,
})
