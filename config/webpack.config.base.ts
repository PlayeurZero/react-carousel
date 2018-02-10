import * as path from 'path'
import * as webpack from 'webpack'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'

const PROJECT_NAME = 'react-carousel'
const PROJECT_DIRECTORY = path.resolve(__dirname, '..')
const SRC_DIRECTORY = path.resolve(PROJECT_DIRECTORY, 'src')
const DIST_DIRECTORY = path.resolve(PROJECT_DIRECTORY, 'lib')

const config = (env): webpack.Configuration => ({
  entry: [path.resolve(SRC_DIRECTORY, 'index.ts')],
  output: {
    path: path.resolve(DIST_DIRECTORY),
    filename: 'index.js',
    publicPath: '/',
    libraryTarget: 'umd',
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(PROJECT_DIRECTORY, 'config', 'tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
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
      },
      {
        test: /\.(otf|eot|ttf|woff|woff2|png|gif|jpg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: (file) => env === 'development' ? '[path][name].[ext]' : '[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          'raw-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
  },
  plugins: [
    new webpack.EnvironmentPlugin(env),
  ],
})

export { config as default, PROJECT_DIRECTORY, SRC_DIRECTORY, DIST_DIRECTORY, PROJECT_NAME }
