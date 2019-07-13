FROM mongo:3.4.21
ENV MONGO_DATA_DIR=/data/mongodb \
  MONGO_LOG_DIR=/var/log/mongodb 
RUN apt-get update && apt-get install -y cron netcat-traditional netcat-openbsd 

RUN mkdir -p $MONGO_DATA_DIR && \
  mkdir -p $MONGO_LOG_DIR 

WORKDIR $MONGO_DATA_DIR
COPY mongodb/ $MONGO_DATA_DIR
RUN chmod +rx /data/mongodb/scripts/*.sh && \
  touch /.firstrun

CMD ["/data/mongodb/scripts/run.sh"]