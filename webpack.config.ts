import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
import * as CleanPlugin from "clean-webpack-plugin";
import * as CopyPlugin from "copy-webpack-plugin";
import * as NodemonPlugin from "nodemon-webpack-plugin";
import * as PermissionsPlugin from "webpack-permissions-plugin";
// tslint:disable-next-line
const tsconfig = require("./tsconfig.json");
const root = path.resolve(__dirname, ".");
const paths = {
    assets: "public",
    dist: `${root}/${tsconfig.compilerOptions.outDir}`,
    entry: `${root}/src/bin/www.ts`,
    license: "copyright-notice.txt",
    output: "server.js",
    source: "src"
};


export default {
    entry: paths.entry,
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
        path: paths.dist,
        libraryTarget: tsconfig.compilerOptions.module
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
        new CleanPlugin(
            [paths.dist],
            {
                allowExternal: true,
                beforeEmit: true,
                verbose: false
            }
        ),
        new CopyPlugin([
            { from: `${paths.source}/${paths.assets}`, to: `${paths.dist}/${paths.assets}` }
        ]),
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
