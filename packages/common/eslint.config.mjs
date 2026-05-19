import commonConfig from '../../eslint.common.config.mjs';

export default [
    {
        ignores: ['dist/', '*.cjs', 'src/scoped/ScopedElementsMixin.js'],
    },
    ...commonConfig,
];
