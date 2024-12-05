module.exports = {
  extends: [
    'semistandard'
  ],
  plugins: [
    'react'
  ],
  rules: {
    'padded-blocks': 0,
    'eol-last': 0,
    'space-before-function-paren': 0,
    'no-extra-semi': 0,
    'no-unused-vars': 0,
    'quote-props': 0,
    'quotes': 0,
    'comma-dangle': 0,
    'no-throw-literal': 0,
    'prefer-promise-reject-errors': 0,
    "react/jsx-indent": ["error", 2],
    'react/jsx-indent-props': ["error", 2],
  }
};