// Portions réutilisables pour la configuration Webpack
// ====================================================

const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OfflinePlugin = require('offline-plugin')
const Path = require('path')
const webpack = require('webpack')

// Chargeurs de syntaxe
// --------------------
//
// C’est le cœur de Webpack: les chargeurs de syntaxe qui nous
// permettent, depuis notre JS, de déclarer nos dépendances à des
// *assets* quelconques (CSS, images, fontes…) via les mécanismes
// habituels d’`import`/`require`.

// CSS & SASS
// ----------
//
// Tous ces extracteurs (prod) et injecteurs (dev) utilisent PostCSS avec
// cssnext, se basant sur une config partagée type `.browserslistrc`.

// Extraction en fichier à part des sources `.css`, orientée production donc.
// Le fichier produit inclue automatiquement un hash pour le *Long-Term Caching*.
exports.extractCSS = ({ include, exclude, modules } = {}) =>
  extractStyling({ ext: 'css', include, exclude, modules })

// Idem, mais pour les sources `.scss`.  Préfixe la pipeline de chargeurs par
// le transpileur SASS.
exports.extractStylus = ({ include, exclude, modules } = {}) =>
  extractStyling({ ext: 'styl', include, exclude, modules, altLang: 'stylus' })

// Injection dans le DOM des sources `.css`, orientée développement et
// chargement dynamique en production (*fallback loader* de l’extracteur).
exports.loadCSS = ({ include, exclude, modules } = {}) =>
  loadStyling({ ext: 'css', include, exclude, modules })

// Idem, mais pour les sources `.scss`.
exports.loadStylus = ({ include, exclude, modules } = {}) =>
  loadStyling({ ext: 'styl', include, exclude, modules, altLang: 'stylus' })

exports.loadFonts = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(?:woff2?|eot|ttf|otf)$/,
        include,
        exclude,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, name: '[sha256:hash:16].[ext]' },
          },
        ],
      },
    ],
  },
})

// Charge les images en préférant un *inlining* en-dessous de 10Ko,
// sous forme d’URL `data:` en Base64 (pour les images *raster*, basées
// pixels) ou UTF-8 (pour les SVG).  Les fichiers générés sont automatiquement
// hashés, par précaution à 16 caractères (8 suffiraient sans doute).
// Les SVG inlinées sont retravaillées pour passer correctement sur cette
// !@# d’IE.

exports.loadImages = ({ include, exclude, ieSafeSVGs = true } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(?:jpe?g|png|gif)$/,
        include,
        exclude,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 10000, name: '[sha256:hash:16].[ext]' },
          },
        ],
      },
      {
        test: /\.svg$/,
        include,
        exclude,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              iesafe: ieSafeSVGs,
              limit: 10000,
              name: '[sha256:hash:16].[ext]',
              stripdeclarations: true,
            },
          },
        ],
      },
    ],
  },
})

// Génération dynamique du gabarit HTML
// ------------------------------------
//
// Génère dynamiquement un `index.html` (ou autre, selon options), qui
// comprendra les bonnes balises `<script>` (et éventuellement `<link rel="stylesheet"/>`)
// en fonction des bundles définis dans la configuration.  Peut être appelé plusieurs fois
// avec ses [moult options](https://github.com/webpack-contrib/html-webpack-plugin#readme)
// pour générer plusieurs fichiers.

exports.html = (options) => {
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  return { plugins: [new HtmlWebpackPlugin(options)] }
}

// Toute dépendance aboutissant à un fichier `.js` sera
// d’abord «moulinée» par Babel. On met les compilations en cache,
// avec un cache par environnement (dev, prod, test…), et on
// limitera probablement avec `include` et/ou `exclude`.  Les
// options de Babel sont tirées de sa config dans `package.json`,
// en s'assurant toutefois qu'on ne transpilera pas, dans Webpack,
// les syntaxes d'import/export de modules ES, car ça permet d'améliorer
// les perfs de *tree shaking* et de *module concatenation* de Webpack
// pour les builds de prod.

exports.babelize = ({ include, exclude = /node_modules/ } = {}) => {
  const options = JSON.parse(
    fs.readFileSync(Path.resolve(__dirname, '../package.json'))
  ).babel
  options.presets.forEach(function(preset) {
    if (preset instanceof Array && preset[0] === '@babel/preset-env') {
      preset[1].modules = false
    }
  })

  return {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include,
          exclude,
          use: [{ loader: 'babel-loader', options }],
        },
      ],
    },
  }
}

exports.friendlyErrors = ({
  icon,
  notify = false,
  title = 'Webpack Build Error',
} = {}) => {
  let opts = {}
  if (notify) {
    const notifier = require('node-notifier')
    opts = {
      onErrors(severity, errors) {
        if (severity !== 'error') {
          return
        }

        const error = errors[0]
        notifier.notify({
          title,
          message: `${severity} : ${error.name}`,
          subtitle: error.file || '',
          icon,
        })
      },
    }
  }

  return {
    plugins: [new FriendlyErrorsWebpackPlugin(opts)],
  }
}

