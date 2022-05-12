FROM debian:bullseye

ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND noninteractive

# https://github.com/karma-runner/karma-firefox-launcher/issues/104
ENV MOZ_FORCE_DISABLE_E10S true

RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y \
    nodejs \
    yarn \
    chromium \
    # libgbm1: newer chromium from puppeteer
    libgbm1 \
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
