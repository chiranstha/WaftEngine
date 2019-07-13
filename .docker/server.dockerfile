FROM node:10.13-alpine
ENV PROJECT_DIR=/var/www/server \
  LOG_DIR=/var/log/pm2 \
  PORT=5050
RUN npm install -g pm2 && \
  npm install -g nodemon && \
  mkdir -p $LOG_DIR && \
  mkdir -p $PROJECT_DIR
WORKDIR $PROJECT_DIR
COPY server/package.json $PROJECT_DIR
RUN npm install
COPY ./server $PROJECT_DIR
EXPOSE $PORT
CMD node index.js