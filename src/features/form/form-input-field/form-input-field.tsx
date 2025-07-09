import { Input } from "../../ui"
import { useFieldContext } from "../helpers"

type FormInputFieldProps = {
	label: string
	required?: boolean
	placeholder?: string
}

export function FormInputField({
	label,
	required = false,
	placeholder,
}: FormInputFieldProps) {
	// hook into your form and apply the blur-then-change Zod validator
	const field = useFieldContext<string>()
	const {
		state: {
			value,
			meta: { isBlurred, errors },
		},
		handleChange,
		handleBlur,
		validate,
		name,
	} = field

	const displayError = isBlurred
		? errors.map((e) => e.message).join(", ")
		: undefined

	return (
		<Input
			id={name}
			name={name}
			label={label}
			value={value}
			placeholder={placeholder}
			required={required}
			onInput={(e) => handleChange(e.currentTarget.value)}
			onBlur={() => {
				handleBlur()
				validate("change")
			}}
			error={displayError}
		/>
	)
}
