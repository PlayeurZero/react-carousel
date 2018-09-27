import * as path from 'path'
import * as webpack from 'webpack'

import baseConfig, { PROJECT_NAME, PROJECT_DIRECTORY, DIST_DIRECTORY } from './webpack.config.base'

const devConfig = (env): webpack.Configuration => {
  const tmpConfig = baseConfig(env)

  config.devtool = 'eval-source-map'

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
          localIdentName: `${PROJECT_NAME}__[local]`,
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

  config.devServer = {
    contentBase: DIST_DIRECTORY,
    https: false,
  }

  if (!config.plugins) { config.plugins = [] }

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  )

  return config
}

export { devConfig as default }
