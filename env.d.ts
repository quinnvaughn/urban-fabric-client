/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.css?url" {
	const href: string
	export default href
}
