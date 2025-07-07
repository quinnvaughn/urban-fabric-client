import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
	schema: "http://localhost:4000",
	documents: ["./src/**/*.graphql", "./src/**/*.gql"],
	generates: {
		"./src/graphql/generated.ts": {
			plugins: ["typescript", "typescript-operations", "typed-document-node"],
		},
	},
}
export default config
