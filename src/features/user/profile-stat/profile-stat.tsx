import { Typography, VStack } from "#/features/ui"
import { css } from "#/styles/styled-system/css"

type Props = {
	value: number
	label: string
}

export function ProfileStat({ value, label }: Props) {
	return (
		<VStack
			gap="px"
			className={css({
				"& + &": {
					paddingLeft: "6",
					borderLeft: "1px solid",
					borderLeftColor: "stone.200",
				},
			})}
		>
			<Typography.Text
				font="serif"
				weight="light"
				fontStyle="italic"
				size="2xl"
				letterSpacing="snug"
				lineHeight="none"
			>
				{new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)}
			</Typography.Text>
			<Typography.Text
				size="xxs"
				weight="medium"
				color="stone.500"
				letterSpacing="wide"
				transform="uppercase"
			>
				{label}
			</Typography.Text>
		</VStack>
	)
}
