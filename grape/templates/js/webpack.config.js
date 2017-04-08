var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('gome-common-config');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const argv = require('yargs').argv;
/*var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanPlugin = require('webpack-clean-plugin');*/



//server
if(process.env.NODE_ENV != 'production'){
    var child = require('child_process');
    var server = child.spawn('node',['./server.js']);
    server.stdout.on('data', function (data) {
        if(data)
            console.log(String(data).replace(/\r\n$|\r$|\n$/,''));
    });
    server.stderr.on('data', function (data) {
        if(data)
            console.log(String(data).replace(/\r\n$|\r$|\n$/,''));
    });
    server.on('exit', function (data) {
        if(data)
            console.log(String(data).replace(/\r\n$|\r$|\n$/,''));
    });
}


var projectName = argv.path
module.exports = {
    entry: {
        'lib-order': ['gome-ui-kit'
                ,'gome-ui-lazyload'
                ,'gome-utils-http'
                ,'gome-utils-eventbus'
                ,'gome-utils-cookie'
                ,'gome-polyfill-promise'
                ,'gome-utils-query'],
        order:'./src/' + projectName + '/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist/cdn/js/' + projectName),
        filename: '[name].js',
    },
    resolve: {
        alias: {
            //'vue$': 'vue/dist/vue.js',
            /*'gome-ui-kit': 'C:\\workspace\\npmrepo\\gome-ui-kit\\index.js',*/
            //'gome-utils-http': 'C:\\workspace\\npmrepo\\gome-utils-http\\index.js',
            //'gome-utils-eventbus': 'C:\\workspace\\npmrepo\\gome-utils-eventbus\\index.js',
        }
    },
    vue: {
        loaders: {
            js: 'babel',
        }
    },
    externals: {
        // 'vue': 'Vue',
        // 'vue-router': 'VueRouter',
        // 'Vuex': 'vuex'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                
                loader: 'vue',
            },
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /\.html$/, loader: 'html'},
            {test: /\.css$/, loader: 'style!css!less'},
            
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jp[e]g|bmp|gif)$/,
                loaders: [
                    "url-loader",
                ],
            }
        ]
    },
    postcss: function () {
        return [ require('autoprefixer')];
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        //debug打开，发版时关上
        // new webpack.SourceMapDevToolPlugin({
        //     test: [/\.js/,/\.vue/,/\.less/,/\.css/],
        //     filename: '[file].map',
        //     append: '//# sourceMappingURL=[url]',
        //     moduleFilenameTemplate: "debug:///[resource-path]",
        //     //fallbackModuleFilenameTemplate: "debug:///[resource-path]",
        // }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./node_modules/gome-vue-vendor/gomeVueVendor-manifest.json')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib-order',
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'node_modules/gome-vue-vendor/dist')
        }]),
        //debug关上，发版时打开
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
               // sourcemap: false
            }
        })
    ],

}
