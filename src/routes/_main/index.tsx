import { createFileRoute } from "@tanstack/react-router"
import {
	BuiltToSpreadSection,
	HeroSection,
	HowItWorksSection,
	StartDesigningSection,
	WhatIsAFabricSection,
	WhoItIsForSection,
} from "#/features/landing-page"

export const Route = createFileRoute("/_main/")({ component: App })

function App() {
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
