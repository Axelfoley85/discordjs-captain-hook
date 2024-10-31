import globals from 'globals'

export default [
    {
        ignores: ['coverage/**/*.js', 'test/**/*.js'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node
            },
        },
        rules: {
            'indent': ['error', 4],
            'max-len': ['error', { code: 80 }],
        }
    }
]
