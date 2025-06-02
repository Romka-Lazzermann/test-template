CREATE DATABASE IF NOT EXISTS amongus;
CREATE DATABASE IF NOT EXISTS amongus_access;

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED WITH mysql_native_password  BY 'admin';
GRANT ALL PRIVILEGES ON amongus.* TO 'admin'@'%';

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED WITH mysql_native_password  BY 'admin';
GRANT ALL PRIVILEGES ON amongus.* TO 'admin'@'%';

FLUSH PRIVILEGES;