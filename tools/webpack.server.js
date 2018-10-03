'use strict';

const
	fs = require('fs'),
	path = require('path'),
	config = require('../api/config');

const externals = ( () =>  {
	const
		externals = {},
		ignoreModules = ['.bin'];
	fs.readdirSync(path.resolve(__dirname, '../node_modules'))
		.filter(mod => ignoreModules.indexOf(mod) === -1)
		.forEach(mod =>  {
			externals[mod] = 'commonjs ' + mod;
		});
	return externals;
})();

module.exports = {
	devtool: config.sourcemap,
	entry: './server.babel.js',
	output: {
		filename: 'server.js',
		path: path.resolve(__dirname, '../build'),
	},
	target: 'node',
	externals,
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					'cache-loader',
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'env',
									{
										targets: {
											node: 'current',
										},
										useBuiltIns: true,
										loose: true,
									}
								],
								'react',
								'stage-0',
							],
							plugins: [
								'transform-decorators-legacy',
								'transform-runtime',
								'transform-export-extensions',
							],
							compact: true,
						}
					}
				],
				exclude: /node_modules|bower_components/,
			},
			{
				test: /\.(woff|woff2|ttf|eot|svg)$/,
				loader: 'file-loader',
				options: {
					name: './assets/[hash].[ext]',
					emitFile: false,
				}
			},
		],
	},
	stats: 'minimal',
	context: path.dirname(__dirname),
	mode: process.env.NODE_ENV,
	resolve: {
		modules: [
			'public',
			'node_modules'
		]
	},
};