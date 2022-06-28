const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const glMatrix = require("gl-matrix");

const glMatrixClasses = ["glMatrix", "mat2", "mat2d", "mat3", "mat4", "quat", "quat2", "vec2", "vec3", "vec4"];

module.exports = (isProduction) =>
{
    return {
        "mode": isProduction ? "production" : "development",
        "entry": [
            path.join(__dirname, "src", "core", "index.js"),
        ],
        "devtool": isProduction ? "source-map" : "cheap-module-eval-source-map",
        "output": {
            "path": path.join(__dirname, "build"),
            "filename": isProduction ? "cables.min.js" : "cables.max.js",
            "library": "CABLES",
            "libraryExport": "default",
            "libraryTarget": "var",
            "globalObject": "window",
        },
        "stats": isProduction,
        "optimization": { "minimize": isProduction },
        "module": {
            "rules": [
                {
                    "test": /\.frag/,
                    "use": "raw-loader",
                },
                {
                    "test": /\.vert/,
                    "use": "raw-loader",
                }
            ].filter(Boolean),
        },
        "externals": ["CABLES.UI", ...Object.keys(glMatrix), "gl-matrix"],
        "resolve": {
            "extensions": [".json", ".js", ".jsx"],
        },
        "plugins": [
            isProduction
            && new BundleAnalyzerPlugin({
                "analyzerMode": "disabled",
                "generateStatsFile": true,
            })
        ].filter(Boolean),
    };
};
