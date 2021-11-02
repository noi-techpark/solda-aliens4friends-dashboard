FROM webdevops/php-nginx:7.4-alpine as base
ARG APP_ENV=production

# restore intermediate mess
USER root

RUN apk add oniguruma-dev libxml2-dev
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

RUN cp .env.example .env

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

FROM base as jenkinsci
ARG JENKINS_GROUP_ID=2000
ARG JENKINS_USER_ID=2000
RUN groupadd -g $JENKINS_GROUP_ID jenkins && \
    useradd -ms /bin/bash --no-user-group -g $JENKINS_GROUP_ID -u $JENKINS_USER_ID jenkins

FROM base as build
# Use the .dockerignore file to exclude files from this COPY command
COPY . /var/www/html/
