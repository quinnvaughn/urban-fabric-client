import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { AuthForm } from "#/features/auth"
import { useAnalytics } from "#/lib/analytics"

export const Route = createFileRoute("/_marketing/_auth/register")({
	component: RouteComponent,
})

function RouteComponent() {
	const { capture } = useAnalytics()
	useEffect(() => {
		capture("signup_started", { source: "sign_in" })
	}, [capture])
	return <AuthForm mode="register" />
}
