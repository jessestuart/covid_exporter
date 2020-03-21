#!/bin/sh

set -eu pipefail

export VERSION=$(git rev-parse --short HEAD)
export IMAGE_ID="jessestuart/covid_exporter:$VERSION"

# Replace the repo's Dockerfile with our own.
docker build -t ${IMAGE_ID} \
  --build-arg BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
  --build-arg VCS_REF=$VERSION \
  --build-arg VERSION=$VERSION \
  .

# Login to Docker Hub.
echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin

# Push push push
docker push ${IMAGE_ID}
if [ "$CIRCLE_BRANCH" = 'master' ]; then
  docker tag "${IMAGE_ID}" "${REGISTRY}/${IMAGE}:latest-${TAG}"
  docker push "${REGISTRY}/${IMAGE}:latest-${TAG}"
fi
