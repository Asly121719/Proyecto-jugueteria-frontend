FROM php:8.3-apache

# Instalar extensiones necesarias para Laravel y PostgreSQL (Neon)
RUN apt-get update && apt-get install -y \
    libpq-dev unzip git zip curl \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && a2enmod rewrite

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Instalar dependencias de producción
RUN composer install --no-dev --optimize-autoloader

# Apuntar Apache a la carpeta /public de Laravel
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Permisos para storage y caché
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80