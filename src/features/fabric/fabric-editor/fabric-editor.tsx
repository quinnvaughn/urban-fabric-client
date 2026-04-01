import { useState } from "react"
import {
	DrawingLayer,
	EditorCommandPalette,
	EditorHUD,
	EditorTopbar,
	ElementPanel,
	FabricMap,
	PropertiesPanel,
	SelectLayer,
	ViewportTracker,
} from "#/features/fabric"
import { ThumbnailSync } from "#/features/fabric/thumbnail-sync"
import type { MapStyle } from "#/graphql/generated"

type Props = {
	id: string
	title: string
	center: [number, number]
	zoom: number
	initialMapStyle: MapStyle
	captureOnMount?: boolean
	onTitleSave?: (title: string) => Promise<void>
	onMapStyleChange?: (style: MapStyle) => void
	onViewportChange?: (viewport: {
		center: { lng: number; lat: number }
		zoom: number
	}) => Promise<void>
	onThumbnail?: (thumbnail: string) => Promise<void>
	onPublish?: () => void
	onSave?: () => void
} & (
	| { hasProposal: true; slug: string }
	| { hasProposal: false; slug?: never }
)

export function FabricEditor({
	id,
	title,
	center,
	zoom,
	initialMapStyle,
	captureOnMount,
	onTitleSave,
	onMapStyleChange,
	onViewportChange,
	onThumbnail,
	onPublish,
	onSave,
	hasProposal,
	slug,
}: Props) {
	const [mapStyle, setMapStyle] = useState(initialMapStyle)

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<EditorTopbar
				id={id}
				title={title}
				{...(hasProposal ? { hasProposal: true, slug } : { hasProposal: false })}
				onTitleSave={onTitleSave}
				onPublish={onPublish}
				onSave={onSave}
				mapStyle={mapStyle}
				onMapStyleChange={(style) => {
					setMapStyle(style)
					onMapStyleChange?.(style)
				}}
			/>
			<ElementPanel />
			<PropertiesPanel />
			<EditorCommandPalette />
			<FabricMap center={center} zoom={zoom} bearing={0} mapStyle={mapStyle}>
				<DrawingLayer />
				<SelectLayer />
				{onViewportChange && <ViewportTracker onViewportChange={onViewportChange} />}
				{onThumbnail && <ThumbnailSync
					onThumbnail={onThumbnail}
					captureOnMount={captureOnMount}
				/>}
				<EditorHUD />
			</FabricMap>
		</div>
	)
}
