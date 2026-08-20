import tseslint from 'typescript-eslint';

export default [
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
            }
        },
        rules:  {
            // We don't type everything, so disable those
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            // We keep unused vars for function args as documentation,
            '@typescript-eslint/no-unused-vars': ['error', {args: 'none'}],
            // lit auto-binds methods in templates, which causes lots of false positives
            // and re-binding in templates makes things slower, so we don't want to do that
            '@typescript-eslint/unbound-method': 'off',
        }
    },
];
