import { css } from "../../../../styled-system/css"
import { Container, Typography } from "../../ui"

export function Footer() {
	return (
		<footer className={css({ bg: "neutral.100" })}>
			<Container maxWidth="full" className={css({ py: "sm" })}>
				<Typography.Text
					textStyle="sm"
					color="muted"
					className={css({ textAlign: "center" })}
				>
					© {new Date().getFullYear()} Urban Fabric. All rights reserved.
				</Typography.Text>
			</Container>
		</footer>
	)
}
