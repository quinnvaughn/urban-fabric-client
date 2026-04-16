import { X } from "lucide-react"
import { Box, Typography } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	url: string
	alt: string
	caption?: string
	placeholderCaption?: string
	onCaptionClick?: () => void
	onDelete?: () => void
	isSelected?: boolean
}

export function ElementPhotoCard({
	url,
	alt,
	caption = "",
	placeholderCaption,
	onCaptionClick,
	onDelete,
	isSelected = false,
}: Props) {
	const trimmedCaption = caption.trim()
	const displayCaption = trimmedCaption || placeholderCaption
	const showCaptionBand = !!displayCaption

	const cardContent = (
		<>
			<img
				src={url}
				alt={alt}
				className={css({
					width: "100%",
					height: "100%",
					objectFit: "cover",
					display: "block",
				})}
			/>
			{showCaptionBand && (
				<Box
					className={css({
						position: "absolute",
						left: "0",
						right: "0",
						bottom: "0",
						px: "1.5",
						py: "1",
						borderRadius: "sm",
						background:
							"linear-gradient(to top, rgba(20,20,20,0.85), rgba(20,20,20,0.18))",
					})}
				>
					<Typography.Text
						as="div"
						size="4xs"
						color="white"
						className={css({
							display: "block",
							lineHeight: "1",
							textShadow: "0 1px 2px rgba(0,0,0,0.28)",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						})}
					>
						{displayCaption}
					</Typography.Text>
				</Box>
			)}
		</>
	)

	const sharedStyles = css({
		position: "relative",
		aspectRatio: "1",
		overflow: "hidden",
		borderRadius: "md",
		border: "1px solid",
		borderColor: isSelected ? "teal.500" : "border.subtle",
		boxShadow: isSelected ? "0 0 0 2px var(--colors-teal-100)" : "none",
		background: "stone.100",
	})

	return (
		<Box className={sharedStyles}>
			{onCaptionClick ? (
				<button
					type="button"
					onClick={onCaptionClick}
					className={css({
						all: "unset",
						display: "block",
						width: "100%",
						height: "100%",
						cursor: "pointer",
					})}
				>
					{cardContent}
				</button>
			) : (
				cardContent
			)}
			{onDelete && (
				<button
					type="button"
					onClick={onDelete}
					className={css({
						position: "absolute",
						top: "1",
						right: "1",
						width: "4",
						height: "4",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border: "none",
						background: "rgba(0,0,0,0.55)",
						borderRadius: "full",
						color: "white",
						cursor: "pointer",
						_hover: { background: "rgba(0,0,0,0.8)" },
						transition: "background 150ms",
					})}
				>
					<X size={8} />
				</button>
			)}
		</Box>
	)
}
