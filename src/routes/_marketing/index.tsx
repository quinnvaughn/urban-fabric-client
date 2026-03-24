import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import {
	BuiltToSpreadSection,
	HeroSection,
	HowItWorksSection,
	StartDesigningSection,
	WhatIsAFabricSection,
	WhoItIsForSection,
} from "#/features/landing-page"
import { useAnalytics } from "#/lib/analytics"

export const Route = createFileRoute("/_marketing/")({ component: App })

function App() {
	const { capture } = useAnalytics()
	useEffect(() => {
		capture("page_viewed", { page: "home" })
	}, [capture])

	return (
		<main>
			<HeroSection />
			<HowItWorksSection />
			<WhatIsAFabricSection />
			<WhoItIsForSection />
			<BuiltToSpreadSection />
			<StartDesigningSection />
		</main>
	)
}
