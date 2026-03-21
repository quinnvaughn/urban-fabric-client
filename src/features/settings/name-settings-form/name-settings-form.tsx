import { useMutation } from "@apollo/client/react"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { match } from "ts-pattern"
import z from "zod"
import { Input, useToast } from "#/features/ui"
import { EditNameDocument, type MeFragment } from "#/graphql/generated"
import { useForm } from "#/lib/form"
import { SettingsSectionCard } from "../settings-section-card"

type Props = {
	me: MeFragment
	onUpdated?: () => void
}

const schema = z.object({
	firstName: z.string().trim().min(1, "First name is required"),
	lastName: z.string().trim(),
})

function splitName(name: string) {
	const [firstName = "", ...rest] = name.trim().split(/\s+/)
	return {
		firstName,
		lastName: rest.join(" "),
	}
}

export function NameSettingsForm({ me, onUpdated }: Props) {
	const [editName] = useMutation(EditNameDocument)
	const navigate = useNavigate()
	const toast = useToast()
	const form = useForm({
		schema,
		defaultValues: splitName(me.name),
		onSubmit: async (values, helpers) => {
			const nextName = [values.firstName.trim(), values.lastName.trim()]
				.filter(Boolean)
				.join(" ")

			const response = await editName({
				variables: { input: { name: nextName } },
			})

			const result = response.data?.editName
			match(result)
				.with({ __typename: "User" }, (user) => {
					helpers.reset(splitName(user.name))
					toast.success("Name updated")
					onUpdated?.()
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
		form.reset(splitName(me.name))
	}, [form, me.name])

	return (
		<form.Subscribe
			selector={(state) => ({
				canSubmit: state.meta.canSubmit,
				isSubmitting: state.meta.isSubmitting,
				isDirty: state.meta.isDirty,
			})}
		>
			{({ canSubmit, isSubmitting, isDirty }) => (
				<SettingsSectionCard
					onSubmit={form.handleSubmit}
					title="Name"
					submitDisabled={!canSubmit || isSubmitting || !isDirty}
				>
					<form.Field name="firstName">
						{(field) => (
							<Input required invalid={!!field.meta.error}>
								<Input.Label>First name</Input.Label>
								<Input.Field {...field} />
								<Input.Error>{field.meta.error}</Input.Error>
							</Input>
						)}
					</form.Field>
					<form.Field name="lastName">
						{(field) => (
							<Input invalid={!!field.meta.error}>
								<Input.Label>Last name</Input.Label>
								<Input.Field {...field} />
								<Input.Error>{field.meta.error}</Input.Error>
							</Input>
						)}
					</form.Field>
					<form.Subscribe selector={(state) => state.meta.formError}>
						{(error) => (error ? <Input.Error>{error}</Input.Error> : null)}
					</form.Subscribe>
				</SettingsSectionCard>
			)}
		</form.Subscribe>
	)
}
