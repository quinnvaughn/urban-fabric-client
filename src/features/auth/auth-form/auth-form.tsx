import { match } from "ts-pattern"
import z from "zod"
import { css } from "../../../../styled-system/css"
import { useForm } from "../../../lib"
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

type Props = {
	mode: "login" | "register"
	onSubmit: (data: { email: string; password: string }) => Promise<void>
	error?: string
}

const emailSchema = z.string().email("Invalid email address")
const passwordSchema = z
	.string()
	.min(6, "Password must be at least 6 characters long")

export function AuthForm(props: Props) {
	const form = useForm({
		schema: z.object({
			email: emailSchema,
			password: passwordSchema,
		}),
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async (values) => {
			await props.onSubmit(values)
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
						{props.error && (
							<Typography.Text color="danger" textStyle={"sm"}>
								{props.error}
							</Typography.Text>
						)}
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
