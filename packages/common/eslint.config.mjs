import commonConfig from '../../eslint.common.config.mjs';

export default [
    {
        ignores: ['dist/', '*.cjs', 'src/micromodal.es.js', 'src/scoped/ScopedElementsMixin.js'],
    },
    ...commonConfig,
];
