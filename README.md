
#  Aliens4friends Dashboard
An expandable dashboard to filter and visualize Aliens4Friends license statistics

## Basics/Requirements

This project was created based on Laravel 8 & Laravel UI (Vue.js).

https://laravel.com/docs/8.x/
https://laravel.com/docs/7.x/frontend

Vuetify is mainly used as frontend components: https://vuetifyjs.com/

## install & run app (dev & production)

	sudo docker build . -t a4fd -f infrastructure/docker/Dockerfile
	sudo docker run -d -p [PORT]:5000 --env APP_ENV=[production|local] a4fd:local

if 'production' is passed as APP_ENV, the app will automatically force ssl/https for all requests. This prevents delivery of resources over http if the app is running behind a load balancer that resolves the certificates itself. use 'local' to develop or use the app without valid https. default is 'production'.

the app is internally accessible via port 5000. Port mapping is done according to individual requirements.

after docker run the app is reachable via hostname:[PORT].

Local development with Docker Compose (preconfigured without SSL @ port 8085):

	vendor/bin/sail up
	vendor/bin/sail npm run hot

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

### Adding company logos, trademarks, etc. in the bottom bar

If one wants to add one or more logos in the bottom bar of the dashboard, they just have to add their image files in `public/img` (or made them available from the Internet) and list them in `resources/js/presets/partner.js`, like in the following example:

```js
exports.companies = [
	{
		name : "ACME Inc.",
		title : "A Company Making Everything Inc.",
		alt: "ACME",
		size: "3",
		logo_url: "https://example.com/acme/acme.png",
		link: "https://example.com/acme"
	},
	{
		name : "ACME2 Inc.",
		title : "Another Company Making Everything Inc.",
		alt: "ACME2",
		size: "3",
		logo_url: "img/acme.png",
		link: "https://example.com/acme2"
	}
]
```

## Useful information

### Structure

The entire project-base was created by code generators and therefore follows the Laravel folder structure: https://laravel.com/docs/8.x/structure

Any dependencies are installed via Composer & Npm. Corresponding dependency source code can be found in the folders /node_modules (JS/Frontend) and /vendor (PHP/Backend).

Individual customizations are mainly, but not exclusively, located in the /resources (JS+CSS) and /app (PHP) folders.