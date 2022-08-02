#!/bin/bash

echo ${ENVIRONMENT}
if [[ "${ENVIRONMENT}" == "testing" ]]; then
    echo "Running tests"
    cd /captain-hook/
    npm test
elif [[ "${ENVIRONMENT}" == "production" ]]; then
    echo "Running production"
    cd /captain-hook/
    node captainHook.js
else
    echo "ENVIRONMENT was unknown, staying alive"
    tail -f /dev/null
fi
