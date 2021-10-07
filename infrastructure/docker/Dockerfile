FROM webdevops/php-nginx:7.4-alpine

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

WORKDIR /app

# copy with chown to prevent slow chown bug (also known as 'now i finally survive until deployment ends' fix)
COPY --chown=application:application . .
COPY infrastructure/nginx/a4f.conf /opt/docker/etc/nginx/a4f.conf

# do not exec composer and npm as root
USER application

# install backend & frontend dependencies & compile
RUN composer install --no-interaction --optimize-autoloader
RUN npm install
RUN npm run prod

RUN cp .env.example .env

# reload new .env
RUN php artisan config:clear

# sessions will be invalidated @ every deployment. This should work as long we don't need to use encrypt() inside our app
RUN php artisan key:generate --force
RUN php artisan jwt:secret

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
