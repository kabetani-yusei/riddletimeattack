import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	base: '/riddletimeattack/',
	plugins: [react()],
	build: {
		outDir: 'docs',
	},
});
