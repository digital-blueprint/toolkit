#!/bin/bash

set -e
TAG="registry.gitlab.tugraz.at/dbp/web-components/toolkit/main:v2"
sudo docker build --tag "${TAG}" --file "Dockerfile" .
sudo docker run --rm \
    --volume "$(pwd)/..:/home/user/app" --workdir "/home/user/app" \
    --tty --interactive "${TAG}" bash
echo "Now run: sudo docker push '$TAG'"
