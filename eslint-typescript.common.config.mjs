import tseslint from 'typescript-eslint';

export default [
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
            }
        },
        rules:  {
            '@typescript-eslint/no-unused-vars': ['error', {args: 'none'}],
        }
    },
];
