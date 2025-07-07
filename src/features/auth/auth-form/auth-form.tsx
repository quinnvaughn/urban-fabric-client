import { useForm } from "@tanstack/react-form"
import { css } from "../../../../styled-system/css"
import { Button, Container, Flex, Input, Typography } from "../../ui"

type Props = {
	mode: "login" | "register"
	onSubmit: (data: { email: string; password: string }) => void
	error?: string
}

export function AuthForm(props: Props) {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: (data) => {
			props.onSubmit({
				email: data.value.email,
				password: data.value.password,
			})
		},
	})

	const autocomplete = () => {
		return props.mode === "login" ? "current-password" : "new-password"
	}

	return (
		<Container
			as="section"
			maxWidth="sm"
			className={css({
				px: "xl",
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
							<Input
								id={field.name}
								type="email"
								label="Email"
								value={field.state.value}
								onInput={(e) => field.handleChange(e.currentTarget.value)}
								required
								autoComplete="username"
							/>
						)}
					</form.Field>
					<form.Field name="password">
						{(field) => (
							<Input
								id={field.name}
								type="password"
								label="Password"
								value={field.state.value}
								onInput={(e) => field.handleChange(e.currentTarget.value)}
								required
								autoComplete={autocomplete()}
							/>
						)}
					</form.Field>
					{props.error && (
						<Typography.Text color="danger" textStyle={"sm"}>
							{props.error}
						</Typography.Text>
					)}
					<Button
						type="submit"
						variant="primary"
						size={"md"}
						disabled={form.state.isSubmitting || form.state.isValidating}
					>
						{props.mode === "login" ? "Login" : "Register"}
					</Button>
				</Flex>
			</form>
		</Container>
	)
}
