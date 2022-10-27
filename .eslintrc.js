module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'vue/html-closing-bracket-newline': 'off',
    'dot-notation': 'off',
    'vue/require-prop-types': 'off',
    'vue/component-tags-order': 'off',
    'no-console': 'off',
  }
}
