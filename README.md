
#  Aliens4friends Dashboard
An expandable dashboard to filter and visualize alien4friends license statistics

## Basics/Requirements

This project was created based on Laravel 8 & Laravel UI (Vue.js).

https://laravel.com/docs/8.x/
https://laravel.com/docs/7.x/frontend

Vuetify is mainly used as frontend components: https://vuetifyjs.com/

## install & run app (dev & production)

	sudo docker build . -t af4d -f infrastructure/docker/Dockerfile
	sudo docker run -d -p [PORT]:5000 --env APP_ENV=[production|local]

if 'production' is passed as APP_ENV, the app will automatically force ssl/https for all requests. This prevents delivery of resources over http if the app is running behind a load balancer that resolves the certificates itself. use 'local' to develop or use the app without valid https. default is 'production'.

the app is internally accessible via port 5000. Port mapping is done according to individual requirements.

after docker run the app is reachable via hostname:[PORT].

### further configuration

Docker container is based on https://hub.docker.com/r/webdevops/php-nginx

Container & configuration details can be found @ https://dockerfile.readthedocs.io/en/latest/content/DockerImages/dockerfiles/php-nginx.html

the configuration of the internal nginx server can be customized @ infrastructure/nginx/a4f.conf.

### run/dev without shipped Dockerfile

feel free to use https://laravel.com/docs/8.x/homestead or https://laravel.com/docs/8.x/sail as alternative dev-environments

### .env variables

the app runs in docker out of the box without any additional configuration / change of these variables.
currently no access data or other sensitive data is required to operate the app.

APP_NAME=String | used as application name by many external Laravel libraries.
APP_ENV=production | currently only possible setting with corresponding effect on code.
APP_KEY=App-Key | secret key used for encryption. Will be generated automatically by php artisan key:generate.
APP_DEBUG=Boolean | always false in production to avoid debug output including sensitive data.
APP_URL=http://laravel.test | current base-url. Used e.g. for mail dispatch, external libraries or by console commands as base-url. atm there is no use for this.

## Useful information

### Structure

The entire project-base was created by code generators and therefore follows the Laravel folder structure: https://laravel.com/docs/8.x/structure

Any dependencies are installed via Composer & Npm. Corresponding dependency source code can be found in the folders /node_modules (JS/Frontend) and /vendor (PHP/Backend).

Individual customisations are mainly, but not exclusively, located in the /resources (JS+CSS) and /app (PHP) folders.
