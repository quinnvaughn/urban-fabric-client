import { Plus } from "lucide-react"
import { useRef } from "react"
import { css, cx } from "#/styles/styled-system/css"
import { Button, type ButtonProps } from "../button"

type Props = Omit<ButtonProps, "children" | "onClick" | "startIcon"> & {
	children?: React.ReactNode
	accept?: string
	multiple?: boolean
	onFiles: (files: File[]) => void
	startIcon?: React.ReactNode
}

export function PhotoUploadButton({
	children = "Add photos",
	accept = "image/*",
	multiple = true,
	onFiles,
	startIcon = <Plus size={12} />,
	className,
	...buttonProps
}: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	return (
		<>
			<Button
				appearance="outline"
				intent="neutral"
				size="sm"
				fullWidth
				startIcon={startIcon}
				onClick={() => fileInputRef.current?.click()}
				className={cx(css({ borderStyle: "dashed" }), className)}
				{...buttonProps}
			>
				{children}
			</Button>
			<input
				ref={fileInputRef}
				type="file"
				accept={accept}
				multiple={multiple}
				className={css({ display: "none" })}
				onChange={(e) => {
					const files = Array.from(e.target.files ?? []).filter((file) =>
						file.type.startsWith("image/"),
					)
					if (files.length > 0) onFiles(files)
					e.target.value = ""
				}}
			/>
		</>
	)
}
