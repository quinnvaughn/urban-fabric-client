import { useMutation } from "@apollo/client/index.js"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { AuthForm } from "../../features/auth"
import { Container } from "../../features/ui"
import { CurrentUserDocument, LoginDocument } from "../../graphql/generated"

export const Route = createFileRoute("/_public/login")({
	component: RouteComponent,
})

function RouteComponent() {
	const [login] = useMutation(LoginDocument)
	const navigate = useNavigate()

	return (
		<Container>
			<AuthForm
				mode="login"
				onSubmit={async ({ email, password }, { setFormError }) => {
					const result = await login({
						variables: { input: { email, password } },
						refetchQueries: [{ query: CurrentUserDocument }],
						awaitRefetchQueries: true,
					})

					match(result.data?.login)
						.with(
							{ __typename: "ForbiddenError" },
							{ __typename: "UnauthorizedError" },
							(error) => {
								setFormError(error.message, 3000)
							},
						)
						.with({ __typename: "User" }, () => {
							navigate({ to: "/" })
						})
						.otherwise(() => {
							setFormError("An unknown error occurred")
						})
				}}
			/>
		</Container>
	)
}
