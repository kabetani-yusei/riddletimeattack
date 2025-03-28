declare module "*.png" {
	const src: string;
	export default src;
}
declare module "*.jpg" {
	const src: string;
	export default src;
}

interface ImportMetaEnv {
	readonly VITE_GAS_ENDPOINT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
