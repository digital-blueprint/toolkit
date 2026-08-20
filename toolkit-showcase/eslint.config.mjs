import commonConfig from '../eslint.common.config.mjs';
import commonConfigTyped from '../eslint-typescript.common.config.mjs';

export default [
    {
        ignores: ['dist/', '*.js', 'test'],
    },
    ...commonConfig,
    ...commonConfigTyped,
];
