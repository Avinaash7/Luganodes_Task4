FROM node:18.1.0 AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /client
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
# Copy app files
COPY . .
# Expose port
EXPOSE 3001
# Start the app
CMD [ "yarn", "start" ]