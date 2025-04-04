export default {
    bracketSpacing: false,
    singleQuote: true,
    tabWidth: 4,
    printWidth: 100,
    bracketSameLine: true,
    htmlWhitespaceSensitivity: 'ignore',
    overrides: [
        {
            files: '*.js',
            options: {
                semi: true,
            },
        },
        {
            files: ['*.yaml', '*.yml'],
            options: {
                tabWidth: 2,
                singleQuote: false,
            },
        },
    ],
};
