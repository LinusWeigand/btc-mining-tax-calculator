# Docker file build config
FROM node:16.13.1-alpine AS builder
USER root
WORKDIR /home/node
ADD --chown=node:node package.json .
ADD --chown=node:node package-lock.json .
ARG BUILD_DATE
ARG VCS_REF
ENV VERSION 0.4.0

LABEL org.opencontainers.image.authors="harald.kisch@couchtec.com" \
    org.opencontainers.image.created=$BUILD_DATE \
    org.opencontainers.image.title="CouchTec/BTConnect" \
    org.opencontainers.image.description="CouchTec Software GmbH - Pipeline Runtime" \
    org.opencontainers.image.source="https://bitbucket.org/haki1312/btc" \
    org.opencontainers.image.vendor="couchtec" \
    org.opencontainers.image.revision=$VCS_REF

# Update npm
RUN npm i -g npm@8.13.1

# Install/Update yarn
RUN npm i -g yarn@1.22.19 --force

# Install nx
RUN yarn global add nx@14.4.2

# Install puppeteer so it's available in the container.
RUN yarn add puppeteer 

FROM ubuntu:latest
# git for Bibtucket Pipeline, rest for Cypress
# Source: https://docs.cypress.io/guides/guides/continuous-integration.html#Advanced-setup
RUN apt-get update 
RUN apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    libcairo2-dev \
    libgif-dev \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libjpeg-dev \
    libnotify-dev \
    libgconf-2-4 \
    librsvg2-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libpango1.0-dev \
    libxtst6 \
    xauth \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Source: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update 
RUN apt-get install -y wget gnupg 
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - 
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' 
RUN apt-get update 
RUN apt-get install -y google-chrome-stable 
RUN apt-get install -y fonts-ipafont-gothic 
RUN apt-get install -y fonts-wqy-zenhei 
RUN apt-get install -y fonts-thai-tlwg 
RUN apt-get install -y fonts-kacst 
RUN apt-get install -y fonts-freefont-ttf 
RUN apt-get install -y libxss1

RUN apt update
RUN apt install sudo
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_17.x | sudo bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential
RUN npm install --global yarn
RUN npm 

RUN rm -rf /var/lib/apt/lists/*

# Add user so we don't need --no-sandbox.
# same layer as npm install to keep re-chowned files from using up several hundred MBs more space
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser 
RUN mkdir -p /home/pptruser/Downloads 
RUN chown -R pptruser:pptruser /home/pptruser

# USER pptruser

CMD [ "node", "--version" ]