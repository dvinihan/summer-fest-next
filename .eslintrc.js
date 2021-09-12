module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    // 'implicit-arrow-linebreak': 'off',
    // 'comma-dangle': 'off',
    // 'react/jsx-one-expression-per-line': 'off',
    // 'react/jsx-curly-newline': 'off',
    // 'object-curly-newline': 'off',
    // 'no-plusplus': 'off',
    // 'operator-linebreak': 'off',
    // 'no-confusing-arrow': 'off',
    // 'function-paren-newline': 'off',
  },
};
