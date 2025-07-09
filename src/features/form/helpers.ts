import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { FormInputField } from "./form-input-field/form-input-field"
import { FormPasswordField } from "./form-password-field"

export const { fieldContext, formContext, useFieldContext } =
	createFormHookContexts()

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		InputField: FormInputField,
		PasswordField: FormPasswordField,
	},
	formComponents: {},
})
