FROM node:18.1.0 AS development
ENV NODE_ENV development

WORKDIR /backend

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

EXPOSE 3001

CMD [ "yarn", "start" ]