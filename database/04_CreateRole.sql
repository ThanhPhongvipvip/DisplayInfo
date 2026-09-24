CREATE ROLE db_admin
LOGIN PASSWORD 'admin123';

CREATE ROLE db_staff
LOGIN PASSWORD 'staff123';

CREATE ROLE db_readonly
LOGIN PASSWORD 'readonly123';

GRANT USAGE
ON SCHEMA auth, catalog, sales, inventory, audit
TO db_readonly;

GRANT SELECT
ON ALL TABLES IN SCHEMA auth, catalog, sales, inventory, audit
TO db_readonly;

GRANT USAGE
ON SCHEMA auth, catalog, sales, inventory, audit
TO db_staff;

GRANT SELECT, INSERT, UPDATE
ON ALL TABLES IN SCHEMA auth, catalog, sales, inventory
TO db_staff;

GRANT SELECT
ON ALL TABLES IN SCHEMA audit
TO db_staff;

GRANT USAGE
ON SCHEMA auth, catalog, sales, inventory, audit
TO db_admin;

GRANT ALL PRIVILEGES
ON ALL TABLES IN SCHEMA auth, catalog, sales, inventory, audit
TO db_admin;

GRANT ALL PRIVILEGES
ON ALL SEQUENCES IN SCHEMA auth, catalog, sales, inventory, audit
TO db_admin;