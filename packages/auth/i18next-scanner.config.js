module.exports = {
    input: [
        'src/*.js',
    ],
    output: './',
    options: {
        debug: false,
        removeUnusedKeys: true,
        func: {list: ['i18n.t', '_i18n.t']},
        lngs: ['en','de'],
        defaultNs: 'dbp-auth',
        resource: {
            loadPath: 'src/i18n/{{lng}}/{{ns}}.json',
            savePath: 'src/i18n/{{lng}}/{{ns}}.json'
        },
    },
}
