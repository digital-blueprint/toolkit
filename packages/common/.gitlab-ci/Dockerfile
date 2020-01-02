FROM debian:buster

ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    nodejs \
    chromium \
    firefox-esr \
    composer \
    php-zip \
    rsync \
    sudo \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -u 1000 -ms /bin/bash user
RUN echo 'user ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
USER user
WORKDIR /home/user

# Install deployer globally and add it to PATH
ENV COMPOSER_HOME="/home/user/.composer"
RUN mkdir -p "${COMPOSER_HOME}"
ADD composer.lock "${COMPOSER_HOME}"
ADD composer.json "${COMPOSER_HOME}"
RUN composer global install
ENV PATH "${COMPOSER_HOME}/vendor/bin:${PATH}"