import { type ReactNode, useState } from "react"
import {
	Buildings3DLayer,
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
	initialIsIn3DMode?: boolean
	captureOnMount?: boolean
	onTitleSave?: (title: string) => Promise<void>
	onMapStyleChange?: (style: MapStyle) => void
	onIsIn3DModeChange?: (isIn3DMode: boolean) => void
	onViewportChange?: (viewport: {
		center: { lng: number; lat: number }
		zoom: number
	}) => Promise<void>
	onThumbnail?: (thumbnail: Blob) => Promise<string>
	onPublish?: () => void
	onSave?: () => void
	nudge?: ReactNode
} & ({ hasProposal: true; slug: string } | { hasProposal: false; slug?: never })

export function FabricEditor({
	id,
	title,
	center,
	zoom,
	initialMapStyle,
	initialIsIn3DMode = false,
	captureOnMount,
	onTitleSave,
	onMapStyleChange,
	onIsIn3DModeChange,
	onViewportChange,
	onThumbnail,
	onPublish,
	onSave,
	nudge,
	hasProposal,
	slug,
}: Props) {
	const [mapStyle, setMapStyle] = useState(initialMapStyle)
	const [is3DMode, setIs3DMode] = useState(initialIsIn3DMode)

	function updateIsIn3DMode(next: boolean) {
		setIs3DMode(next)
		onIsIn3DModeChange?.(next)
	}

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<EditorTopbar
				id={id}
				title={title}
				{...(hasProposal
					? { hasProposal: true, slug }
					: { hasProposal: false })}
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
			{nudge}
			<FabricMap center={center} zoom={zoom} bearing={0} mapStyle={mapStyle}>
				<Buildings3DLayer enabled={is3DMode} />
				<DrawingLayer />
				<SelectLayer />
				{onViewportChange && (
					<ViewportTracker onViewportChange={onViewportChange} />
				)}
				{onThumbnail && (
					<ThumbnailSync
						onThumbnail={onThumbnail}
						captureOnMount={captureOnMount}
						captureSignal={is3DMode}
					/>
				)}
				<EditorHUD
					is3DMode={is3DMode}
					onToggle3DMode={() => updateIsIn3DMode(!is3DMode)}
				/>
			</FabricMap>
		</div>
	)
}
