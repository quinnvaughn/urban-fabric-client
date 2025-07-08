import { createLink, type LinkComponent } from "@tanstack/react-router"
import { Button } from "../button"

const CreatedButtonLink = createLink(Button)

// Export a wrapper that always preloads on intent
export const LinkButton: LinkComponent<typeof Button> = (props) => (
	<CreatedButtonLink preload="intent" {...props} />
)
