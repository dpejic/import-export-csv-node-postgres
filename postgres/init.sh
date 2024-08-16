#!/bin/bash
set -e

psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 <<EOSQL
  CREATE ROLE $PGBOUNCER_USER LOGIN;
  ALTER ROLE $PGBOUNCER_USER WITH ENCRYPTED PASSWORD '$PGBOUNCER_PASSWORD';

  CREATE FUNCTION public.lookup (
      INOUT p_user     name,
      OUT   p_password text
  ) RETURNS record
      LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog AS
  \$\$SELECT usename, passwd FROM pg_shadow WHERE usename = p_user\$\$;

  REVOKE EXECUTE ON FUNCTION public.lookup(name) FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION public.lookup(name) TO $PGBOUNCER_USER;

  CREATE SCHEMA pgbouncer;
  ALTER SCHEMA pgbouncer OWNER TO $PGBOUNCER_USER;

  CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
      LANGUAGE plpgsql SECURITY DEFINER
      AS \$\$
  BEGIN
      RETURN QUERY
      SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
        WHERE usename = p_usename;
  END;
  \$\$;

  ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO $POSTGRES_USER;

  REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
  GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO $PGBOUNCER_USER;
EOSQL
