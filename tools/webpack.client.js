'use strict';

const
	path = require('path'),
	rtlcss = require('rtlcss'),
	autoprefixer = require('autoprefixer'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
	config = require('../api/config');

const production = process.env.NODE_ENV === 'production',
	wdsPath = (config.ssl_options ? 'https://' : 'http://') + config.host + ':' + config.wp_port,
	publicPath = `${wdsPath}/assets/`;

const entry = {
	app: ['./src/main.js'],
	main: ['./sass/main.scss'],
	'main-rtl': ['./sass/main.rtl.scss'],
	plugins: ['./src/plugins.js']
};

const plugins = [

];

if (config.analyze) {
	plugins.push(new BundleAnalyzerPlugin());
}

if (production) {
	plugins.unshift(new MiniCssExtractPlugin({
		filename: 'css/[name].css',
	}));
}

const rules = [
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
								loose: true,
							}
						],
						'react',
						'stage-0',
					],
					plugins: [
						'react-hot-loader/babel',
						'transform-export-extensions',
						'transform-decorators-legacy',
						'transform-runtime',
					],
					compact: true,
				}
			}
		],
		exclude: /node_modules|bower_components/,
	},
	{
		test: /main\.scss$/,
		use: getStyleLoader('ltr', true),
	},
	{
		test: /main\.rtl\.scss$/,
		use: getStyleLoader('rtl', true),
	},
	{
		test: /\.css$/,
		issuer: path.resolve(__dirname, '../sass/main.scss'),
		use: getStyleLoader('ltr', false),
	},
	{
		test: /\.css$/,
		issuer: path.resolve(__dirname, '../sass/main.rtl.scss'),
		use: getStyleLoader('rtl', false),
	},
	{
		test: /\.(woff|woff2|ttf|eot|svg)$/,
		loader: 'file-loader',
		options: {
			name: './assets/[hash].[ext]',
		}
	},
	{
		issuer: path.resolve(__dirname, '../src/plugins.js'),
		use: ['cache-loader', 'script-loader']
	},
];

function getStyleLoader(dir, useSass) {
	let result = [
		{
			loader: production ? MiniCssExtractPlugin.loader : 'style-loader'
		},
		'cache-loader',
		{
			loader: 'css-loader'
		}	
	];

	if (dir === 'rtl') {
		result.push({
			loader: 'postcss-loader',
			options: {
				plugins: [
					rtlcss,
				]
			}
		});
	} else {
		result.push({
			loader: 'postcss-loader',
			options: {
				plugins: [

				]
			}
		});
	}

	if (production) {
		result[result.length - 1].options.plugins.unshift(
			autoprefixer({ browsers: ['last 2 versions', '> 1%', 'ie 9'] })
		);
	}
	if (useSass) {
		result.push({loader: 'sass-loader'});
	}
	return result;
}

module.exports = {
	devServer: {
		publicPath,
		contentBase: path.join(__dirname, '../public'),
		headers: {'Access-Control-Allow-Origin': '*' },
		stats: { colors: true },
		host: config.host,
		port: config.wp_port,
		https: config.ssl_options,
		noInfo: true,
		overlay: true,
	},
	devtool: config.sourcemap,
	entry,
	module: {
		rules,
	},
	plugins,
	node: {fs: 'empty'},
	output: {
		path: path.join(__dirname, '../public'),
		publicPath: production ? '/' : publicPath,
		chunkFilename: 'js/dist/[chunkhash].js',
		filename: 'js/dist/[name].js',
	},
	context: path.dirname(__dirname),
	mode: process.env.NODE_ENV,
	resolve: {
		modules: [
			'public',
			'node_modules'
		]
	},
	externals: {
		jquery: '$',
		moment: 'moment',
	}
};