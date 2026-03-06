import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { match } from "ts-pattern"
import {
	Box,
	Button,
	Divider,
	HStack,
	Input,
	Link,
	Typography,
	VStack,
} from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { GoogleSignInButton } from "../google-button"

type Props = {
	mode: "login" | "register"
}

export function AuthForm({ mode }: Props) {
	const [showPassword, setShowPassword] = useState(false)

	const googleText =
		mode === "login" ? "Continue with Google" : "Sign up with Google"
	return (
		<Box sx={{ py: "6" }}>
			<VStack gap="6">
				<GoogleSignInButton label={googleText} />
				<Divider label="or email" />
				<VStack gap="3">
					<Input>
						<Input.Label>Email</Input.Label>
						<Input.Field
							placeholder="you@example.com"
							type="email"
							autoComplete="email"
							inputMode="email"
							autoCapitalize="none"
						/>
					</Input>
					<Input>
						<Input.Label>Password</Input.Label>
						<Input.Field
							placeholder="••••••••"
							type={showPassword ? "text" : "password"}
							autoComplete={"new-password"}
							endAdornment={
								<button
									type="button"
									onPointerDown={(e) => e.preventDefault()}
									onClick={() => setShowPassword((v) => !v)}
									className={css({
										display: "inline-flex",
										cursor: "pointer",
									})}
								>
									{showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
								</button>
							}
						/>
					</Input>
					<Button intent="accent">Sign in</Button>
					{match(mode)
						.with("login", () => (
							<HStack gap="1" justify="center">
								<Typography.Text size="sm" color="stone.500">
									No account?
								</Typography.Text>
								<Link to="/register" size="sm">
									Join Urban Fabric
								</Link>
							</HStack>
						))
						.with("register", () => (
							<HStack gap="1" justify="center">
								<Typography.Text size="sm" color="stone.500">
									Already a member?
								</Typography.Text>
								<Link to="/login" size="sm">
									Sign in
								</Link>
							</HStack>
						))
						.exhaustive()}
				</VStack>
			</VStack>
		</Box>
	)
}
