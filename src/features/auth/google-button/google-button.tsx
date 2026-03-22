import { useEffect, useRef, useState } from "react"
import { Button } from "#/features/ui"
import { getClientEnv } from "#/lib/env/client"

type GoogleCredentialResponse = {
	credential: string
}

declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string
						callback: (response: GoogleCredentialResponse) => void
					}) => void
					renderButton: (
						element: HTMLElement,
						options: {
							theme?: "outline" | "filled_blue" | "filled_black"
							size?: "large" | "medium" | "small"
							text?: "signin_with" | "signup_with" | "continue_with" | "signin"
							width?: number
						},
					) => void
				}
			}
		}
	}
}

type Props = {
	text: "signin_with" | "signup_with" | "continue_with"
	onCredential: (idToken: string) => void
}

function GoogleIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
			<path
				d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
				fill="#4285F4"
			/>
			<path
				d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
				fill="#34A853"
			/>
			<path
				d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
				fill="#FBBC05"
			/>
			<path
				d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"
				fill="#EA4335"
			/>
		</svg>
	)
}

const LABEL: Record<Props["text"], string> = {
	signin_with: "Sign in with Google",
	signup_with: "Sign up with Google",
	continue_with: "Continue with Google",
}

export function GoogleSignInButton({ text, onCredential }: Props) {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const googleContainerRef = useRef<HTMLDivElement>(null)
	const onCredentialRef = useRef(onCredential)
	onCredentialRef.current = onCredential
	const [scriptLoaded, setScriptLoaded] = useState(false)

	useEffect(() => {
		const script = document.createElement("script")
		script.src = "https://accounts.google.com/gsi/client"
		script.async = true
		script.onload = () => setScriptLoaded(true)
		document.head.appendChild(script)
		return () => {
			document.head.removeChild(script)
		}
	}, [])

	useEffect(() => {
		if (!scriptLoaded || !googleContainerRef.current || !wrapperRef.current)
			return

		const width = wrapperRef.current.offsetWidth || 300

		window.google?.accounts.id.initialize({
			client_id: getClientEnv().VITE_GOOGLE_CLIENT_ID,
			callback: (response) => {
				onCredentialRef.current(response.credential)
			},
		})
		window.google?.accounts.id.renderButton(googleContainerRef.current, {
			theme: "outline",
			size: "large",
			text,
			width,
		})

		// Stretch Google's iframe to fill the overlay so the whole button area is clickable
		setTimeout(() => {
			const iframe = googleContainerRef.current?.querySelector("iframe")
			if (iframe) {
				iframe.style.setProperty("width", "100%", "important")
				iframe.style.setProperty("height", "100%", "important")
			}
		}, 200)
	}, [scriptLoaded, text])

	return (
		// Wrapper captures hover cursor; our Button is visual-only (pointer-events: none)
		// Google's iframe sits on top as the real click target
		<div ref={wrapperRef} style={{ position: "relative", cursor: "pointer" }}>
			<div style={{ pointerEvents: "none" }}>
				<Button
					appearance="outline"
					intent="neutral"
					fullWidth
					startIcon={<GoogleIcon />}
				>
					{LABEL[text]}
				</Button>
			</div>
			<div
				ref={googleContainerRef}
				aria-hidden="true"
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0,
				}}
			/>
		</div>
	)
}
