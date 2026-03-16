export function singularOrPlural(
	singular: string,
	plural: string,
	count: number,
): string {
	return count === 1 ? singular : plural
}

export function enumValueToReadableLabel(value: string): string {
	const words = value
		.toLowerCase()
		.split("_")
		.filter((word) => word.length > 0)

	if (words.length === 0) {
		return ""
	}

	const [firstWord, ...remainingWords] = words
	return [
		firstWord[0].toUpperCase() + firstWord.slice(1),
		...remainingWords,
	].join(" ")
}
