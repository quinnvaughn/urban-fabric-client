import { MapPin } from "lucide-react"
import { useProposalStore } from "#/features/proposal/proposal-store"
import { Button } from "#/features/ui"
import { css } from "#/styles/styled-system/css"
import { useCommentComposerStore } from "../comment-composer-store"

type Props = {
	commentId: string
	location: {
		name: string
		lat: number
		lng: number
	}
}

export function ShowLocationPinButton({ commentId, location }: Props) {
	const { activeCommentLocation, setActiveCommentLocation } = useProposalStore()
	const { isPickingLocation, pendingLocation } = useCommentComposerStore()
	const isActive = activeCommentLocation?.commentId === commentId
	const isComposerLocationActive = isPickingLocation || Boolean(pendingLocation)

	function handleClick() {
		if (isComposerLocationActive) return
		setActiveCommentLocation(
			isActive
				? null
				: {
						commentId,
						name: location.name,
						lat: location.lat,
						lng: location.lng,
					},
		)
	}

	return (
		<Button
			appearance="subtle"
			intent={isActive ? "brand" : "neutral"}
			startIcon={<MapPin size={10} />}
			className={css({
				borderRadius: "full",
				padding: "2px 7px 2px 5px",
				minH: 0,
				fontSize: "3xs",
				gap: "1",
			})}
			onClick={handleClick}
			disabled={isComposerLocationActive}
		>
			{location.name}
		</Button>
	)
}