exports.errorOverlay = () => {
  const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
  const path = require('path')

  return {
    // eval-based source maps can't work with this overlay
    devtool: 'cheap-module-source-map',
    // We need absolute filenames for proper click-to-open-editor behavior
    output: {
      devtoolModuleFilenameTemplate(info) {
        return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
      },
    },
    plugins: [new ErrorOverlayPlugin()],
  }
}

exports.copyStatic = ({ from, to }) => ({
  plugins: [
    // Copie / met à dispo en mémoire des fichiers statiques vers un
    // chemin en sortie.  On aurait pu les coller direct dans `public/`,
    // mais alors Webpack ne les aurait pas «détectés», et d’autres
    // plugins ne les auraient pas pris en compte (tels que la gestion
    // de l’*offline*, par exemple).
    new CopyWebpackPlugin([{ from, to }]),
  ],
})

// Source Maps
// -----------
//
// Webpack nous propose une bonne demi-douzaine de types de
// [source maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
// pour nos fichiers transpilés et le bundle final, mais seules
// certaines garantissent le bon fonctionnement des points
// d’arrêt dans Chrome.  On utilise ici celle qui, parmi les «bonnes»,
// est créée le plus vite par Webpack.
// devtool: '#inline-source-map'

exports.generateSourceMaps = (type = 'cheap-module-source-map') => ({
  devtool: type,
})

// ESLint
// ------
//
// Permet d’assurer le *linting* pendant le build, indépendamment de son recours
// dans l’éditeur / EDI ou en hook de pre-commit Git.  Exclue `node_modules` par
// défaut.  La configuration est supposée externe (`.eslintrc.json` ou clé
// `eslintConfig` dans `package.json`).
exports.lintJS = ({ include, exclude = /node_modules/ } = {}) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include,
        exclude,
        use: ['eslint-loader'],
      },
    ],
  },
})

// Purge le dossier de build (`output.path`), ce qui est notamment utile quand les noms de fichiers
// changent parfois d’un build à l’autre, par exemple en raison de leur hash.
exports.cleanDist = (options) => {
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  return { plugins: [new CleanWebpackPlugin(options)] }
}

// Active le plugin `HardDisk`, qui cache de façon persistente la plupart des étapes intermédiaires de
// traitement de modules par les chargeurs et les plugins, au moyen du mécanisme Webpack de *records*.
// Sans doute l’opti la plus impactante à mettre en place pour réduire les temps de builds, en dev comme
// en prod.  Webpack 5 devrait en réduire considérablement l’intérêt, on verra bien…
exports.useModuleLevelCache = (options) => {
  const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
  return { plugins: [new HardSourceWebpackPlugin(options)] }
}

// Personnalisation du serveur de webpack-Dev-Server.  On est en mode `hot` par défaut (`hot`, pas `hotOnly`),
// avec dans ce cas le plugin HMR injecté ainsi que celui qui donne leurs noms utiles aux modules (plutôt que
// des IDs strictement numériques, totalement inutilisables au débogage).  On active aussi de base le *deep linking*
// (option `historyApiFallback` à `true`) : toute URL non reconnue, hors proxying éventuel, renverra le `/index.html`.
//
// Par rapport aux options de base du bloc `devServer`, on ajoute un peu de confort :
//
// - Au lieu d’options booléennes séparées `hot` et `hotOnly`, on a `hot` qui peut valoir `true`, `false` ou `'only'`.
// - Au lieu d’options séparées `open` et `openPage`, on a une option `open` qui peut valoir `true`, `false` ou l’URL à ouvrir.
exports.devServer = ({
  contentBase,
  hot = true,
  https,
  open,
  poll,
  port,
  proxy,
  react = false,
} = {}) => {
  const devServer = {
    contentBase,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    https,
    noInfo: true,
    overlay: true,
    port,
    proxy,
  }

  const plugins = []
  if (hot) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    )
  }

  if (poll !== undefined) {
    devServer.watchOptions = { poll: !!poll }
  }
  if (hot === 'only') {
    devServer.hotOnly = true
  } else {
    devServer.hot = !!hot
  }
  if (typeof open === 'string') {
    devServer.openPage = open
  } else {
    devServer.open = !!open
  }

  return { devServer, plugins }
}

// Méthode générique de non-bundling de `require(…)` dynamiques.  En pratique,
// surtout utilisée via son cas particulier Moment.js (voir méthode suivante).
exports.ignoreDynamicRequiresFor = (requestRegExp, contextRegExp) => ({
  plugins: [new webpack.IgnorePlugin(requestRegExp, contextRegExp)],
})

