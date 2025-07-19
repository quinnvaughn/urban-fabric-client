import type { StaticCssOptions } from "../styled-system/types/static-css"
import { button } from "./button"
import { container } from "./container"
import { flex } from "./flex"
import { grid } from "./grid"
import { iconButton } from "./icon-button"
import { input } from "./input"
import { link } from "./link"
import { typography } from "./typography"

export const recipes = {
	iconButton,
	grid,
	link,
	input,
	button,
	flex,
	typography,
	container,
}

// we just need to return iconButton: ['*'], etc. for static css

export const staticCssRecipes: StaticCssOptions["recipes"] = Object.entries(
	recipes,
).reduce(
	(acc, [key]) => {
		if (acc) {
			acc[key] = ["*"]
		}
		return acc
	},
	{} as StaticCssOptions["recipes"],
)
