import { Box } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	bannerImageUrl?: string | null
}

export function ProfileBanner({ bannerImageUrl }: Props) {
	return bannerImageUrl ? (
		<Box
			className={css({
				width: "100%",
				bg: "stone.100",
				display: "flex",
				justify: "center",
			})}
		>
			<img
				src={bannerImageUrl}
				alt=""
				className={css({
					height: "200px",
					width: "100%",
					objectFit: "cover",
					objectPosition: "center",
					display: "block",
					flexShrink: 0,
				})}
			/>
		</Box>
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
