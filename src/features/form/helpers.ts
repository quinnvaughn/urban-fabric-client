import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { FormInputField } from "./form-input-field/form-input-field"
import { FormPasswordField } from "./form-password-field"
import { FormSubmitButton } from "./form-submit-button"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts()

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		InputField: FormInputField,
		PasswordField: FormPasswordField,
	},
	formComponents: {
		SubmitButton: FormSubmitButton,
	},
})
