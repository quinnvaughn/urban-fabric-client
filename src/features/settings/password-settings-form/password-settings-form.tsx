import { useMutation } from "@apollo/client/react"
import { useNavigate } from "@tanstack/react-router"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { match } from "ts-pattern"
import z from "zod"
import { Box, Input, Typography, useToast } from "#/features/ui"
import { EditPasswordDocument, type MeFragment } from "#/graphql/generated"
import { useForm } from "#/lib/form"
import { css } from "#/styles/styled-system/css"
import { SettingsSectionCard } from "../settings-section-card"

type Props = {
	me: MeFragment
	onUpdated?: () => void
}

const passwordBase = {
	newPassword: z.string().min(8, "New password must be at least 8 characters"),
	confirmNewPassword: z.string().min(1, "Please confirm your password"),
}

const withExistingPasswordSchema = z
	.object({
		mode: z.literal("existing-password"),
		currentPassword: z.string().min(1, "Current password is required"),
		...passwordBase,
	})
	.refine((values) => values.newPassword === values.confirmNewPassword, {
		path: ["confirmNewPassword"],
		message: "Passwords do not match",
	})

const withNoPasswordSchema = z
	.object({
		mode: z.literal("no-password"),
		currentPassword: z.string(),
		...passwordBase,
	})
	.refine((values) => values.newPassword === values.confirmNewPassword, {
		path: ["confirmNewPassword"],
		message: "Passwords do not match",
	})

const schema = z.discriminatedUnion("mode", [
	withExistingPasswordSchema,
	withNoPasswordSchema,
])

export function PasswordSettingsForm({ me, onUpdated }: Props) {
	const [editPassword] = useMutation(EditPasswordDocument)
	const navigate = useNavigate()
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const toast = useToast()

	const form = useForm({
		schema,
		defaultValues: {
			mode: me.hasPassword ? "existing-password" : "no-password",
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
		onSubmit: async (values, helpers) => {
			const response = await editPassword({
				variables: { input: { password: values.newPassword } },
			})

			const result = response.data?.editPassword
			match(result)
				.with({ __typename: "User" }, () => {
					helpers.reset()
					toast.success(me.hasPassword ? "Password updated" : "Password set")
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
					title="Password"
					submitDisabled={!canSubmit || isSubmitting || !isDirty}
				>
					{me.hasPassword ? (
						<form.Field name="currentPassword">
							{(field) => (
								<Input required invalid={!!field.meta.error}>
									<Input.Label>Current password</Input.Label>
									<Input.Field
										placeholder="••••••••"
										type={showCurrentPassword ? "text" : "password"}
										autoComplete="current-password"
										{...field}
										endAdornment={
											<button
												type="button"
												onPointerDown={(event) => event.preventDefault()}
												onClick={() => setShowCurrentPassword((prev) => !prev)}
												className={css({
													display: "inline-flex",
													cursor: "pointer",
												})}
											>
												{showCurrentPassword ? (
													<EyeClosed size={16} />
												) : (
													<Eye size={16} />
												)}
											</button>
										}
									/>
									<Input.Error>{field.meta.error}</Input.Error>
								</Input>
							)}
						</form.Field>
					) : (
						<Box
							className={css({
								display: "flex",
								alignItems: "center",
								gap: "2.5",
								padding: "3",
								border: "1px solid",
								borderColor: "stone.200",
								borderRadius: "md",
								background: "stone.100",
							})}
						>
							<Typography.Text size="sm" color="stone.600" lineHeight="tight">
								You signed in with Google. Set a password if you also want to
								sign in with email and password.
							</Typography.Text>
						</Box>
					)}

					<form.Field name="newPassword">
						{(field) => (
							<Input required invalid={!!field.meta.error}>
								<Input.Label>
									{me.hasPassword ? "New password" : "Password"}
								</Input.Label>
								<Input.Field
									placeholder="••••••••"
									type={showNewPassword ? "text" : "password"}
									autoComplete="new-password"
									{...field}
									endAdornment={
										<button
											type="button"
											onPointerDown={(event) => event.preventDefault()}
											onClick={() => setShowNewPassword((prev) => !prev)}
											className={css({
												display: "inline-flex",
												cursor: "pointer",
											})}
										>
											{showNewPassword ? (
												<EyeClosed size={16} />
											) : (
												<Eye size={16} />
											)}
										</button>
									}
								/>
								<Input.Error>{field.meta.error}</Input.Error>
							</Input>
						)}
					</form.Field>

					<form.Field name="confirmNewPassword">
						{(field) => (
							<Input required invalid={!!field.meta.error}>
								<Input.Label>Confirm new password</Input.Label>
								<Input.Field
									placeholder="••••••••"
									type={showConfirmPassword ? "text" : "password"}
									autoComplete="new-password"
									{...field}
									endAdornment={
										<button
											type="button"
											onPointerDown={(event) => event.preventDefault()}
											onClick={() => setShowConfirmPassword((prev) => !prev)}
											className={css({
												display: "inline-flex",
												cursor: "pointer",
											})}
										>
											{showConfirmPassword ? (
												<EyeClosed size={16} />
											) : (
												<Eye size={16} />
											)}
										</button>
									}
								/>
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
