const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
  server: {
    port: process.env.APP_PORT || 5000,
  },
  database: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || '3306',
    user: process.env.POSTGRES_USER || 'tandat',
    password: process.env.POSTGRES_PASSWORD || '12345678',
    database: process.env.POSTGRES_DB || 'shop',
  },
};
