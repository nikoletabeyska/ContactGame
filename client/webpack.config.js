const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        open: true,
        host: 'localhost',
        historyApiFallback: true,
        port: 3000,
    },
    plugins: [
         new HtmlWebpackPlugin({
             template: 'index.html',
         }),

         new MiniCssExtractPlugin(),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /environment(.js)?$/,
                use: {
                    loader: path.resolve(__dirname, 'loaders', 'env-replacer')
                }
            },
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        config.devtool = undefined;
    } else {
        config.mode = 'development';
    }
    return config;
};