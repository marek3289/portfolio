import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import globals from 'globals'

const styleRules = {
  semi: ['error', 'never'],
  quotes: ['error', 'single', { avoidEscape: true }],
  'jsx-quotes': ['error', 'prefer-single'],
  'max-len': [
    'error',
    {
      code: 160,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true,
    },
  ],
}

export default tseslint.config(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '_archive-v1/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}', '**/*.astro'],
    rules: styleRules,
  },
)
