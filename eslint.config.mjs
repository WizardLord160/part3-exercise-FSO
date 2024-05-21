import globals from 'globals'
import codeRules from '@stylistic/eslint-plugin-js'

export default [
  {
    plugins: {
      codeRules
    },
    rules: {
      'codeRules/indent': ['error', 4],
      'codeRules/linebreak-style': ['error', 'windows'],
      'codeRules/quotes': ['error', 'single'],
      'codeRules/semi': ['error', 'never'],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-console': 0,
    }
  },
  {
    files: ['**/*.js'],
    ignores: ['./eslint.config.mjs', 'dist'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
];