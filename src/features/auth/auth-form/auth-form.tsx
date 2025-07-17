import { match } from "ts-pattern"
import z from "zod"
import { type FormHelpersFromSchema, useForm } from "../../../lib"
import { css } from "../../../styles/styled-system/css"
import {
	AppLink,
	Button,
	Card,
	Container,
	Flex,
	Input,
	PasswordField,
	Typography,
} from "../../ui"

const schema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
})

type AuthHelpers = FormHelpersFromSchema<typeof schema>

type Props = {
	mode: "login" | "register"
	onSubmit: (
		data: { email: string; password: string },
		helpers: AuthHelpers,
	) => Promise<void>
}

export function AuthForm(props: Props) {
	const form = useForm({
		schema,
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async (values, helpers) => {
			await props.onSubmit(values, helpers)
		},
	})

	return (
		<Container
			as="section"
			maxWidth="md"
			className={css({
				py: "2xl",
			})}
		>
			<form
				autoComplete="off"
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
			>
				<Card>
					<Flex direction="column" gap="md" align="stretch">
						<Typography.Heading
							textStyle="xl"
							weight={"bold"}
							color="text"
							level={2}
						>
							{props.mode === "login" ? "Login" : "Register"}
						</Typography.Heading>
						<form.Field name="email">
							{(field) => (
								<Input {...field} label="Email" error={field.meta.error} />
							)}
						</form.Field>
						<form.Field name="password">
							{(field) => (
								<PasswordField
									{...field}
									label="Password"
									error={field.meta.error}
								/>
							)}
						</form.Field>
						<form.Subscribe selector={(s) => s.meta.formError}>
							{(formError) => (
								<Typography.Text color="danger" textStyle={"sm"}>
									{formError}
								</Typography.Text>
							)}
						</form.Subscribe>
						<form.Subscribe
							selector={(s) => [s.meta.isSubmitting, s.meta.canSubmit]}
						>
							{([isSubmitting, canSubmit]) => (
								<Button type="submit" disabled={!canSubmit || isSubmitting}>
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
			</form>
		</Container>
	)
}
