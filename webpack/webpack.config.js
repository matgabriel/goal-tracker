// Configuration Webpack
// =====================

const Path = require('path')
const parts = require('./webpack.config.parts')
const merge = require('webpack-merge')

const root = Path.resolve(__dirname, '..')

const PATHS = {
  app: Path.resolve(root, 'src'),
  build: Path.resolve(root, 'public'),
  root,
  static: Path.resolve(root, 'static'),
  template: Path.resolve(root, 'src/index.html'),
}

const CORE_CONFIG = merge([
  {
    entry: {
      main: [PATHS.app],
    },
    output: {
      crossOriginLoading: 'anonymous',
      // Format des URLs de fichiers d’origine dans les source maps.
      // On vire le `?query` par défaut, qui est moche et ne sert à rien
      devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',
      // Schéma des noms de fichiers bundles. Le `[name]` sera remplacé par
      // le nom du bundle, basé sur celui de l’entrée (ex. `main`). Ce nom
      // peut contenir des chemins au début, le tout relatif à `output.path`.
      filename: '[name].js',
      // Chemin absolu racine de production des fichiers bundlés.
      path: PATHS.build,
      // Préfixe de chemin des URLs pour les fichiers produits.  Ici, on est
      // « racine domaine », mais si on prévoit un déploiement (dev ou prod)
      // dans un sous-chemin, il est impératif de le caler ici.
      publicPath: '/',
    },
  },
  parts.friendlyErrors(),
  parts.babelize({ include: PATHS.app }),
  parts.lintJS(),
  parts.loadFonts(),
  parts.loadImages({ include: PATHS.app }),
  parts.html({ template: PATHS.template }),
  parts.copyStatic({ from: PATHS.static, to: PATHS.build }),
  parts.generateSourceMaps(),
  parts.useModuleLevelCache(),
])

const devConfig = () =>
  merge.smart([
    {
      entry: { main: ['react-hot-loader/patch'] },
      mode: 'development',
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
        },
      },
    },
    CORE_CONFIG,
    parts.devServer({
      poll: process.env.POLL,
      port: 3000,
      proxy: { '/api': { target: 'http://localhost:3001/' } },
    }),
    parts.loadCSS(),
    parts.loadStylus({ include: PATHS.app }),
    parts.errorOverlay(),
  ])

const productionConfig = () =>
  merge.smart([
    {
      mode: 'production',
      // Cette nouvelle série d’options de Webpack 4 remplace pas mal d’anciennes manips,
      // notamment tout ce qui touche à `CommonsChunkPlugin`.
      optimization: {
        // Extraction à part de la *runtime* Webpack
        runtimeChunk: true,
        splitChunks: {
          // Ensure all CSS are put into a single file by MiniCSSExtractPlugin
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
            },
          },
          // Auto-splitting intelligent de tous les chunks (initiaux et asynchrones)
          // (par défaut, ça ne fait que les asynchrones).
          chunks: 'all',
        },
      },
      output: { filename: '[name].[chunkhash:8].js' },
    },
    CORE_CONFIG,
    parts.cleanDist(),
    parts.extractCSS(),
    parts.extractStylus({ include: PATHS.app }),
    parts.generateSourceMaps('source-map'),
    parts.minifyAll(),
    parts.optimizeImages(),
    parts.offline({
      // Activer AppCache en couche de secours si pas de SW
      AppCache: true,
      // Inutile de mettre en cache offline ces motifs-là
      excludes: ['**/.*', '**/*.map', '**/*.gz'],
      // En revanche, les URLs profondes de l’appli, ce serait pas mal, à
      // condition donc que le serveur sache y répondre (*deep linking*).
      externals: ['/history', '/settings'],
    }),
  ])

module.exports = (env = process.env.NODE_ENV) =>
  env === 'production' ? productionConfig() : devConfig()
