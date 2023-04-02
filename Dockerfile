# FROM debian:latest
#FROM ubuntu:22.04
FROM node:18

ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8 \
    DEBIAN_FRONTEND=noninteractive \
    TZ=Europe/Berlin

RUN apt-get update && \
    apt-get install --yes --no-install-recommends \
        sqlite3 \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r captain-hook -g 1002 && \
    useradd --no-log-init -d /captain-hook -g captain-hook -u 1002 -ms /bin/bash captain-hook

COPY / /captain-hook
RUN chown captain-hook:captain-hook /captain-hook -R

USER captain-hook

RUN cd /captain-hook && \
    npm install

ENV ENVIRONMENT=${ENVIRONMENT}

CMD ["/usr/bin/node", "/captain-hook/captainHook.js"]
