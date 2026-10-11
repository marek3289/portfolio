/** @type {import('prettier').Config} */
export default {
  printWidth: 160,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
