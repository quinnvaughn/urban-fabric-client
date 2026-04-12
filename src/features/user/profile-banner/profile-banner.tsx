import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	bannerImageUrl?: string | null
}

export function ProfileBanner({ bannerImageUrl }: Props) {
	return bannerImageUrl ? (
		<div>Hi</div>
	) : (
		<Box
			className={css({
				height: "200px",
				flexShrink: 0,
				width: "100%",
				background:
					"linear-gradient(135deg, var(--colors-teal-700) 0%, var(--colors-teal-500) 60%, var(--colors-teal-300) 100%)",
			})}
		/>
	)
}
