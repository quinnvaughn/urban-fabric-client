import { useApolloClient, useMutation } from "@apollo/client/index.js"
import { createFileRoute } from "@tanstack/react-router"
import { match } from "ts-pattern"
import { AuthForm } from "../../features/auth"
import { Container } from "../../features/ui"
import { RegisterDocument } from "../../graphql/generated"
import { useToast } from "../../hooks"

export const Route = createFileRoute("/_public/register")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				name: "description",
				content: "Register for a new account",
			},
			{
				title: "Register - Urban Fabric",
			},
		],
	}),
})

function RouteComponent() {
	const client = useApolloClient()
	const [register] = useMutation(RegisterDocument)
	const navigate = Route.useNavigate()
	const { addToast } = useToast()
	return (
		<Container>
			<AuthForm
				mode="register"
				onSubmit={async (data, helpers) => {
					const result = await register({ variables: { input: data } })
					match(result.data?.register)
						.with({ __typename: "User" }, async () => {
							await client.resetStore()
							navigate({ to: "/dashboard", replace: true })
						})
						.with({ __typename: "ValidationError" }, ({ errors }) => {
							errors?.forEach((error) => {
								helpers.setError(
									error.field as keyof typeof data,
									error.message,
								)
							})
						})
						.with({ __typename: "ForbiddenError" }, (error) => {
							addToast({ message: error.message, intent: "danger" })
						})
						.otherwise(() => {
							addToast({
								message: "Unexpected response from register mutation",
								intent: "danger",
							})
						})
				}}
			/>
		</Container>
	)
}
