#!/bin/bash

set -e
TAG="registry.gitlab.tugraz.at/vpu/webcomponents/common/main:v6"
sudo docker build --tag "${TAG}" --file "Dockerfile" .
echo "Now run: sudo docker push '$TAG'"
