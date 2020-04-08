FROM keymetrics/pm2:10-alpine
RUN apk update && apk upgrade && \
apk add --no-cache bash git openssh tzdata
WORKDIR /labshare/<%= appNameSlug %>
ARG NPM_TOKEN
COPY . .
# COPY package.json .
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc
RUN npm install
RUN npm -g config set user root
RUN npm install typescript -g
RUN npm run build
RUN rm -f .npmrc
ENTRYPOINT [ "pm2-runtime", "start", "pm2.json" ]
EXPOSE 8000