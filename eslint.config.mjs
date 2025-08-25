import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['node_modules', 'dist'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: '@typescript-eslint/parser',
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            'eqeqeq': ['error', 'always'],
        },
    },
    {
        // Отдельный блок для интеграции Prettier
        files: ['**/*.{ts,js}'],
        plugins: {
            'prettier': require('eslint-plugin-prettier'),
        },
        rules: {
            'prettier/prettier': ['error', {
                endOfLine: 'auto',
            }],
        },
    },
    prettierConfig,
];