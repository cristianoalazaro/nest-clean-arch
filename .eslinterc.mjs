import prettierConfig from './.prettierrc.json' assert { type: 'json' }

export default {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierConfig],
    '@typescript-eslint/no-unsafe-assignment': 'off',
  },
}
