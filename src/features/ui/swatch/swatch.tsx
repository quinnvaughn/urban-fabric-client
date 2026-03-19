import { css } from "#/styles/styled-system/css"
import type { UtilityValues } from "#/styles/styled-system/types/prop-type"

export interface SwatchProps {
	size: UtilityValues["width"]
	color: string
}

const baseClass = css({ borderRadius: "2px", flexShrink: 0 })

export function Swatch({ size, color }: SwatchProps) {
	const sizeVar = `var(--spacing-${String(size).replace(".", "\\.")})`
	return (
		<span
			className={baseClass}
			style={{ width: sizeVar, height: sizeVar, backgroundColor: color }}
		/>
	)
}
