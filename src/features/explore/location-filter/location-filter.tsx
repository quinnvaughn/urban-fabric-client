import { useLazyQuery } from "@apollo/client/react"
import { MapPin, Navigation, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button, HStack, Input, Menu, useToast } from "#/features/ui"
import { GeocodeLocationDocument } from "#/graphql/generated"
import { useDebounce } from "#/lib/hooks"
import { css } from "#/styles/styled-system/css"

export type SelectedLocation = {
	label: string
	lat: number
	lng: number
}

type Props = {
	focusLat?: number
	focusLng?: number
	value: SelectedLocation | null
	onChange: (location: SelectedLocation | null) => void
}

export function LocationFilter({ focusLat, focusLng, value, onChange }: Props) {
	const toast = useToast()
	const inputRef = useRef<HTMLInputElement>(null)
	const [locationSearch, setLocationSearch] = useState("")
	const debouncedSearch = useDebounce(locationSearch)

	const [geocodeLocation, { data, loading }] = useLazyQuery(
		GeocodeLocationDocument,
	)

	// biome-ignore lint/correctness/useExhaustiveDependencies: geocodeLocation is a stable Apollo reference
	useEffect(() => {
		if (debouncedSearch.length < 3) return
		geocodeLocation({
			variables: {
				query: debouncedSearch,
				limit: 5,
				focusLat,
				focusLng,
			},
		})
	}, [debouncedSearch, focusLat, focusLng])

	function handleNearMe() {
		if (!navigator.geolocation) {
			toast.error("Location unavailable", {
				description: "Your browser doesn't support geolocation.",
			})
			return
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				onChange({
					label: "Near me",
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				})
			},
			() => {
				toast.error("Location access denied", {
					description: "Enable location permissions in your browser settings.",
				})
			},
		)
	}

	function handleOpenChange(open: boolean) {
		if (!open) setLocationSearch("")
		else setTimeout(() => inputRef.current?.focus(), 0)
	}

	const searching = debouncedSearch.length >= 3
	const hasResults = !!data?.geocodeLocation.length
	const noResults = searching && !loading && !hasResults

	return (
		<HStack gap="0" align="center">
			<Menu
				placement={{ base: "bottom-end", sm: "bottom-start" }}
				onOpenChange={handleOpenChange}
			>
				<Menu.Trigger>
					<Menu.FilterTrigger active={!!value}>
						<HStack gap="1" align="center">
							<MapPin size={12} />
							<span>{value?.label ?? "Location"}</span>
						</HStack>
					</Menu.FilterTrigger>
				</Menu.Trigger>
				<Menu.Content size="lg">
					<Input size="sm">
						<Input.Field
							ref={inputRef}
							startAdornment={<Search size={12} />}
							placeholder="Search cities"
							value={locationSearch}
							onChange={(e) => setLocationSearch(e.target.value)}
							endAdornment={
								locationSearch.length > 0 ? (
									<button
										type="button"
										onClick={() => setLocationSearch("")}
										className={css({
											cursor: "pointer",
											color: "stone.400",
											_hover: { color: "stone.600" },
										})}
									>
										<X size={12} />
									</button>
								) : undefined
							}
						/>
					</Input>
					{!searching && (
						<Menu.Item
							onClick={handleNearMe}
							className={css({ color: "brand.600" })}
						>
							<HStack gap="1.5" align="center">
								<Navigation size={12} />
								<span>Near me</span>
							</HStack>
						</Menu.Item>
					)}
					{searching && loading && (
						<p
							className={css({
								px: "3",
								py: "2",
								fontSize: "xs",
								color: "stone.400",
							})}
						>
							Searching...
						</p>
					)}
					{noResults && (
						<p
							className={css({
								px: "3",
								py: "2",
								fontSize: "xs",
								color: "stone.400",
							})}
						>
							No results found
						</p>
					)}
					{searching &&
						!loading &&
						hasResults &&
						data.geocodeLocation.map((result) => (
							<Menu.Item
								key={`${result.lat},${result.lng}`}
								onClick={() =>
									onChange({
										label: result.displayName,
										lat: result.lat,
										lng: result.lng,
									})
								}
							>
								{result.displayName}
							</Menu.Item>
						))}
				</Menu.Content>
			</Menu>
			{value && (
				<Button
					type="button"
					aria-label="Clear location"
					onClick={() => onChange(null)}
					appearance="ghost"
					intent="neutral"
					size="xs"
				>
					<X size={10} />
				</Button>
			)}
		</HStack>
	)
}
