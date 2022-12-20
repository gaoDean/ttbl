module.exports = {
	root: true,
	parserOptions: {
		sourceType: 'module'
	},
	extends: [
		'eslint:recommended',
		'airbnb-base',
		'prettier'
	],
	plugins: ['svelte3'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	env: {
		browser: true,
		es6: true,
	},
	rules: {
		'no-tabs': 'off',
	}
};
