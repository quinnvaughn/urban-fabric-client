import { useLazyQuery, useMutation } from "@apollo/client/react"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { match } from "ts-pattern"
import z from "zod"
import { Input, useToast } from "#/features/ui"
import {
	CheckIfUsernameIsAvailableDocument,
	EditUsernameDocument,
	type MeFragment,
} from "#/graphql/generated"
import { createFormContext, useForm } from "#/lib/form"
import { useDebounce } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"
import { SettingsSectionCard } from "../settings-section-card"

const schema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(20, "Username must be 20 characters or fewer")
		.refine((v) => !/\s/.test(v), "Username cannot contain spaces"),
})

const { FormProvider, useFormContext } = createFormContext<typeof schema>()

type Props = {
	me: MeFragment
	onUpdated?: () => void
}

export function UsernameSettingsForm({ me, onUpdated }: Props) {
	const [editUsername] = useMutation(EditUsernameDocument)
	const navigate = useNavigate()
	const toast = useToast()

	const form = useForm({
		schema,
		defaultValues: { username: me.username },
		onSubmit: async (values, helpers) => {
			const response = await editUsername({
				variables: { input: { username: values.username.trim() } },
			})

			const result = response.data?.editUsername
			match(result)
				.with({ __typename: "User" }, (user) => {
					helpers.reset({ username: user.username })
					toast.success("Username updated")
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
		form.reset({ username: me.username })
	}, [form, me.username])

	return (
		<FormProvider value={form}>
			<form.Subscribe
				selector={(state) => ({
					username: state.values.username,
					canSubmit: state.meta.canSubmit,
					isSubmitting: state.meta.isSubmitting,
				})}
			>
				{({ username, canSubmit, isSubmitting }) => {
					const isSame =
						username.trim().toLowerCase() === me.username.trim().toLowerCase()

					return (
						<UsernameFormInner
							me={me}
							username={username}
							canSubmit={canSubmit}
							isSubmitting={isSubmitting}
							isSame={isSame}
						/>
					)
				}}
			</form.Subscribe>
		</FormProvider>
	)
}

type InnerProps = {
	me: MeFragment
	username: string
	canSubmit: boolean
	isSubmitting: boolean
	isSame: boolean
}

function UsernameFormInner({ me, username, canSubmit, isSubmitting, isSame }: InnerProps) {
	const form = useFormContext()
	const [
		checkAvailability,
		{ data: availabilityData, loading: checkingAvailability },
	] = useLazyQuery(CheckIfUsernameIsAvailableDocument, {
		fetchPolicy: "network-only",
	})
	const debouncedUsername = useDebounce(username, 400)

	useEffect(() => {
		const trimmed = debouncedUsername.trim()
		if (trimmed && trimmed.toLowerCase() !== me.username.trim().toLowerCase()) {
			checkAvailability({ variables: { username: trimmed } })
		}
	}, [debouncedUsername, me.username, checkAvailability])

	const isAvailable = availabilityData?.checkIfUsernameIsAvailable ?? null
	const showAvailability = !isSame && !checkingAvailability && isAvailable !== null
	const isUnavailable = showAvailability && isAvailable === false
	const submitDisabled =
		!canSubmit || isSubmitting || isSame || checkingAvailability || isUnavailable

	return (
		<SettingsSectionCard
			onSubmit={form.handleSubmit}
			title="Username"
			submitDisabled={submitDisabled}
		>
			<form.Field name="username">
				{(field) => (
					<Input required invalid={!!field.meta.error || isUnavailable}>
						<Input.Label>Username</Input.Label>
						<Input.Field
							type="text"
							autoComplete="username"
							autoCapitalize="none"
							{...field}
						/>
						{field.meta.error ? (
							<Input.Error>{field.meta.error}</Input.Error>
						) : checkingAvailability ? (
							<Input.Description className={css({ color: "fg.muted" })}>
								Checking username…
							</Input.Description>
						) : showAvailability && isAvailable ? (
							<Input.Description className={css({ color: "success.default" })}>
								Username is available
							</Input.Description>
						) : showAvailability && !isAvailable ? (
							<Input.Error>Username is already taken</Input.Error>
						) : null}
					</Input>
				)}
			</form.Field>
			<form.Subscribe selector={(state) => state.meta.formError}>
				{(error) => (error ? <Input.Error>{error}</Input.Error> : null)}
			</form.Subscribe>
		</SettingsSectionCard>
	)
}
