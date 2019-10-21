// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: {
    // to edit target browsers: use "browserslist" field in package.json
    'postcss-import': {},
    'postcss-aspect-ratio-mini': {},
    'postcss-cssnext': {},
    'postcss-px-to-viewport': {
      viewportWidth: 375,
      viewportHeight: 667,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false
    },
    cssnano: {
      preset: 'default',
      'postcss-zindex': false
    }
  }
};
