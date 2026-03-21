import { createFileRoute } from "@tanstack/react-router"
import { DeleteAccountCard } from "#/features/settings/delete-account-card"
import { EmailSettingsForm } from "#/features/settings/email-settings-form/email-settings-form"
import { NameSettingsForm } from "#/features/settings/name-settings-form/name-settings-form"
import { PasswordSettingsForm } from "#/features/settings/password-settings-form/password-settings-form"
import { Box } from "#/features/ui"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/dashboard/settings/")({
	component: RouteComponent,
})

function RouteComponent() {
	const { data, refetch } = useCurrentUser()
	const me = data?.me

	if (!me) return null

	async function handleUpdated() {
		await refetch()
	}

	return (
		<Box
			className={css({
				display: "flex",
				flexDirection: "column",
				height: "100%",
				width: "100%",
				overflowY: "auto",
			})}
		>
			<Box
				className={css({
					px: "7",
					paddingTop: "7",
					paddingBottom: "12",
					flex: 1,
					maxW: "560px",
					display: "flex",
					flexDirection: "column",
					gap: "6",
				})}
			>
				<NameSettingsForm me={me} onUpdated={handleUpdated} />
				<EmailSettingsForm me={me} onUpdated={handleUpdated} />
				<PasswordSettingsForm me={me} onUpdated={handleUpdated} />
				<DeleteAccountCard />
			</Box>
		</Box>
	)
}
