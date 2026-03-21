import { useMutation } from "@apollo/client/react"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { match } from "ts-pattern"
import z from "zod"
import { Input, useToast } from "#/features/ui"
import { EditEmailDocument, type MeFragment } from "#/graphql/generated"
import { useForm } from "#/lib/form"
import { SettingsSectionCard } from "../settings-section-card"

type Props = {
	me: MeFragment
	onUpdated?: () => void
}

export function EmailSettingsForm({ me, onUpdated }: Props) {
	const [editEmail] = useMutation(EditEmailDocument)
	const navigate = useNavigate()
	const toast = useToast()
	const schema = z.object({
		email: z.email({ error: "Must be a valid email" }).min(1),
	})
	const form = useForm({
		schema,
		defaultValues: { email: me.email },
		onSubmit: async (values, helpers) => {
			const response = await editEmail({
				variables: { input: { email: values.email.trim() } },
			})

			const result = response.data?.editEmail
			match(result)
				.with({ __typename: "User" }, (user) => {
					helpers.reset({ email: user.email })
					toast.success("Email updated")
					onUpdated?.()
				})
				.with({ __typename: "ValidationError" }, ({ errors }) => {
					errors.forEach((error) => {
						helpers.setError(error.field, error.message)
					})
				})
				.with({ __typename: "UnauthorizedError" }, async () => {
					await navigate({ to: "/login", replace: true })
				})
				.with({ __typename: "NotFoundError" }, ({ message }) => {
					helpers.setFormError(message)
				})
				.otherwise(() => {
					helpers.setFormError("An unexpected error occurred")
				})
		},
	})

	useEffect(() => {
		form.reset({ email: me.email })
	}, [form, me.email])

	return (
		<form.Subscribe
			selector={(state) => ({
				email: state.values.email,
				canSubmit: state.meta.canSubmit,
				isSubmitting: state.meta.isSubmitting,
				isDirty: state.meta.isDirty,
			})}
		>
			{({ email, canSubmit, isSubmitting, isDirty }) => {
				const isSameEmail =
					email.trim().toLowerCase() === me.email.trim().toLowerCase()

				return (
					<SettingsSectionCard
						onSubmit={form.handleSubmit}
						title="Email address"
						submitDisabled={
							!canSubmit || isSubmitting || !isDirty || isSameEmail
						}
					>
						<form.Field name="email">
							{(field) => (
								<Input required invalid={!!field.meta.error}>
									<Input.Label>Email</Input.Label>
									<Input.Field
										type="email"
										autoComplete="email"
										inputMode="email"
										autoCapitalize="none"
										{...field}
									/>
									<Input.Error>{field.meta.error}</Input.Error>
								</Input>
							)}
						</form.Field>
						<form.Subscribe selector={(state) => state.meta.formError}>
							{(error) => (error ? <Input.Error>{error}</Input.Error> : null)}
						</form.Subscribe>
					</SettingsSectionCard>
				)
			}}
		</form.Subscribe>
	)
}
