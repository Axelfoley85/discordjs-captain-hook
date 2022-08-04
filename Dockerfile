FROM ubuntu:20.04 AS captain-hook

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
        apt-transport-https \
        curl \
        gnupg \
        ca-certificates \
        dirmngr \
        git \
        less \
        sqlite3 \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r captain-hook -g 1002
RUN useradd --no-log-init -d /captain-hook -g captain-hook -u 1002 -ms /bin/bash captain-hook

RUN apt-get update \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash \
    && apt-get install --yes --no-install-recommends \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY / /captain-hook
RUN chown captain-hook:captain-hook /captain-hook -R

USER captain-hook

RUN cd /captain-hook \
    && npm install

ENV ENVIRONMENT=${ENVIRONMENT}

CMD ["/usr/bin/node", "/captain-hook/captainHook.js"]
