const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        'single-cell-transformers': './assets/js/pages/single-cell-transformers.jsx',
        'transformer-evaluation': './assets/js/pages/transformer-evaluation.jsx',
        'transformer-llms': './assets/js/pages/transformer-llms.jsx'
    },
    output: {
        path: path.resolve(__dirname, 'assets/js/dist'),
        filename: '[name].bundle.js',
        publicPath: '{{ site.baseurl }}/assets/js/dist/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['last 2 versions']
                                }
                            }],
                            '@babel/preset-react'
                        ],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.ya?ml$/,
                use: 'yaml-loader',
                type: 'json'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'assets/js'),
            '@components': path.resolve(__dirname, 'assets/js/components'),
            '@utils': path.resolve(__dirname, 'assets/js/utils'),
            'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react')
        }
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    devtool: 'source-map'
};