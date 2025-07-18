import jsdoc from "eslint-plugin-jsdoc";
import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    jsdoc.configs["flat/recommended"],
    {
        plugins: {
            jsdoc: jsdoc,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.browser,
                ...globals.mocha,
                ...globals.serviceworker,
            },
        },
        rules: {
            "no-unused-vars": ["error", { "args": "none" }],
            "semi": [2, "always"],
            "jsdoc/require-jsdoc": 0,
            "jsdoc/require-param-description": 0,
            "jsdoc/require-returns": 0,
            "jsdoc/require-param-type": 0,
            "jsdoc/require-param": 0,
            "jsdoc/require-returns-description": 0,
            'jsdoc/tag-lines': 0
        },
    },
];
