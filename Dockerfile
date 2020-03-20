FROM node:13-alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN \
  apk add --no-cache curl && \
  yarn --silent --no-progress --frozen-lockfile
  # curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh -s -- -b /usr/local/bin && \
  # node-prune

COPY . /app/

EXPOSE 3000
ENTRYPOINT ["yarn"]
CMD ["start"]
