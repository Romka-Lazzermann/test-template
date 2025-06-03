CREATE DATABASE IF NOT EXISTS everyexplorer;
CREATE DATABASE IF NOT EXISTS amongus_access;

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED WITH mysql_native_password  BY 'admin';
GRANT ALL PRIVILEGES ON everyexplorer.* TO 'admin'@'%';

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED WITH mysql_native_password  BY 'admin';
GRANT ALL PRIVILEGES ON everyexplorer_access.* TO 'admin'@'%';

FLUSH PRIVILEGES;