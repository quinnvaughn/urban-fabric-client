import { useApolloClient, useMutation } from "@apollo/client/react"
import { usePostHog } from "@posthog/react"
import { useNavigate } from "@tanstack/react-router"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { match } from "ts-pattern"
import z from "zod"
import {
	Box,
	Button,
	Divider,
	HStack,
	Input,
	Link,
	Tabs,
	Typography,
	useToast,
	VStack,
} from "#/features/ui"
import {
	GoogleLoginDocument,
	LoginDocument,
	RegisterDocument,
} from "#/graphql/generated"
import { useAnalytics } from "#/lib/analytics"
import { useForm } from "#/lib/form"
import { css } from "#/styles/styled-system/css"
import { GoogleSignInButton } from "../google-button"

type Props = {
	mode: "login" | "register"
	onAuthSuccess?: () => Promise<void> | void
	onModeChange?: (mode: "login" | "register") => void
	source?: "like" | "sign_in" | "save_draft" | "publish" | "google"
}

const LoginSchema = z.object({
	mode: z.literal("login"),
	email: z.email({ error: "Must be a valid email" }).min(1),
	password: z.string().min(8, "Password must be at least 8 characters"),
})

const RegisterSchema = z.object({
	mode: z.literal("register"),
	email: z.email({ error: "Must be a valid email" }).min(1),
	password: z.string().min(8, "Password must be at least 8 characters"),
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters"),
})

const AuthSchema = z.discriminatedUnion("mode", [LoginSchema, RegisterSchema])

