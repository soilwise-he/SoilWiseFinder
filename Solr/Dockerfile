FROM harbor.containers.wurnet.nl/proxy-cache/library/solr:9.7.0

USER root

COPY app/data/configsets /app/data/configsets
COPY app/data/records_active /app/data/records_active
COPY app/data/records_shadow /app/data/records_shadow
COPY app/data/security.json /app/data/security.json


RUN [ ! -d /app/data ] && mkdir -p /app/data || true && \
    [ ! -d /app/indexes ] && mkdir -p /app/indexes || true && \
    [ ! -d /app/indexes/records_active ] && mkdir -p /app/indexes/records_active || true && \
    [ ! -d /app/indexes/records_shadow ] && mkdir -p /app/indexes/records_shadow || true && \
    [ ! -d /app/logs ] && mkdir -p /app/logs || true && \
    chown -R solr:solr /app

ENV SOLR_HOME=/app/data \
    SOLR_PID_DIR=/app \
    SOLR_LOGS_DIR=/app/logs \
    SOLR_HEAP="4g" \
    SOLR_SECURITY_MANAGER_ENABLED=false \
    SOLR_OPTS="$SOLR_OPTS -Dsolr.autoSoftCommit.maxTime=10000 -Dsolr.security.manager.enabled=false"

COPY jts-core-1.20.0.jar /opt/solr-9.7.0/server/lib/ext/jts-core-1.20.0.jar

USER solr

CMD ["solr-foreground"]