// Ne bundle pas par défaut les locales de Moment.js (~50Ko min+gz quand même !),
// nous laissant le soin de requérir/importer manuellement ceux dont on a besoin.
exports.ignoreMomentLocales = () =>
  exports.ignoreDynamicRequiresFor(/^\.\/locale$/, /moment$/)

// Minifie les JS (auto de base) **et les CSS**.  Définir l’option écrase sa
// valeur par défaut, donc on la restaure côté Terser.
exports.minifyAll = () => {
  const TerserPlugin = require('terser-webpack-plugin')
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  return {
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
  }
}

// Offline management
// ------------------

// Super plugin de traitement *a posteriori* qui génère et maintient
// pour nous les fichiers nécessaires à un fonctionnement *offline-first*:
// source de ServiceWorker (`sw.js`) et solution de secours basée
// Application Cache (dossier `appcache`).
exports.offline = (options) => ({
  plugins: [new OfflinePlugin(options)],
})

// Passe les images (inline ou non) par imagemin, lequel délègue aux optimiseurs
// de l’état de l’art par type d’image : mozjpeg pour les JPEG, pngquant pour les PNG
// (on désactive optipng, moins performant), gifsicle pour les GIF, et svgo pour les SVG.
// On cale par défaut le facteur de qualité des JPEG à 75, amplement suffisant pour 99,9% des cas.
//
// Si vous spritez les images, assurez-vous de faire passer cette optimisation *après* le spriting,
// pas avant (donc *avant* en termes de pipeline de chargeurs…).
exports.optimizeImages = (options = {}) => {
  options = {
    optipng: { enabled: false },
    ...options,
    mozjpeg: { quality: 75, ...(options.mozjpeg || {}) },
  }
  return {
    module: {
      rules: [
        {
          test: /\.(?:jpe?g|png|gif|svg)$/,
          use: [{ loader: 'image-webpack-loader', options }],
        },
      ],
    },
  }
}

// Helper functions
// ----------------

// Construit une pipeline de chargeurs CSS, avec ou sans `style-loader` en fin de chaîne (début de tableau, donc),
// assurant notamment PostCSS avec css-next mais aussi, en début de pipeline (fin de tableau), un éventuel
// transpileur si `altLang` est fourni (ex. `sass`, `stylus`, `less`).  Cœur de génération des règles pour les
// extracteurs (prod) et injecteurs (dev) de style.
//
// L’option `modules`, si elle est juste booléenne, se transforme en une série d’options fines pour de meilleures
// pratiques : export *camel-case only* et construction plus « débogable » des noms de classes dynamiques.
function buildCSSRule({
  ext,
  altLang = null,
  include,
  exclude,
  modules = false,
  useStyle = false,
}) {
  const cssOptions = { importLoaders: 1, sourceMap: true }
  if (modules === true) {
    modules = {
      camelCase: 'only',
      localIdentName: '_[name]-[local]-[hash:base64:4]',
      modules: true,
    }
  }
  if (modules) {
    Object.assign(cssOptions, modules)
  }

  const result = {
    test: new RegExp(`\\.${ext}$`),
    include,
    exclude,
    use: [
      { loader: 'css-loader', options: cssOptions },
      {
        loader: 'postcss-loader',
        options: {
          plugins: (loader) => [require('postcss-cssnext')()],
          sourceMap: true,
        },
      },
    ],
  }

  if (altLang) {
    result.use.push({
      loader: `${altLang}-loader`,
      options: { sourceMap: true },
    })
  }

  if (useStyle) {
    result.use.unshift('style-loader')
  }

  return result
}

// Afin de ne pas multiplier les plugins d’extraction, on en fait un par option
// (optionnelle d’ailleurs) `name`, et on maintient une map.  Seuls les nouveaux
// noms entraînent un ajout dans `plugins`.
const cssPlugins = new Map()

// Construction générique d’une pipeline d’extraction CSS.  Se repose en interne sur
// `buildCSSRule(…)`.
function extractStyling({ ext, include, exclude, modules, name, altLang }) {
  const cssPluginExisted = cssPlugins.has(name)
  if (!cssPluginExisted) {
    cssPlugins.set(
      name,
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })
    )
  }
  const cssPlugin = cssPlugins.get(name)

  const { test, use } = buildCSSRule({ ext, modules, altLang })

  return {
    plugins: cssPluginExisted ? [] : [cssPlugin],
    module: {
      rules: [
        {
          test,
          include,
          exclude,
          use: [MiniCssExtractPlugin.loader, ...use],
        },
      ],
    },
  }
}

// Construction générique d’une pipeline d’injection CSS.  Se repose en interne sur
// `buildCSSRule(…)`.
function loadStyling({ ext, include, exclude, modules, altLang }) {
  return {
    module: {
      rules: [
        buildCSSRule({
          ext,
          altLang,
          include,
          exclude,
          modules,
          useStyle: true,
        }),
      ],
    },
  }
}
