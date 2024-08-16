FROM alpine:3.20 AS build
ARG VERSION=1.23.1

RUN apk add --no-cache autoconf autoconf-doc automake curl gcc git libc-dev libevent-dev libtool make openssl-dev pandoc pkgconfig

RUN curl -sS -o /pgbouncer.tar.gz -L https://pgbouncer.github.io/downloads/files/$VERSION/pgbouncer-$VERSION.tar.gz && \
  tar -xzf /pgbouncer.tar.gz && mv /pgbouncer-$VERSION /pgbouncer

RUN cd /pgbouncer && ./configure --prefix=/usr && make

FROM alpine:3.20

RUN apk add --no-cache busybox libevent postgresql-client && \
  mkdir -p /etc/pgbouncer /var/log/pgbouncer /var/run/pgbouncer && \
  touch /etc/pgbouncer/userlist.txt && \
  chown -R postgres /var/log/pgbouncer /var/run/pgbouncer /etc/pgbouncer

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

COPY --from=build /pgbouncer/pgbouncer /usr/bin
COPY --from=build /pgbouncer/etc/pgbouncer.ini /etc/pgbouncer/pgbouncer.ini.example
COPY --from=build /pgbouncer/etc/userlist.txt /etc/pgbouncer/userlist.txt.example

USER postgres

ENTRYPOINT ["/entrypoint.sh"]

CMD ["/usr/bin/pgbouncer", "/etc/pgbouncer/pgbouncer.ini"]