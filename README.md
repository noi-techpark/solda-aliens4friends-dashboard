
#  Aliens4friends Dashboard
An expandable dashboard to filter and visualize alien4friends license statistics

##  Local development environment

### Basics/Requirements

This project was created based on Laravel 8 & Laravel UI (Vue.js).

https://laravel.com/docs/8.x/
https://laravel.com/docs/7.x/frontend

Vuetify is mainly used as frontend components: https://vuetifyjs.com/
Sail is used for local development: https://laravel.com/docs/8.x/sail

Sail requires a running installation of Docker.

### install app & backend dependencies

    cd ~
    git clone [repo-url] solda-app
    cd ~/solda-app
    docker run --rm -v $(pwd):/app composer install
    cp .env.example .env

###  adapt .env file to your needs

The IDs of the current user must be provided as WWWUSER & WWWGROUP

### start dev-environment

    ./vendor/bin/sail up

### install & compile frontend dependencies

    ./vendor/bin/sail npm install
    ./vendor/bin/sail artisan key:generate
    ./vendor/bin/sail npm run dev

### (optional) add dev-url to your hosts-file

    127.0.0.1 laravel.test

The app can now be accessed at http://laravel.test. If changes are made to CSS or JS, the frontend files must be recompiled:

    ./vendor/bin/sail npm run dev

## Testing/Production Deployment
Deployment to any test or production environments is done manually via Rsync. A build environment with available Composer & Node and corresponding test or production environments are therefore required.

### Server-Requirements
https://laravel.com/docs/8.x/deployment

/public must be specified as the document root. It is assumed that the necessary .env files have already been configured once on the target systems.

### Backend build
    git clone [repo-url] solda-app
    cd ~/solda-app
    composer install --optimize-autoloader --no-dev

### Frontend build
     npm install
     npm run prod

### Publish
    rsync -vzrS --exclude=".*" --exclude="node_modules" --exclude="storage" /solda-app/* [user]@[ip]:[html_path]
    ssh [user]@[ip]
    cd [html_path]
    php artisan cache:clear

## Useful information

### Structure

The entire project-base was created by code generators and therefore follows the Laravel folder structure: https://laravel.com/docs/8.x/structure

Any dependencies are installed via Composer & Npm. Corresponding dependency source code can be found in the folders /node_modules (JS/Frontend) and /vendor (PHP/Backend).

Individual customisations are mainly, but not exclusively, located in the /resources (JS+CSS) and /app (PHP) folders.

### Https/Ssl

https assets should now be forced as soon as APP_ENV is set to production. if not, the asset() function in the blade templates takes a second parameter [bool|forceSecure].

* https://laravel.com/docs/8.x/requests#configuring-trusted-proxies
* https://laravel.com/docs/8.x/requests#configuring-trusted-hosts

### Known issues

The current version of https://www.npmjs.com/package/chartjs-plugin-datalabels (1.0.0) available via NPM is not compatible with the current version of chart.js. A corresponding fix has already been made available by the developer of chartjs-plugin-datalabels as an RC: https://github.com/chartjs/chartjs-plugin-datalabels/tree/v2.0.0-rc.1. Until the definitive release via npm, the fix is located under /resources/js/beta/chartjs-plugin-datalabels.js.
