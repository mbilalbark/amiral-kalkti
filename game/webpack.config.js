const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	devServer: {
		host : '127.0.0.1',
		port: 3000
	},
	devtool: 'inline-source-map',
	plugins: [
		new CopyWebpackPlugin([{
			from: 'assets',
			to: 'assets'
		}]),
		new MiniCssExtractPlugin({
			filename: 'index.css',
			chunkFilename: '[id].css',
			ignoreOrder: false,
		}),
		new HTMLWebpackPlugin({
			template: 'index.html',
			filename: 'index.html'
		})
	],
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
				]
			}
		]
	}
}