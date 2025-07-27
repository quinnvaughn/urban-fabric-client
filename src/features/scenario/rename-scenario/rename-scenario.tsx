import { useMutation } from "@apollo/client/index.js"
import { redirect } from "@tanstack/react-router"
import { match } from "ts-pattern"
import z from "zod"
import { RenameScenarioDocument } from "../../../graphql/generated"
import { useForm } from "../../../lib"
import { css } from "../../../styles/styled-system/css"
import { Button, Flex, Input } from "../../ui"

type Props = {
	name: string
	id: string
	onClose: () => void
	simulationId: string
}

const schema = z.object({
	name: z.string().min(1, { message: "Name is required" }).max(100),
})

export function RenameScenario({ name, id, onClose, simulationId }: Props) {
	const [renameScenario] = useMutation(RenameScenarioDocument)
	const form = useForm({
		schema,
		defaultValues: {
			name,
		},
		onSubmit: async (values, { setError }) => {
			const { data } = await renameScenario({
				variables: {
					input: {
						id,
						name: values.name,
					},
				},
				update: (cache) => {
					cache.modify({
						id: cache.identify({ __typename: "Scenario", id }),
						fields: {
							name: () => values.name,
						},
					})
					cache.modify({
						id: cache.identify({ __typename: "Simulation", id: simulationId }),
						fields: {
							updatedAt: () => new Date().toISOString(),
						},
					})
				},
			})
			match(data?.renameScenario)
				.with(
					{ __typename: "ForbiddenError" },
					{ __typename: "NotFoundError" },
					() => {
						redirect({ to: "/dashboard" })
					},
				)
				.with({ __typename: "ValidationError" }, ({ errors }) => {
					errors?.forEach((error) => {
						setError(error.field as keyof z.infer<typeof schema>, error.message)
					})
				})
				.with({ __typename: "UnauthorizedError" }, () => {
					redirect({ to: "/login" })
				})
				.with({ __typename: "Scenario" }, () => {
					onClose()
				})
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				form.handleSubmit()
			}}
		>
			<Flex
				direction="column"
				gap="3xl"
				className={css({ width: "300px", p: "md" })}
			>
				<form.Field name="name">
					{({ meta, ...rest }) => (
						<Input
							error={meta.error}
							{...rest}
							label="Name"
							placeholder="Enter scenario name"
						/>
					)}
				</form.Field>
				<form.Subscribe
					selector={(state) => [state.meta.isSubmitting, state.meta.canSubmit]}
				>
					{([isSubmitting, canSubmit]) => (
						<Flex justify={"end"} gap="sm">
							<Button
								size="sm"
								type="button"
								variant="ghost"
								intent="tertiary"
								onClick={() => {
									onClose()
								}}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								type="submit"
								intent="secondary"
								disabled={isSubmitting || !canSubmit}
							>
								Save
							</Button>
						</Flex>
					)}
				</form.Subscribe>
			</Flex>
		</form>
	)
}
