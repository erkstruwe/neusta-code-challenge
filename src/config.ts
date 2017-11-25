export const config = {
    package: {
        name: process.env.npm_package_name,
        version: process.env.npm_package_version,
    },
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    baseUrl: '',
    routing: {
        caseSensitive: true,
        strict: true,
    },
}

config.baseUrl = 'http://localhost:' + config.port
