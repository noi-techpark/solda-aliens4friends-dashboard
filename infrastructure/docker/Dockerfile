FROM webdevops/php-nginx:7.4-alpine
ARG APP_ENV=production

# restore intermediate mess
USER root

RUN apk add oniguruma-dev postgresql-dev libxml2-dev
RUN docker-php-ext-install \
        bcmath \
        ctype \
        fileinfo \
        json \
        mbstring \
        pdo_mysql \
        pdo_pgsql \
        tokenizer \
        xml

# install build systems
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN apk add --update npm

ENV WEB_DOCUMENT_ROOT /app/public
ENV APP_ENV $APP_ENV

WORKDIR /app

# copy with chown to prevent slow chown bug (also known as 'now i finally survive until deployment ends' fix)
COPY --chown=application:application . .
COPY ./infrastructure/nginx/a4f.conf /opt/docker/etc/nginx/conf.d

# do not exec composer and npm as root
USER application

# install backend & frontend dependencies & compile
RUN composer install --no-interaction --optimize-autoloader --no-dev
RUN npm install
RUN npm run prod

RUN cp .env.default .env

# reload new .env
RUN php artisan config:clear

# sessions will be invalidated @ every deployment. for our purposes this is ok.
RUN php artisan key:generate --force

# reload new .env
RUN php artisan config:clear

# optimizations
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# restore bash user
USER root

# reload new .env
RUN php artisan config:clear

EXPOSE 5000
