import { useEffect } from "react"
import { PasswordField } from "../../ui"
import { useFieldContext } from "../helpers"

type FormInputFieldProps = {
	label: string
	required?: boolean
	placeholder?: string
}

export function FormPasswordField({
	label,
	required = false,
	placeholder,
}: FormInputFieldProps) {
	const field = useFieldContext<string>()
	const {
		state: {
			value,
			meta: { isBlurred, errors },
		},
		handleChange,
		handleBlur,
		form,
		validate,
		name,
	} = field

	useEffect(() => {
		if (form.state.submissionAttempts > 0) {
			validate("submit")
		}
	}, [form.state.submissionAttempts, validate])

	const showErrors = isBlurred || form.state.submissionAttempts > 0
	const displayError = showErrors
		? errors.map((e) => e.message).join(", ")
		: undefined

	return (
		<PasswordField
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
