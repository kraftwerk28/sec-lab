FROM node:slim
WORKDIR /opt/build
COPY ./ ./
RUN yarn install
RUN yarn build

FROM node:slim
WORKDIR /opt/app
COPY --from=0 /opt/build ./
COPY --from=0 /opt/build/dist ./
RUN yarn install --prod
CMD node index.js
