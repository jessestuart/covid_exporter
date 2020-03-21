FROM node:13-alpine as builder

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --silent --no-progress --frozen-lockfile

COPY tsconfig.json /app/
COPY src/ /app/src/

RUN yarn tsc

FROM node:13-alpine

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION
LABEL \
  maintainer="Jesse Stuart <hi@jessestuart.com>" \
  org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.url="https://hub.docker.com/r/jessestuart/minio/" \
  org.label-schema.vcs-url="https://github.com/jessestuart/minio-multiarch" \
  org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.version=$VERSION \
  org.label-schema.schema-version="1.0"

WORKDIR /app

COPY --from=builder /app/dist dist

COPY package.json yarn.lock /app/

RUN \
  apk add --no-cache tini && \
  yarn --silent --no-progress --frozen-lockfile --prod && \
  yarn cache clean

EXPOSE 3000
# ENTRYPOINT ["yarn"]
# CMD ["start"]
ENTRYPOINT ["tini"]
CMD ["node", "dist/src/index.js"]
