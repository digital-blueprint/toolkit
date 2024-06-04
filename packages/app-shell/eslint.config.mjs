import commonConfig from '../../eslint.common.config.mjs';

export default [
    {
        ignores: ['dist/', '*.js'],
    },
    ...commonConfig,
];
