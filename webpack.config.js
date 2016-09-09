const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
const NpmInstallPlugin = require("npm-install-webpack-plugin");

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, "app"),
    build: path.join(__dirname, "build")
};

process.env.BABEL_ENV = TARGET;

const common = {
    entry: {
        app: PATHS.app
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    },
    output: {
        path: PATHS.build,
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ["eslint"],
                include: PATHS.app
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                loaders: ["style", "css"],
                include: PATHS.app
            },
            {
                test: /\.jsx?$/,
                loaders: ["babel?cacheDirectory"],
                include: PATHS.app
            }
        ]
    }
};

if (TARGET === "start" || !TARGET) {
    module.exports = merge(common, {
        devtool: "eval-source-map",
        devServer: {
            contentBase: PATHS.build,

            // Enable HTML5 History API
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            // Display only errors to reduce output
            stats: "errors-only",

            host: process.env.HOST,
            port: process.env.PORT || 2999
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new NpmInstallPlugin({
                save: true
            })
        ]
    });
}

if (TARGET === "build" || !TARGET) {
    module.exports = merge(common, {});
}
