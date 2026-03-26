import { css } from "@/styles/styled-system/css"

export function Kbd({ children }: { children: React.ReactNode }) {
	return (
		<kbd
			className={css({
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				minWidth: "6",
				height: "6",
				px: "1",
				background: "stone.100",
				borderRadius: "sm",
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "stone.300",
				fontSize: "xs",
				fontWeight: "medium",
				color: "stone.700",
				whiteSpace: "nowrap",
				fontFamily: "sans",
				lineHeight: "none",
				boxShadow: "sm",
			})}
		>
			{children}
		</kbd>
	)
}
