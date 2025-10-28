import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import typescriptParser from '@typescript-eslint/parser'
import stylistic from '@stylistic/eslint-plugin'
import pluginNext from '@next/eslint-plugin-next'

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['**/vendor/**', '**/mazemap.min.js'],
    },
    {
        plugins: {
            '@stylistic': stylistic,
            '@next/next': pluginNext
        },
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 2024,
            parser: typescriptParser
        },
        rules: {
            ...pluginNext.configs.recommended.rules,
            'strict': 'error',
            'no-var': 'error',
            'array-callback-return': 'error',
            'yoda': 'error',
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/jsx-quotes': ['error', 'prefer-single'],
            '@stylistic/type-generic-spacing': ['error'],
            '@stylistic/type-annotation-spacing': ['error'],
            '@stylistic/no-trailing-spaces': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off'
        }
    }
]