const mix = require('laravel-mix');

require('vuetifyjs-mix-extension')

mix.js('resources/js/app.js', 'public/js').vue().vuetify().sass('resources/sass/app.scss', 'public/css');
mix.disableNotifications();
mix.webpackConfig({
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        proxy: {
            '*': 'http://localhost:8000'
        }
    },
});
