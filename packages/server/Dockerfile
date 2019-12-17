FROM node:alpine AS all_deps
WORKDIR /opt/deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit

FROM node:alpine AS prod_deps
WORKDIR /opt/deps
ARG NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --no-audit

FROM node:alpine AS build
WORKDIR /opt/build
COPY --from=all_deps /opt/deps ./
COPY ./ ./
RUN npm run build

FROM node:alpine AS deploy
WORKDIR /opt/app
ARG NODE_ENV=production
COPY --from=prod_deps /opt/deps ./
COPY --from=build /opt/build/dist ./
CMD sleep 3 && node index.js
