import { useMutation } from "@apollo/client/index.js"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
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
	const [error, setError] = useState<string | undefined>(undefined)

	useEffect(() => {
		// Clear error when component mounts
		setError(undefined)
	}, [])

	// clear error after 3 seconds
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(undefined)
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [error])

	return (
		<Container>
			<AuthForm
				mode="login"
				error={error}
				onSubmit={async ({ email, password }) => {
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
								setError(error.message || "An unknown error occurred")
							},
						)
						.with({ __typename: "User" }, () => {
							navigate({ to: "/" })
						})
						.otherwise(() => {
							setError("An unknown error occurred")
						})
				}}
			/>
		</Container>
	)
}
