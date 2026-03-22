#!/usr/bin/env node
/**
 * Nitro's dependency tracer only copies .mjs files for graphql (follows ESM graph
 * via the `module` field). But Node.js at runtime ignores `module` and falls back
 * to `main: "index"` -> legacyMainResolve -> looks for index.js (missing) -> crash.
 *
 * Fix: add an `exports` field pointing to the .mjs files that are actually present.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

const graphqlOutput = ".output/server/node_modules/graphql"
const pkgPath = join(graphqlOutput, "package.json")

if (!existsSync(pkgPath)) {
	console.log("No graphql package in output, skipping fix.")
	process.exit(0)
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))

// Build exports map from the .mjs files that are actually present
const exports = {
	".": { import: "./index.mjs", default: "./index.mjs" },
}

for (const entry of readdirSync(graphqlOutput, { withFileTypes: true })) {
	if (entry.isDirectory()) {
		const subIndex = join(graphqlOutput, entry.name, "index.mjs")
		if (existsSync(subIndex)) {
			exports[`./${entry.name}`] = {
				import: `./${entry.name}/index.mjs`,
				default: `./${entry.name}/index.mjs`,
			}
		}
	}
}

pkg.exports = exports
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
console.log(`Patched graphql package.json with exports field (${Object.keys(exports).length} entries)`)
