import { match } from "ts-pattern"
import z from "zod"
import { css } from "../../../../styled-system/css"
import { useAppForm } from "../../form"
import { AppLink, Button, Card, Container, Flex, Typography } from "../../ui"

type Props = {
	mode: "login" | "register"
	onSubmit: (data: { email: string; password: string }) => Promise<void>
	error?: string
}

const AuthSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
})

export function AuthForm(props: Props) {
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChangeAsync: AuthSchema,
			onChangeAsyncDebounceMs: 300,
		},
		onSubmit: async (data) => {
			await props.onSubmit({
				email: data.value.email,
				password: data.value.password,
			})
		},
	})

	return (
		<Container
			as="section"
			maxWidth="sm"
			className={css({
				py: "2xl",
			})}
		>
			<Card
				as="form"
				autoComplete="off"
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
			>
				<Flex direction="column" gap="md" align="stretch">
					<Typography.Heading
						textStyle="xl"
						weight={"bold"}
						color="text"
						level={2}
					>
						{props.mode === "login" ? "Login" : "Register"}
					</Typography.Heading>
					<form.AppField name="email">
						{(field) => <field.InputField label="Email" />}
					</form.AppField>
					<form.AppField name="password">
						{(field) => <field.PasswordField label="Password" />}
					</form.AppField>
					{props.error && (
						<Typography.Text color="danger" textStyle={"sm"}>
							{props.error}
						</Typography.Text>
					)}
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								intent="primary"
								size={"md"}
								disabled={!canSubmit || isSubmitting}
							>
								{match([props.mode, isSubmitting])
									.with(["login", true], () => "Logging in...")
									.with(["register", true], () => "Registering...")
									.with(["login", false], () => "Login")
									.with(["register", false], () => "Register")
									.otherwise(() => "Submit")}
							</Button>
						)}
					</form.Subscribe>
					<Flex direction="row" justify={"center"} grow={"1"}>
						{props.mode === "login" ? (
							<AppLink to="/register">Register</AppLink>
						) : (
							<AppLink to="/login">Login</AppLink>
						)}
					</Flex>
				</Flex>
			</Card>
		</Container>
	)
}
