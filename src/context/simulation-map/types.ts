type BaseSchema = {
	label: string
	default: any
}

type NumberSchema = BaseSchema & {
	type: "number"
	min?: number
	max?: number
	step?: number
}

type EnumSchema = BaseSchema & {
	type: "enum"
	options: string[]
}

type BooleanSchema = BaseSchema & {
	type: "boolean"
}

type StringSchema = BaseSchema & {
	type: "string"
	list?: boolean
}

export type PropertySchema =
	| NumberSchema
	| EnumSchema
	| BooleanSchema
	| StringSchema

export type PropertiesSchema = Record<string, PropertySchema>
