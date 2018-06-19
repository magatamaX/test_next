// next.config.js
const isProd = process.env.NODE_ENV === 'production'
const withSass = require('@zeit/next-sass')

module.exports = withSass()
