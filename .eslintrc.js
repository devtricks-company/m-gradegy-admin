/**
 *  @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  plugins: ['perfectionist', 'unused-imports', '@typescript-eslint', 'prettier'],
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  /**
   * 0 ~ 'off'
   * 1 ~ 'warn'
   * 2 ~ 'error'
   */
  rules: {
    // general
    'object-shorthand': 'off',
    'arrow-body-style': 'off',
    'lines-around-directive': 'off',
    'no-alert': 0,
    'spaced-comment': 'off',
    'no-useless-return': 'off',
    'no-sequences': 'off',
    'prefer-template': 'off',
    'import/order': 'off',
    'import/no-useless-path-segments': 'off',
    camelcase: 0,
    'no-empty': 'off',
    'no-console': 0,
    'no-unused-vars': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-restricted-exports': 0,
    'no-promise-executor-return': 0,
    'import/prefer-default-export': 0,
    'prefer-destructuring': [1, { object: true, array: false }],

    // typescript
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/return-await': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/consistent-type-exports': 1,
    '@typescript-eslint/consistent-type-imports': 0,
    '@typescript-eslint/dot-notation': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    '@typescript-eslint/no-unsafe-optional-chaining': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'react/jsx-no-constructed-context-values': 'off',
    // react
    'react/jsx-curly-brace-presence': 0,
    'react/no-unescaped-entities': 0,
    'react/no-children-prop': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/react-in-jsx-scope': 0,
    'react/no-array-index-key': 0,
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
    'react/function-component-definition': 0,
    'react/jsx-no-useless-fragment': [1, { allowExpressions: true }],
    'react/no-unstable-nested-components': [1, { allowAsProps: true }],
    'react/jsx-no-duplicate-props': [1, { ignoreCase: false }],
    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/control-has-associated-label': 0,
    // unused imports
    'unused-imports/no-unused-imports': 0,
    'unused-imports/no-unused-vars': [
      0,
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    // perfectionist
    // 'perfectionist/sort-exports': [1, { order: 'asc', type: 'line-length' }],
    // 'perfectionist/sort-named-imports': [1, { order: 'asc', type: 'line-length' }],
    // 'perfectionist/sort-named-exports': [1, { order: 'asc', type: 'line-length' }],
    'perfectionist/sort-imports': 0,
    'perfectionist/sort-named-imports': 0,
    'perfectionist/sort-exports': 0,
  },
};
