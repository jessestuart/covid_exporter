FROM node:13-alpine as builder

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --silent --no-progress --frozen-lockfile

COPY tsconfig.json /app/
COPY src/ /app/src/

RUN yarn build

FROM node:13-alpine

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
