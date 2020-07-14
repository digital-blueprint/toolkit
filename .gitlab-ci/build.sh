#!/bin/bash

set -e
TAG="registry.gitlab.tugraz.at/dbp/web-components/toolkit/main:v1"
sudo docker build --tag "${TAG}" --file "Dockerfile" .
echo "Now run: sudo docker push '$TAG'"
