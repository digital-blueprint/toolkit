import commonConfig from '../../eslint.common.config.mjs';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['dist/', '*.js', 'src/scoped/ScopedElementsMixin.js', 'misc/browser-check.js', 'test/'],
    },
    ...tseslint.configs.recommended,
    ...commonConfig,
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
