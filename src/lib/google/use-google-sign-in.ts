import { useEffect, useRef } from "react"
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
					prompt: () => void
				}
			}
		}
	}
}

export function useGoogleSignIn(onCredential: (idToken: string) => void) {
	const onCredentialRef = useRef(onCredential)
	onCredentialRef.current = onCredential

	useEffect(() => {
		const script = document.createElement("script")
		script.src = "https://accounts.google.com/gsi/client"
		script.async = true
		script.onload = () => {
			window.google?.accounts.id.initialize({
				client_id: getClientEnv().VITE_GOOGLE_CLIENT_ID,
				callback: (response) => {
					onCredentialRef.current(response.credential)
				},
			})
		}
		document.head.appendChild(script)
		return () => {
			document.head.removeChild(script)
		}
	}, [])

	return () => {
		window.google?.accounts.id.prompt()
	}
}
