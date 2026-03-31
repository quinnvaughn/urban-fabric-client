import { type TextProps, Typography } from "../typography"

// ── FieldLabel ────────────────────────────────────────────────────────────────
// Shared label typography. Each component wraps this in whatever element is
// semantically correct (<label>, <span>, <div>) and adds context wiring on top.
// Defaults: xs / semibold / stone.700 — all overridable via props.

export function FieldLabel({
	size = "xs",
	weight = "semibold",
	color = "stone.700",
	...rest
}: TextProps) {
	return <Typography.Text size={size} weight={weight} color={color} {...rest} />
}

// ── FieldDescription ──────────────────────────────────────────────────────────
// Shared description typography. Context-specific concerns (id, aria-describedby
// registration) are handled by each component's .Description subcomponent.
// Defaults: xxs / fg.subtle — both overridable via props.

export function FieldDescription({
	as = "p",
	size = "xxs",
	color = "fg.subtle",
	...rest
}: TextProps) {
	return <Typography.Text as={as} size={size} color={color} {...rest} />
}
