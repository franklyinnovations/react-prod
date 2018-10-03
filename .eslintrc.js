module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true
		},
		sourceType: 'module'
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
	],
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
	},
	plugins: [
		'react'
	],
	rules: {
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
				ignoredNodes: [
					"ConditionalExpression"
				]
			}
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		quotes: [
			'error',
			'single'
		],
		semi: [
			'error',
			'always'
		],
		'no-console': ['warn'],
		'react/prop-types': 'off'
	},
	globals: {
		$: false,
		vex: false,
		Messenger: false,
	},
};