import { createFileRoute } from "@tanstack/react-router"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import {
	Box,
	Button,
	Card,
	HStack,
	Input,
	Typography,
	VStack,
} from "#/features/ui"
import type { MeFragment } from "#/graphql/generated"
import { useCurrentUser } from "#/lib/graphql"
import { css } from "#/styles/styled-system/css"

export const Route = createFileRoute("/dashboard/settings")({
	component: RouteComponent,
})

function RouteComponent() {
	const { data } = useCurrentUser()
	const me = data?.me

	if (!me) return null

	return <SettingsForm me={me} />
}

function SettingsForm({ me }: { me: MeFragment }) {
	const [firstName, setFirstName] = useState(me.name.split(" ")[0] || "")
	const [lastName, setLastName] = useState(me.name.split(" ")[1] || "")
	const [email, setEmail] = useState(me.email)
	const [newPassword, setNewPassword] = useState("")
	const [confirmNewPassword, setConfirmNewPassword] = useState("")
	const [currentPassword, setCurrentPassword] = useState("")
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

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
					maxW: "500px",
					display: "flex",
					flexDirection: "column",
					gap: "6",
				})}
			>
				<Card size="sm" shadow="sm">
					<Card.Body>
						<VStack gap="4">
							<Typography.Text weight="bold" size="sm">
								Name
							</Typography.Text>
							<VStack gap="2">
								<Input>
									<Input.Label>First name</Input.Label>
									<Input.Field
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
									/>
								</Input>
								<Input>
									<Input.Label>Last name</Input.Label>
									<Input.Field
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
									/>
								</Input>
							</VStack>
						</VStack>
					</Card.Body>
					<Card.Footer>
						<HStack justify="end" gap="4" className={css({ w: "full" })}>
							<Button size="sm">Save</Button>
						</HStack>
					</Card.Footer>
				</Card>
				<Card size="sm" shadow="sm">
					<Card.Body>
						<VStack gap="4">
							<Typography.Text weight="bold" size="sm">
								Email address
							</Typography.Text>
							<VStack gap="2">
								<Input>
									<Input.Label>Email</Input.Label>
									<Input.Field
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</Input>
							</VStack>
						</VStack>
					</Card.Body>
					<Card.Footer>
						<HStack justify="end" gap="4" className={css({ w: "full" })}>
							<Button size="sm">Save</Button>
						</HStack>
					</Card.Footer>
				</Card>
				<Card size="sm" shadow="sm">
					<Card.Body>
						{me.hasPassword ? (
							<VStack gap="4">
								<Typography.Text weight="bold" size="sm">
									Password
								</Typography.Text>
								<VStack gap="2">
									<Input>
										<Input.Label>Current password</Input.Label>
										<Input.Field
											placeholder="••••••••"
											type={showCurrentPassword ? "text" : "password"}
											autoComplete="current-password"
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											endAdornment={
												<button
													type="button"
													onPointerDown={(e) => e.preventDefault()}
													onClick={() => setShowCurrentPassword((v) => !v)}
													className={css({
														display: "inline-flex",
														cursor: "pointer",
													})}
												>
													{showCurrentPassword ? (
														<EyeClosed size={16} />
													) : (
														<Eye size={16} />
													)}
												</button>
											}
										/>
									</Input>
									<Input>
										<Input.Label>New password</Input.Label>
										<Input.Field
											placeholder="••••••••"
											type={showNewPassword ? "text" : "password"}
											autoComplete="new-password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											endAdornment={
												<button
													type="button"
													onPointerDown={(e) => e.preventDefault()}
													onClick={() => setShowNewPassword((v) => !v)}
													className={css({
														display: "inline-flex",
														cursor: "pointer",
													})}
												>
													{showNewPassword ? (
														<EyeClosed size={16} />
													) : (
														<Eye size={16} />
													)}
												</button>
											}
										/>
									</Input>
									<Input>
										<Input.Label>Confirm new password</Input.Label>
										<Input.Field
											placeholder="••••••••"
											type={showConfirmNewPassword ? "text" : "password"}
											autoComplete="new-password"
											value={confirmNewPassword}
											onChange={(e) => setConfirmNewPassword(e.target.value)}
											endAdornment={
												<button
													type="button"
													onPointerDown={(e) => e.preventDefault()}
													onClick={() => setShowConfirmNewPassword((v) => !v)}
													className={css({
														display: "inline-flex",
														cursor: "pointer",
													})}
												>
													{showConfirmNewPassword ? (
														<EyeClosed size={16} />
													) : (
														<Eye size={16} />
													)}
												</button>
											}
										/>
									</Input>
								</VStack>
							</VStack>
						) : (
							<div>No password</div>
						)}
					</Card.Body>
					<Card.Footer>
						<HStack justify="end" gap="4" className={css({ w: "full" })}>
							<Button size="sm">Save</Button>
						</HStack>
					</Card.Footer>
				</Card>
			</Box>
		</Box>
	)
}
