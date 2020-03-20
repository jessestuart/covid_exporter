FROM node:13-alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN \
  apk add --no-cache tini && \
  yarn --silent --no-progress --frozen-lockfile

COPY . /app/

EXPOSE 3000
ENTRYPOINT ["yarn"]
CMD ["start"]
# ENTRYPOINT ["tini"]
# CMD ["yarn", "start"]
