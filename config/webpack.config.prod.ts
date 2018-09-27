import * as path from 'path'
import * as webpack from 'webpack'
import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import * as BundleAnalyzerPlugin from 'webpack-bundle-analyzer'

import baseConfig, { PROJECT_NAME, PROJECT_DIRECTORY, DIST_DIRECTORY } from './webpack.config.base'

const prodConfig = (env): webpack.Configuration => {
  const config = baseConfig(env)

  config.devtool = undefined

  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          camelCase: false,
          minimize: true,
          localIdentName: `${PROJECT_NAME}__[local]__[sha1:hash:8]`,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: path.resolve(PROJECT_DIRECTORY, 'config', 'postcss.config.js'),
          },
        },
      },
    ],
  })

  if (!config.plugins) { config.plugins = [] }

  config.plugins.push(
    new CleanWebpackPlugin(
      [path.parse(DIST_DIRECTORY).name],
      {
        dry: false,
        root: PROJECT_DIRECTORY,
        verbose: false,
      },
    ),
    new UglifyJsPlugin({
      parallel: true,
      sourceMap: false,
    }),
    new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.log.html',
      openAnalyzer: false,
    }),
  )

  return config
}

export { prodConfig as default }
