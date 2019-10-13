FROM node:alpine
WORKDIR /opt/build
COPY ./ ./
RUN yarn install
RUN yarn build

FROM node:alpine
WORKDIR /opt/app
COPY --from=0 /opt/build/.env ./
COPY --from=0 /opt/build/package.json ./
COPY --from=0 /opt/build/yarn.lock ./
COPY --from=0 /opt/build/dist ./
RUN yarn install --prod=true
CMD sleep 3 && node index.js
