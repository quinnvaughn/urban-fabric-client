import type { ButtonVariantProps } from "../../../../styled-system/recipes"
import { Button } from "../../ui"
import { useFormContext } from "../helpers"

type Props = {
	size?: ButtonVariantProps["size"]
	variant?: ButtonVariantProps["variant"]
	intent?: ButtonVariantProps["intent"]
	label: string | ((canSubmit: boolean, isSubmitting: boolean) => string)
}

export function FormSubmitButton({
	size = "md",
	variant = "solid",
	intent = "primary",
	label,
}: Props) {
	const form = useFormContext()

	return (
		<form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
			{([canSubmit, isSubmitting]) => {
				const text =
					typeof label === "function" ? label(canSubmit, isSubmitting) : label
				return (
					<Button
						type="submit"
						size={size}
						variant={variant}
						intent={intent}
						disabled={!canSubmit || isSubmitting}
					>
						{text}
					</Button>
				)
			}}
		</form.Subscribe>
	)
}
