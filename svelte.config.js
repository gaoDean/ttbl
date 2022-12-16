import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
	}
};

export default config;
