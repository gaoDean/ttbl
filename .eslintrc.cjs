module.exports = {
	root: true,
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
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
		'import/no-unresolved': 'off',
		'import/prefer-default-export': 'off',
		'import/no-mutable-exports': 'off',
		'import/extensions': 'off',
		'no-underscore-dangle': 'off',
	}
};
