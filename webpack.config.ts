import * as CleanPlugin from "clean-webpack-plugin";
import * as fs from "fs";
import * as NodemonPlugin from "nodemon-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import * as PermissionsPlugin from "webpack-permissions-plugin";

const tsconfig = JSON.parse(fs.readFileSync("./tsconfig.json", "utf-8"));
const root = path.resolve(__dirname, ".");
const paths = {
    dist: `${root}/${tsconfig.compilerOptions.outDir}`,
    entry: `${root}/src/bin/www.ts`,
    license: "copyright-notice.txt",
    output: "server.js",
    source: "src"
};


export default {
    entry: paths.entry,
    devtool: process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map",
    node: {
        __filename: false,
        __dirname: false
    },
    target: tsconfig.compilerOptions.moduleResolution,
    externals: [
        /^[a-z\-0-9]+$/
    ],
    output: {
        filename: paths.output,
        libraryTarget: tsconfig.compilerOptions.module,
        path: paths.dist
    },
    resolve: {
        extensions: [
            ".js",
            ".ts",
            ".tsx",
            ".web.js",
            ".webpack.js",
        ],
        modules: [
            "node_modules"
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader"]
            }
        ]
    },
    plugins: [
        new CleanPlugin([paths.dist], { verbose: false }),
        new NodemonPlugin(),
        new webpack.BannerPlugin(
            { banner: fs.readFileSync(paths.license).toString() }
        ),
        new webpack.BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true
        }),
        new PermissionsPlugin({
            buildFiles: [
                {
                    path: `${paths.dist}/${paths.output}`,
                    fileMode: 0o755
                }
            ]
        })
    ]
};