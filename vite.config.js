import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	clearScreen: false,
	server: {
    strictPort: true,
  },
	// envPrefix: ['VITE_', 'TAURI_'],
	build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
	plugins: [sveltekit()]
};

export default config;
