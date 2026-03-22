import { sva } from "#/styles/styled-system/css"

const section = sva({
	slots: ["root", "inner"],
	base: {
		root: { position: "relative", width: "full", overflow: "hidden" },
		inner: {
			maxWidth: "1160px",
			marginInline: "auto",
			paddingInline: { base: "7", md: "20" },
		},
	},
	variants: {
		bg: {
			base: { root: { bg: "bg.base" } },
			surface: {
				root: { bg: "white", borderY: "1px solid {colors.border.subtle}" },
			},
			dark: { root: { bg: "fg.default" } },
		},
		py: {
			sm: { root: { paddingBlock: "16" } },
			md: { root: { paddingBlock: { base: "12", md: "25" } } },
			lg: { root: { paddingBlock: "32" } },
		},
		minH: {
			auto: { root: {} },
			screen: {
				root: {
					minH: "calc(100vh - var(--uf-header-height))",
					inner: { display: "flex", alignItems: "center" },
				},
			},
		},
	},
	defaultVariants: { bg: "base", py: "md", minH: "auto" },
})

type Props = {
	bg?: "base" | "surface" | "dark"
	py?: "sm" | "md" | "lg"
	minH?: "auto" | "screen"
	children: React.ReactNode
}

export function LandingPageSection({ bg, py, minH, children }: Props) {
	const styles = section({ bg, py, minH })
	return (
		<section className={styles.root}>
			<div className={styles.inner}>{children}</div>
		</section>
	)
}
