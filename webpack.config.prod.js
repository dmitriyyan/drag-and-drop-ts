const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/app.ts',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	plugins: [
		new CleanPlugin.CleanWebpackPlugin(),
		new HtmlWebPackPlugin({
			template: './app/src/index.html',
			title: 'Test',
		}),
	],
};