export function AuthForm({ mode, onAuthSuccess, onModeChange, source }: Props) {
	const [showPassword, setShowPassword] = useState(false)
	const [login] = useMutation(LoginDocument)
	const [register] = useMutation(RegisterDocument)
	const [googleLogin] = useMutation(GoogleLoginDocument)
	const toast = useToast()
	const navigate = useNavigate()
	const client = useApolloClient()
	const posthog = usePostHog()
	const { capture } = useAnalytics()

	async function handleGoogleCredential(accessToken: string) {
		try {
			const response = await googleLogin({
				variables: { input: { accessToken } },
			})
			match(response.data?.googleLogin)
				.with(
					{ __typename: "ConflictError" },
					{ __typename: "UnauthorizedError" },
					({ message }) => {
						toast.error(message)
					},
				)
				.with({ __typename: "GoogleLoginResponse" }, async (response) => {
					const { user, isNewUser } = response
					posthog.identify(user.id, { email: user.email, name: user.name })
					capture(
						isNewUser ? "signup_completed" : "login_completed",
						isNewUser ? { source: "google" } : undefined,
					)
					await client.resetStore()
					toast.success("Logged in successfully")
					if (onAuthSuccess) {
						await onAuthSuccess()
					} else {
						navigate({ to: "/dashboard", replace: true })
					}
				})
				.with(undefined, () => {
					toast.error("An unknown error occurred")
				})
				.exhaustive()
		} catch {
			toast.error("An unknown error occurred")
		}
	}

	const googleText = mode === "login" ? "continue_with" : "signup_with"

	const form = useForm({
		schema: AuthSchema,
		defaultValues: {
			mode,
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async (values) => {
			try {
				await match(values)
					.with({ mode: "login" }, async (v) => {
						const response = await login({
							variables: {
								input: {
									email: v.email,
									password: v.password,
								},
							},
						})
						match(response.data?.login)
							.with(
								{ __typename: "ConflictError" },
								{ __typename: "UnauthorizedError" },
								({ message }) => {
									form.setFormError(message)
								},
							)
							.with({ __typename: "User" }, async (user) => {
								posthog.identify(user.id, {
									email: user.email,
									name: user.name,
								})
								capture("login_completed")
								await client.resetStore()
								toast.success("Logged in successfully")
								if (onAuthSuccess) {
									await onAuthSuccess()
								} else {
									navigate({ to: "/dashboard", replace: true })
								}
							})
							.with(undefined, () => {
								form.setFormError("An unknown error occurred")
							})
							.exhaustive()
					})
					.with({ mode: "register" }, async (v) => {
						const response = await register({
							variables: {
								input: {
									email: v.email,
									password: v.password,
									name: v.name,
								},
							},
						})
						match(response.data?.register)
							.with({ __typename: "ConflictError" }, ({ message }) => {
								form.setFormError(message)
							})
							.with({ __typename: "ValidationError" }, ({ errors }) => {
								errors.forEach((error) => {
									form.setError(error.field, error.message)
								})
							})
							.with({ __typename: "User" }, async (user) => {
								posthog.identify(user.id, {
									email: user.email,
									name: user.name,
								})
								capture("signup_completed", { source: source ?? "sign_in" })
								await client.resetStore()
								toast.success("Account created successfully")
								if (onAuthSuccess) {
									await onAuthSuccess()
								} else {
									navigate({ to: "/dashboard", replace: true })
								}
							})
							.with(undefined, () => {
								form.setFormError("An unknown error occurred")
							})
							.exhaustive()
					})
					.exhaustive()
			} catch {
				form.setFormError("An unknown error occurred")
			}
		},
	})
	return (
		<form onSubmit={form.handleSubmit} noValidate>
			{onModeChange ? (
				<Tabs
					value={mode}
					onValueChange={(v) => onModeChange(v as "login" | "register")}
				>
					<Tabs.List>
						<Tabs.Trigger value="login">Sign in</Tabs.Trigger>
						<Tabs.Trigger value="register">Create account</Tabs.Trigger>
					</Tabs.List>
				</Tabs>
			) : (
				<Tabs>
					<Tabs.List>
						<Tabs.Link to="/login">Sign in</Tabs.Link>
						<Tabs.Link to="/register">Create account</Tabs.Link>
					</Tabs.List>
				</Tabs>
			)}
			<Box sx={{ py: "6" }}>
				<VStack gap="6">
					<GoogleSignInButton
						text={googleText}
						onCredential={handleGoogleCredential}
					/>
					<Divider label="or email" lines="both" />
					<VStack gap="3">
						<form.Field name="email">
							{(field) => (
								<Input required invalid={!!field.meta.error}>
									<Input.Label>Email</Input.Label>
									<Input.Field
										placeholder="you@example.com"
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

						<form.Field name="password">
							{(field) => (
								<Input required invalid={!!field.meta.error}>
									<Input.Label>Password</Input.Label>
									<Input.Field
										placeholder="••••••••"
										type={showPassword ? "text" : "password"}
										autoComplete={
											mode === "login" ? "current-password" : "new-password"
										}
										{...field}
										endAdornment={
											<button
												type="button"
												onPointerDown={(e) => e.preventDefault()}
												onClick={() => setShowPassword((v) => !v)}
												className={css({
													display: "inline-flex",
													cursor: "pointer",
												})}
											>
												{showPassword ? (
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
						{mode === "register" && (
							<form.Field name="name">
								{(field) => (
									<Input invalid={!!field.meta.error} required>
										<Input.Label>Name</Input.Label>
										<Input.Field
											placeholder="Your name"
											type="text"
											autoComplete="name"
											{...field}
										/>
										<Input.Error>{field.meta.error}</Input.Error>
									</Input>
								)}
							</form.Field>
						)}
						<form.Subscribe selector={(s) => s.meta.formError}>
							{(formError) =>
								formError ? (
									<Typography.Text color="red.500">{formError}</Typography.Text>
								) : null
							}
						</form.Subscribe>
						<form.Subscribe
							selector={(s) => [s.meta.isSubmitting, s.meta.canSubmit]}
						>
							{([isSubmitting, canSubmit]) => (
								<Button
									type="submit"
									disabled={!canSubmit}
									loading={isSubmitting}
									fullWidth
								>
									{mode === "login"
										? isSubmitting
											? "Signing in..."
											: "Sign in"
										: isSubmitting
											? "Creating account..."
											: "Create account"}
								</Button>
							)}
						</form.Subscribe>
						{match(mode)
							.with("login", () => (
								<HStack gap="1" justify="center">
									<Typography.Text size="sm" color="stone.500">
										No account?
									</Typography.Text>
									{onModeChange ? (
										<button
											type="button"
											onClick={() => onModeChange("register")}
											className={css({
												fontSize: "sm",
												color: "teal.600",
												cursor: "pointer",
												_hover: { textDecoration: "underline" },
											})}
										>
											Join Urban Fabric
										</button>
									) : (
										<Link to="/register" size="sm">
											Join Urban Fabric
										</Link>
									)}
								</HStack>
							))
							.with("register", () => (
								<HStack gap="1" justify="center">
									<Typography.Text size="sm" color="stone.500">
										Already a member?
									</Typography.Text>
									{onModeChange ? (
										<button
											type="button"
											onClick={() => onModeChange("login")}
											className={css({
												fontSize: "sm",
												color: "teal.600",
												cursor: "pointer",
												_hover: { textDecoration: "underline" },
											})}
										>
											Sign in
										</button>
									) : (
										<Link to="/login" size="sm">
											Sign in
										</Link>
									)}
								</HStack>
							))
							.exhaustive()}
					</VStack>
				</VStack>
			</Box>
		</form>
	)
}
