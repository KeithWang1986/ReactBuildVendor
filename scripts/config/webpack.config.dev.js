const resolveApp = require('./common');
const file_list = require('../../public/file-list');
const webpack = require('webpack');
const path = require('path');

const config = {
    devtool: 'cheap-module-source-map',
    entry: file_list,
    output: {
        path: resolveApp('public/dist'),
        filename: '[name].dll.js',
        library: '[name]_library'//当前情况下将生成，`window.vendor_library`
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [
                    /public\\src/
                ],
                //include: module_list,
                //exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
                loader: 'babel-loader',
                options: {
                    // @remove-on-eject-begin
                    babelrc: false,
                    presets: [require.resolve('babel-preset-react-app')],
                    // @remove-on-eject-end
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                }
            }
        ]
    },
    plugins: [
        new webpack.DllPlugin({ // 这段配置会在 dist 目录生成一个 vendor-manifest.json 文件。
            context: resolveApp('public/dist'),
            path: path.join(resolveApp('public/dist'), '[name]-manifest.json'), // 各模块的索引文件，提供给DllReferencePlugin读取
            name: '[name]_library' // 所有的内容会存放在这个参数指定的变量下，这个参数跟 output.library保持一致
        })
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    }
};

module.exports = config;