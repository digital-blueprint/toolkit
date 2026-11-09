import {defineConfig} from 'i18next-cli';

export default defineConfig({
    locales: ['en', 'de'],
    extract: {
        input: ['src/**/*.js', './*.js'],
        output: 'src/i18n/{{language}}/{{namespace}}.json',
        defaultNS: 'translation',
        // The notification helpers take a translation key as their first argument.
        functions: ['t', '*.t', '*._notifySuccess', '*._notifyError'],
        indentation: 4,
    },
});
